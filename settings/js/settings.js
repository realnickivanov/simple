$(function () {
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + "//" + location.host,
        settingsURL = baseURL + "/api/course/" + courseId + "/template/" + templateId,

        index = location.toString().indexOf('/settings/settings.html'),
        templateUrl = location.toString().substring(0, index),

        starterAccessType = 1;

    var viewModel = {
        enableXAPI: ko.observable(false),
        lrsUrl: ko.observable(''),
        authenticationRequired: ko.observable(false),
        lapLogin: ko.observable(),
        lapPassword: ko.observable(),
        isSaved: ko.observable(false),
        isFailed: ko.observable(false),

        logo: (function () {
            var logo = {};

            logo.url = ko.observable('').extend({ throttle: 300 });
            logo.hasLogo = ko.computed(function () {
                return logo.url() !== '';
            });
            logo.clear = function () {
                logo.url('');
            };
            logo.isError = ko.observable(false);
            logo.errorText = ko.observable('');
            logo.errorDescription = ko.observable('');
            logo.isLoading = ko.observable(false);

            return logo;
        })(),

        themes: (function () {
            var themes = {};

            themes.list = [
                {
                    title: 'Cartoon light',
                    key: 'cartoon'
                },
                {
                    title: 'Grey scheme',
                    key: 'grey'
                },
                {
                    title: 'Black scheme',
                    key: 'black'
                },
                {
                    title: 'Flat scheme',
                    key: 'flat'
                }
            ];
            themes.default = 'cartoon';
            themes.selected = ko.observable('');

            ko.utils.arrayMap(themes.list, function (theme) {
                theme.isSelected = ko.observable(false);
                theme.select = function () {
                    ko.utils.arrayForEach(themes.list, function (item) {
                        item.isSelected(false);
                    });
                    theme.isSelected(true);
                    themes.selected(theme.key);
                };
                return theme;
            });

            themes.setSelected = function (key) {
                var theme = ko.utils.arrayFirst(themes.list, function (item) {
                    return item.key == key;
                });
                if (!!theme) {
                    theme.select();
                }
            };

            themes.setSelected(themes.default);

            themes.openDemo = function () {
                window.open(templateUrl + '?theme=' + themes.selected(), '_blank');
            };

            return themes;
        })(),

        translations: [
            { key: '[course]', value: ko.observable('Course:') },
            { key: '[start course]', value: ko.observable('Start course') },
            { key: '[finish course]', value: ko.observable('Finish course') },
            { key: '[learning objectives]', value: ko.observable('Learning objectives:') },
            { key: '[start]', value: ko.observable('Start') },
            { key: '[home]', value: ko.observable('Home') },
            { key: '[learning content]', value: ko.observable('Learning content') },
            { key: '[submit]', value: ko.observable('Submit') },
            { key: '[try again]', value: ko.observable('Try again') },
            { key: '[next]', value: ko.observable('Next') },
            { key: '[correct answer]', value: ko.observable('Correct answer') },
            { key: '[incorrect answer]', value: ko.observable('Incorrect answer') },
            { key: '[previous question]', value: ko.observable('previous') },
            { key: '[next question]', value: ko.observable('next') },
            { key: '[text matching question hint]', value: ko.observable('Drag items from right column to the left to match the pairs') },
            { key: '[text matching question drop here]', value: ko.observable('Drop here') },
            { key: '[statement question true text]', value: ko.observable('True') },
            { key: '[statement question false text]', value: ko.observable('False') },
            { key: '[drag and drop question all texts are placed]', value: ko.observable('All texts are placed') },
            { key: '[drag and drop question drop here]', value: ko.observable('Drop here') },
            { key: '[fill in the blank choose answer]', value: ko.observable('Choose the answer...') },
            { key: '[thank you message]', value: ko.observable('Thank you. It is now safe to close this page.') },
            { key: '[there are no questions]', value: ko.observable('No questions') },
            { key: '[browser not supported]', value: ko.observable('Your browser is currently not supported.') },
            { key: '[browser not supported hint]', value: ko.observable('Don’t worry, there is an easy fix. All you have to do is click one of the icons below and follow the instructions.') },
            { key: '[page not found title]', value: ko.observable('Page not found (404)') },
            { key: '[page not found message]', value: ko.observable("Sorry, the page you have been looking for has not been found. Try checking the URL on errors, use the navigation above or click 'Home' link below.") },
            { key: '[tracking and tracing header]', value: ko.observable('Your credentials for progress tracking') },
            { key: '[tracking and tracing hint]', value: ko.observable('Please enter your credentials and click "Start and report my progress" to enable progress tracking. Otherwise, click "Do not report, just start".') },
            { key: '[tracking and tracing name field]', value: ko.observable('Your name') },
            { key: '[tracking and tracing email field]', value: ko.observable('Your e-mail') },
            { key: '[tracking and tracing name is not valid]', value: ko.observable('Fill in your name') },
            { key: '[tracking and tracing email is not valid]', value: ko.observable('Enter a valid e-mail') },
            { key: '[tracking and tracing skip reporting]', value: ko.observable('Do not report, just start') },
            { key: '[tracking and tracing start]', value: ko.observable('Start and report my progress') },
            { key: '[tracking and tracing error]', value: ko.observable('Something is wrong') },
            { key: '[tracking and tracing error hint]', value: ko.observable('If you continue without restarting, your learning progress will not be reported.') },
            { key: '[tracking and tracing restart course]', value: ko.observable('Restart course') },
            { key: '[tracking and tracing continue anyway]', value: ko.observable('Continue anyway') },
            { key: '[tracking and tracing reporting progress]', value: ko.observable('reporting progress...') },
            { key: '[tracking and tracing not supported]', value: ko.observable('Progress tracking cannot be established') },
            { key: '[tracking and tracing not supported hint]', value: ko.observable('Sorry, this course does not support progress tracking in Internet Explorer 9. Please use one of the following browser: Chrome, Firefox, Safari, IE10+ in order to track your progress, or just start the course without tracking.') }
        ],

        hasStarterPlan: ko.observable(true),
        statements: {
            started: ko.observable(true),
            stopped: ko.observable(true),
            experienced: ko.observable(true),
            mastered: ko.observable(true),
            answered: ko.observable(true),
            passed: ko.observable(true),
            failed: ko.observable(true)
        },
        masteryScore: ko.observable('')
    };

    viewModel.credentialsEnabled = ko.computed(function () {
        return viewModel.enableXAPI() && viewModel.authenticationRequired();
    });

    viewModel.escapeHtml = function (html) {
        return $('<div/>').text(html).html();
    }

    viewModel.unescapeHtml = function (text) {
        return $('<div/>').html(text).text();
    }

    viewModel.saveChanges = function () {
        var settings = {
            logo: {
                url: viewModel.logo.url()
            },
            xApi: {
                enabled: viewModel.enableXAPI(),
                lrs: {
                    uri: viewModel.lrsUrl(),
                    authenticationRequired: viewModel.authenticationRequired(),
                    credentials: {
                        username: viewModel.lapLogin(),
                        password: viewModel.lapPassword()
                    }
                },
                allowedVerbs: $.map(viewModel.statements, function (value, key) {
                    return value() ? key : undefined;
                })
            },
            masteryScore: {
                score: viewModel.masteryScore()
            },
            theme: {
                key: viewModel.themes.selected()
            },
            translations: $.map(viewModel.translations, function (value) {
                return { key: value.key, value: viewModel.escapeHtml(value.value()) };
            })
        };

        viewModel.isFailed(false);
        viewModel.isSaved(false);

        $.post(settingsURL, { settings: JSON.stringify(settings) })
            .done(function () {
                viewModel.isSaved(true);
            })
            .fail(function () {
                viewModel.isFailed(true);
            });
    };

    //#region Binding handlers

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.unwrap(value)) {
                $(element).fadeIn();
            } else {
                $(element).fadeOut();
            }
        }
    };

    ko.bindingHandlers.number = {
        init: function (element) {
            var $element = $(element),
                maxValue = 100;
            $element.on('keydown', function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) ||
                        (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $element.on('keyup', function () {
                if ($(this).val() > maxValue) {
                    $(this).val(maxValue);
                }
            });
        }
    };

    ko.bindingHandlers.disableDragNDrop = {
        init: function (element) {
            $(element).on('dragstart', function (event) {
                event.preventDefault();
            });
        }
    };

    ko.bindingHandlers.spinner = {
        init: function (element, valueAccessor) {
            var masteryScore = valueAccessor();

            $(element).spinner('changed', function (e, newValue) {
                masteryScore(newValue);
            });

        }
    };

    //#endregion Binding handlers

    ko.applyBindings(viewModel, $("#settingsForm")[0]);

    //#region Image uploader

    var imageUploader = {
        apiUrl: baseURL + '/storage/image/upload',
        maxFileSize: 10, //MB
        supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
        somethingWentWrongMessage: { title: 'Something went wrong', description: 'Please, try again' },

        status: {
            default: function () {
                viewModel.logo.isLoading(false);
                viewModel.logo.isError(false);
            },
            fail: function (reason) {
                viewModel.logo.clear();
                viewModel.logo.isLoading(false);
                viewModel.logo.errorText(reason.title);
                viewModel.logo.errorDescription(reason.description);
                viewModel.logo.isError(true);
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

        initFrame: function () {
            $('#logoForm').attr('action', imageUploader.apiUrl);
            $('#logoFrame').on('readystatechange', function () {
                if (this.readyState != "complete") {
                    return;
                }

                try {
                    var response = this.contentDocument.body.innerHTML;
                    imageUploader.handleResponse(response);
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                }
            });
        },

        init: function () {
            if (window.top.navigator.userAgent.match(/MSIE 9/i)) {
                imageUploader.initFrame();
            }

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
            formData.append("file", file);

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
                    throw "Response is empty";
                }

                if (typeof response != "object") {
                    response = JSON.parse(response);
                }

                if (!response || !response.success || !response.data) {
                    throw "Request is not success";
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

    //#region Ajax requests

    $.ajax({
        cache: false,
        url: settingsURL,
        dataType: "json",
        success: function (json) {
            var settings;
            try {
                settings = JSON.parse(json);
            } catch (e) {
                settings = { logo: {}, xApi: { lrs: { credentials: {} } }, masteryScore: {} };
            }
            viewModel.enableXAPI(settings.xApi.enabled || false);
            viewModel.lrsUrl(settings.xApi.lrs.uri || '');
            viewModel.authenticationRequired(settings.xApi.lrs.authenticationRequired || false);
            viewModel.lapLogin(settings.xApi.lrs.credentials.username || '');
            viewModel.lapPassword(settings.xApi.lrs.credentials.password || '');
            viewModel.logo.url(settings.logo.url || '');
            if (typeof settings.masteryScore != 'undefined' && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            } else {
                viewModel.masteryScore(100);
            }

            if (settings.xApi.allowedVerbs) {
                $.each(viewModel.statements, function (key, value) {
                    value($.inArray(key, settings.xApi.allowedVerbs) > -1);
                });
            }

            if (settings.theme && settings.theme.key) {
                viewModel.themes.setSelected(settings.theme.key);
            }

            $.each(settings.translations, function (i) {
                $.each(viewModel.translations, function (j) {
                    if (settings.translations[i].key === viewModel.translations[j].key) {
                        viewModel.translations[j].value(viewModel.unescapeHtml(settings.translations[i].value));
                    }
                });
            });
        },
        error: function () {
            viewModel.masteryScore(100);
        }
    });

    $.ajax({
        url: baseURL + '/api/identify',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (user) {
            if (user.hasOwnProperty('subscription') && user.subscription.hasOwnProperty('accessType')) {
                var hasStarterAccess = user.subscription.accessType >= starterAccessType && new Date(user.subscription.expirationDate) >= new Date();
                viewModel.hasStarterPlan(hasStarterAccess);

                if (hasStarterAccess) {
                    imageUploader.init();
                }
            } else {
                viewModel.hasStarterPlan(false);
            }
        },
        error: function () {
            viewModel.hasStarterPlan(false);
        }
    });

    //#endregion Ajax requests

});