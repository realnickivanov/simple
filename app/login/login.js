define(['knockout','underscore', 'plugins/router', 'eventManager', 'xApi/constants', 'xApi/xApiInitializer',
        'context', 'xApi/configuration/xApiSettings', 'userContext', 'modules/progress/index',
        'routing/guardLogin', 'progressContext', 'templateSettings'
    ],
    function(ko, _, router, eventManager, constants, xApiInitializer, context, xApiSettings, userContext, progressProvider, guardLogin, progressContext, templateSettings) {

        "use strict";

        var viewModel = {
            activate: activate,
            courseTitle: context.course.title,
            socialLoginAllowed: false,
            progressStorageActivated: false,
            progressStorageUrl: progressProvider.progressStorageUrl,
            isSecretLinkSent: ko.observable(false),
            sendSecretLink: sendSecretLink,
            userExists: ko.observable(false),
            useEmail: ko.observable(false),
            register: register,
            usermail: validatedValue(function(value){
                return !!value() && constants.patterns.email.test(value());
            }),
            username: validatedValue(function(value){
                return !!value();
            }),
            password: validatedValue(function(value){
                return !!value();
            }),
            passwordIsNotCorrect: ko.observable(false),
            passwordHidden: ko.observable(true),
            toglePasswordVisibility: toglePasswordVisibility,
            toggleStayLoggedIn: toggleStayLoggedIn,
            stayLoggedIn: ko.observable(false),

            allowToSkip: ko.observable(false),

            skip: skip,
            login: login,
            requestProcessing: ko.observable(false),
            loginEnabled: xApiSettings.xApi.enabled
        };

        return viewModel;
        
        function toggleStayLoggedIn(){
            viewModel.stayLoggedIn(!viewModel.stayLoggedIn());
            userContext.keepMeLoggedIn = viewModel.stayLoggedIn();
        }

        function toglePasswordVisibility() {
            viewModel.passwordHidden(!viewModel.passwordHidden());
        }

        function activate() {
            if (!viewModel.loginEnabled) {
                viewModel.skip();
                return;
            }
            if (progressProvider.isInitialized) {
                viewModel.progressStorageActivated = true;
            } else {
                viewModel.useEmail(true);
            }

            if (templateSettings.allowLoginViaSocialMedia) {
                viewModel.socialLoginAllowed = true;
            } else {
                viewModel.useEmail(true);
            }

            var user = userContext.getCurrentUser();

            if (user) {
                viewModel.username(user.username);
                viewModel.usermail(user.email);

                viewModel.stayLoggedIn(true);
                userContext.keepMeLoggedIn = viewModel.stayLoggedIn();
                register();
            }

            viewModel.allowToSkip(!xApiSettings.xApi.required);
        }
        
        function validatedValue(validateCallback){
            var value = ko.observable('');
            value.trim = function() {
                value(ko.utils.unwrapObservable(value).trim());
            };
            value.isValid = ko.computed(validateCallback.bind(null, value));
            value.isModified = ko.observable(false);
            value.markAsModified = function() {
                value.isModified(true);
                return value;
            };
            return value; 
        }

        function sendSecretLink() {
            viewModel.isSecretLinkSent(true);
            progressProvider.sendSecretLink(viewModel.usermail(), context.course.title, true);
        }

        function register() {
            if (viewModel.usermail.isValid() && viewModel.username.isValid()) {
                viewModel.requestProcessing(true);
                if (viewModel.progressStorageActivated) {
                    if (templateSettings.xApi.enabled) {
                        xApiInitializer.activate(viewModel.username(), viewModel.usermail()).then(function() {
                            registerUser();
                        });
                    } else {
                        registerUser();
                    }
                } else {
                    xApiInitializer.activate(viewModel.username(), viewModel.usermail()).then(function() {
                        viewModel.requestProcessing(false);
                        startCourse();
                    });
                }
            } else {
                viewModel.usermail.markAsModified();
                viewModel.username.markAsModified();
            }

            function registerUser() {
                progressProvider.register(viewModel.usermail(), viewModel.username(), context.course.title, viewModel.stayLoggedIn())
                    .then(function(response) {
                        if (_.isString(response.password)) {
                            userContext.user.password = response.password;
                        }
                        startCourse();
                    }).fail(function(reason) {
                        if (reason.status == 409) {
                            viewModel.userExists(true);
                        }
                    }).always(function() {
                        userContext.user.email = viewModel.usermail();
                        userContext.user.username = viewModel.username();
                        viewModel.requestProcessing(false);
                    });
            }
        }

        function skip() {
            if (!viewModel.allowToSkip() && viewModel.loginEnabled) {
                return;
            }
            guardLogin.removeGuard();
            progressProvider.deactivateProgressStorage();
            xApiInitializer.deactivate();
            startCourse();
        }

        function login() {
            viewModel.passwordIsNotCorrect(false);
            if (viewModel.password.isValid()) {
                viewModel.requestProcessing(true);
                progressProvider.login(viewModel.usermail(), viewModel.password(), viewModel.stayLoggedIn()).then(function() {
                    progressProvider.syncProviders().then(function() {
                        if (templateSettings.xApi.enabled) {
                            xApiInitializer.activate(viewModel.username(), viewModel.usermail()).then(function() {
                                initProgress();
                                viewModel.requestProcessing(false);
                            });
                        } else {
                            initProgress();
                            viewModel.requestProcessing(false);
                        }
                    });
                }).fail(function(reason) {
                    if (reason.status == 403) {
                        viewModel.passwordIsNotCorrect(true);
                    }
                    viewModel.requestProcessing(false);
                });
            } else {
                viewModel.password.markAsModified();
            }
        }

        function startCourse() {
            eventManager.courseStarted();
            router.navigate('');
        }
        
        function initProgress() {
            progressContext.use(progressProvider.progressProvider);
            eventManager.courseStarted();
            if (progressContext.ready()) {
                var progress = progressContext.get();
                if (_.isObject(progress)) {
                    if (_.isString(progress.url)) {
                        router.navigate(progress.url.replace('objective', 'section')); //fix for old links
                    }
                    if (_. isObject(progress.answers)) {
                        _.each(context.course.sections, function(section) {
                            _.each(section.questions, function(question) {
                                if (!_.isNullOrUndefined(progress.answers[question.shortId])) {
                                    question.progress(progress.answers[question.shortId]);
                                }
                            });
                        });
                    }
                }
            }
        }
    });