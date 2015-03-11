(function (app) {

    function sortByName(a, b) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    var
        currentSettings = null,
        currentExtraData = null,
        baseURL = location.protocol + '//' + location.host;

    var viewModel = {
        trackingData: new app.TrackingDataModel(),
        languages: new app.LanguagesModel(),
        logo: new app.LogoModel(),
        themes: new app.ThemesModel(),

        masteryScore: ko.observable(100),

        userHasStarterPlan: ko.observable(false)
    };

    viewModel.getSettingsData = function () {
        return {
            logo: viewModel.logo.getData(),
            xApi: viewModel.trackingData.getData(),
            masteryScore: { score: viewModel.masteryScore() },
            theme: viewModel.themes.selectedThemeName(),
            selectedLanguage: viewModel.languages.selected(),
            customTranslations: viewModel.languages.setCustomTranslations()
        };
    }

    viewModel.getExtraData = function () {
        return {};
    }

    viewModel.escapeHtml = function (html) {
        return $('<div/>').text(html).html();
    }

    viewModel.unescapeHtml = function (text) {
        return $('<div/>').html(text).text();
    }

    viewModel.saveChanges = function () {
        var settings = viewModel.getSettingsData(),
            extraData = viewModel.getExtraData(),
            newSettings = JSON.stringify(settings),
            newExtraData = JSON.stringify(extraData);

        if (JSON.stringify(currentSettings) === newSettings && JSON.stringify(currentExtraData) === newExtraData) {
            return;
        }

        window.egApi.saveSettings(newSettings, newExtraData, app.localize('changes are saved'), app.localize('changes are not saved'))
            .done(function () {
                currentSettings = settings;
                currentExtraData = extraData;
            });
    };

    $(window).on('blur', viewModel.saveChanges);

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().done(function () {
            var manifest = api.getManifest(),
                user = api.getUser(),
                settings = api.getSettings();

            if (user.accessType > 0) {
                viewModel.userHasStarterPlan(true);
            }

            if (settings.xApi) {
                viewModel.trackingData.setxApiSettings(settings.xApi);
            }

            viewModel.logo.setUrl(settings.logo.url);

            if (settings.masteryScore && settings.masteryScore.score && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            }

            if (settings.theme && settings.theme.key) {
                viewModel.themes.selectByName(settings.theme.key);
            }

            if (manifest.languages) {
                viewModel.languages.addLanguages(manifest.languages);
            }

            if (settings.customTranslations && settings.customTranslations.length > 0) {
                viewModel.languages.setCustomTranslations(settings.customTranslations);
            }

            if (settings.selectedLanguage) {
                viewModel.languages.select(settings.selectedLanguage);
            }


            //var customTranslations = viewModel.getCustomTranslations();

            //if (extraData.customTranslations.length == 0 && settings.translations != null) {
            //    $.each(settings.translations, function (i) {
            //        $.each(customTranslations, function (j) {
            //            if (settings.translations[i].key === customTranslations[j].key) {
            //                customTranslations[j].value(viewModel.unescapeHtml(settings.translations[i].value));
            //            }
            //        });
            //    });

            //    viewModel.selectedLanguage('xx');
            //    return;
            //}

            //$.each(extraData.customTranslations, function (i) {
            //    $.each(customTranslations, function (j) {
            //        if (extraData.customTranslations[i].key === customTranslations[j].key) {
            //            customTranslations[j].value(viewModel.unescapeHtml(extraData.customTranslations[i].value));
            //        }
            //    });
            //});

            currentSettings = viewModel.getSettingsData();
            currentExtraData = viewModel.getExtraData();
        }).fail(function () {
            //TODO: should show error
        });
    }

    //#region Image uploader

    function imageUploaderViewModel() {
        var imageUploader = {
            apiUrl: baseURL + '/storage/image/upload',
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
            somethingWentWrongMessage: { title: 'Something went wrong', description: 'Please, try again' },

            status: {
                default: function () {
                    viewModel.logo.setDefaultStatus();
                },
                fail: function (reason) {
                    viewModel.logo.setFailedStatus(reason.title, reason.description);
                },
                loading: function () {
                    viewModel.logo.isLoading(true);
                }
            },

            button: {
                enable: function () {
                    this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
                },
                disable: function () {
                    this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
                },
                submit: function () {
                    this.$input[0].form.submit();
                    this.disable();
                    imageUploader.status.loading();
                },
                $input: $('#logoInput')
            },

            init: function () {
                imageUploader.button.$input.on('change', imageUploader.processFile);
                imageUploader.button.enable();
            },

            processFile: function () {
                if (!this.files) {
                    imageUploader.button.submit();
                    return;
                }
                if (this.files.length === 0) {
                    return;
                }

                var file = this.files[0],
                    fileExtension = file.name.split('.').pop().toLowerCase();

                if ($.inArray(fileExtension, imageUploader.supportedExtensions) === -1) {
                    imageUploader.status.fail({ title: 'Unsupported image format', description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')' });
                    return;
                }
                if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                    imageUploader.status.fail({ title: 'File is too large', description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)' });
                    return;
                }
                imageUploader.uploadFile(file);
            },

            uploadFile: function (file) {
                imageUploader.button.disable();
                imageUploader.status.loading();

                var formData = new FormData();
                formData.append('file', file);

                $.ajax({
                    url: imageUploader.apiUrl,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                }).done(function (response) {
                    imageUploader.handleResponse(response);
                }).fail(function () {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                });
            },

            handleResponse: function (response) {
                try {
                    if (!response) {
                        throw 'Response is empty';
                    }

                    if (typeof response != 'object') {
                        response = JSON.parse(response);
                    }

                    if (!response || !response.success || !response.data) {
                        throw 'Request is not success';
                    }

                    viewModel.logo.setUrl(response.data.url);
                    imageUploader.status.default();
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                } finally {
                    imageUploader.button.enable();
                }
            }
        }
        return imageUploader;
    }

    //#endregion Image uploader

    viewModel.init().done(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            if (window.egApi.getUser().accessType > 0) {
                var imageUploader = new imageUploaderViewModel();
                imageUploader.init();
            }
        });
    });

})(window.app = window.app || {});