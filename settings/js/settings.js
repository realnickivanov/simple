$(function (app) {

    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    function sortByName(a, b) {
        var aName = a.name.toLowerCase();
        var bName = b.name.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + '//' + location.host,
        settingsURL = baseURL + '/api/course/' + courseId + '/template/' + templateId,

        currentSettings = null,
        currentExtraData = null;


    var viewModel = {
        trackingData: (function () {
            var data = {};

            data.enableXAPI = ko.observable(true),

            data.lrsOptions = [
                { key: 'default', text: 'easygenerator (recommended)' },
                { key: 'custom', text: 'Custom LRS' }
            ];

            data.selectedLrs = ko.observable(data.lrsOptions[0].key);

            ko.utils.arrayMap(data.lrsOptions, function (lrsOption) {
                lrsOption.isSelected = ko.computed({
                    read: function () {
                        return data.selectedLrs() == lrsOption.key;
                    },
                    write: function () { }
                });
                lrsOption.select = function () {
                    ko.utils.arrayForEach(data.lrsOptions, function (item) {
                        item.isSelected(false);
                    });
                    lrsOption.isSelected(true);
                    data.selectedLrs(lrsOption.key);
                };
                return lrsOption;
            });

            data.customLrsEnabled = ko.computed(function () {
                return data.enableXAPI() && data.selectedLrs() != data.lrsOptions[0].key;
            });

            data.lrsUrl = ko.observable('');
            data.authenticationRequired = ko.observable(false);
            data.lapLogin = ko.observable();
            data.lapPassword = ko.observable();

            data.credentialsEnabled = ko.computed(function () {
                return data.customLrsEnabled() && data.authenticationRequired();
            });

            data.statements = {
                started: ko.observable(true),
                stopped: ko.observable(true),
                experienced: ko.observable(true),
                mastered: ko.observable(true),
                answered: ko.observable(true),
                passed: ko.observable(true),
                failed: ko.observable(true)
            };

            return data;
        })(),

        advancedSettingsExpanded: ko.observable(false),
        toggleAdvancedSettings: function () {
            this.advancedSettingsExpanded(!this.advancedSettingsExpanded());
        },

        logo: new app.LogoModel(),
        themes: new app.Themes(),

        languages: [],
        selectedLanguage: ko.observable(null),

        hasStarterPlan: ko.observable(false),
        masteryScore: ko.observable(100)
    };

    viewModel.getSettingsData = function () {
        return {
            logo: {
                url: viewModel.logo.url()
            },
            xApi: {
                enabled: viewModel.trackingData.enableXAPI(),
                selectedLrs: viewModel.trackingData.selectedLrs(),
                lrs: {
                    uri: viewModel.trackingData.lrsUrl(),
                    authenticationRequired: viewModel.trackingData.authenticationRequired(),
                    credentials: {
                        username: viewModel.trackingData.lapLogin(),
                        password: viewModel.trackingData.lapPassword()
                    }
                },
                allowedVerbs: $.map(viewModel.trackingData.statements, function (value, key) {
                    return value() ? key : undefined;
                })
            },
            masteryScore: {
                score: viewModel.masteryScore()
            },
            theme: {
                key: viewModel.themes.selected()
            },
            selectedLanguage: viewModel.selectedLanguage(),
            customTranslations: $.map(viewModel.languages['xx'], function (value) {
                return { key: value.key, value: viewModel.escapeHtml(value.value()) };
            })
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


    viewModel.isCustom = ko.computed(function () {
        return viewModel.selectedLanguage() === 'xx';
    });

    viewModel.getCustomTranslations = function () {
        return [];
    }

    viewModel.saveChanges = function () {
        var settings = viewModel.getSettingsData(),
            extraData = viewModel.getExtraData();

        if (JSON.stringify(currentSettings) === JSON.stringify(settings) && JSON.stringify(currentExtraData) === JSON.stringify(extraData)) {
            return;
        }

        sendPostMessage({ type: 'startSave' });

        $.post(settingsURL, { settings: JSON.stringify(settings), extraData: JSON.stringify(extraData) })
            .done(function () {
                currentSettings = settings;
                currentExtraData = extraData;
                sendPostMessage({ type: 'finishSave', data: { success: true, message: 'All changes are saved' } });
            })
            .fail(function () {
                sendPostMessage({ type: 'finishSave', data: { success: false, message: 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.' } });
            });


        function sendPostMessage(message) {
            var editorWindow = window.parent;
            editorWindow.postMessage(message, window.location.href);
        }
    };

    $(window).on('blur', viewModel.saveChanges);

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().done(function () {
            var manifest = api.getManifest(),
                user = api.getUser(),
                settings = api.getSettings(),
                extraData;

            if (user.accessType > 0) {
                imageUploader.init();
            }

            var defaultLrs = settings.xApi.enabled ? 'custom' : 'default';

            viewModel.trackingData.enableXAPI(settings.xApi.enabled || false);
            viewModel.trackingData.selectedLrs(settings.xApi.selectedLrs || defaultLrs);
            viewModel.trackingData.lrsUrl(settings.xApi.lrs.uri || '');
            viewModel.trackingData.authenticationRequired(settings.xApi.lrs.authenticationRequired || false);
            viewModel.trackingData.lapLogin(settings.xApi.lrs.credentials.username || '');
            viewModel.trackingData.lapPassword(settings.xApi.lrs.credentials.password || '');

            if (settings.xApi.allowedVerbs) {
                $.each(viewModel.trackingData.statements, function (key, value) {
                    value($.inArray(key, settings.xApi.allowedVerbs) > -1);
                });
            }

            viewModel.logo.url(settings.logo.url || '');

            if (settings.masteryScore && settings.masteryScore.score && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            }

            if (settings.theme && settings.theme.key) {
                viewModel.themes.setSelected(settings.theme.key);
            }

            viewModel.languages = manifestResponse.languages;

            if (settings.customTranslations && settings.customTranslations.length > 0) {
                viewModel.languages.push({
                    key: 'xx',
                    name: 'k',
                    values: settings.customTranslations
                });
            }

            if (settings.selectedLanguage) {
                //TODO: check if selected existis
                viewModel.selectedLanguage(settings.selectedLanguage);
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

            //if (extraData.selectedLanguage != null && extraData.selectedLanguage != undefined) {
            //    viewModel.selectedLanguage(extraData.selectedLanguage);
            //}


            currentSettings = viewModel.getSettingsData();
            currentExtraData = viewModel.getExtraData();
        }).fail(function () {
            //TODO: should show error
        });
    }

    viewModel.init().done(function () {
        ko.applyBindings(viewModel, $('#settingsForm')[0]);
    });

    //#region Image uploader

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

                viewModel.logo.url(response.data.url);
                imageUploader.status.default();
            } catch (e) {
                imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
            } finally {
                imageUploader.button.enable();
            }
        }
    };

    //#endregion Image uploader

})(window.app || {});