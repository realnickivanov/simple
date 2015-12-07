define(['durandal/app', 'durandal/composition', 'plugins/router', 'routing/routes', 'context', 'modulesInitializer', 'templateSettings', 'themes/themeSelector', 'themes/themeInjector', 'background', 'progressContext', 'constants', 'userContext', 'errorsHandler', 'lessProcessor'],
    function (app, composition, router, routes, context, modulesInitializer, templateSettings, themeSelector, themeInjector, background, progressContext, constants, userContext, errorsHandler, lessProcessor) {

        var viewModel = {
            router: router,
            cssName: ko.computed(function () {
                var activeItem = router.activeItem();
                if (_.isObject(activeItem)) {
                    var moduleId = activeItem.__moduleId__;
                    moduleId = moduleId.slice(moduleId.lastIndexOf('/') + 1);
                    return moduleId;
                }
                return '';
            }),


            viewSettings: function () {
                var settings = {
                    rootLinkEnabled: true,
                    exitButtonVisible: true
                };

                var activeInstruction = router.activeInstruction();
                if (_.isObject(activeInstruction)) {
                    settings.rootLinkEnabled = !activeInstruction.config.rootLinkDisabled && !router.isNavigationLocked();
                    settings.exitButtonVisible = !activeInstruction.config.hideExitButton;
                }
                return settings;
            },

            logoUrl: ko.observable(''),
            isNavigatingToAnotherView: ko.observable(false),
            isClosed: ko.observable(false),
            compositionComplete: compositionComplete,
            pdfExportEnabled: false,

            activate: function () {
                var that = this;

                router.on('router:route:activating').then(function (newView) {
                    var currentView = router.activeItem();
                    if (newView && currentView && newView.__moduleId__ === currentView.__moduleId__) {
                        return;
                    }
                    that.isNavigatingToAnotherView(true);
                });

                app.on(constants.events.appClosed).then(function () {
                    that.isClosed(true);
                });

                return context.initialize().then(function (dataContext) {
                    return userContext.initialize().then(function () {
                        return modulesInitializer.init().then(function () {
                            that.logoUrl(templateSettings.logoUrl);
                            that.pdfExportEnabled = templateSettings.pdfExport.enabled;
                            themeSelector.init();
                            return themeInjector.init().then(function () {
                                lessProcessor.init(templateSettings.colors)
                            }).then(function () {
                                app.title = dataContext.course.title;

                                if (progressContext.ready()) {
                                    var progress = progressContext.get();
                                    if (_.isObject(progress)) {
                                        if (_.isString(progress.url)) {
                                            window.location.hash = progress.url;
                                        }

                                        if (_.isObject(progress.answers)) {
                                            _.each(dataContext.course.objectives, function (objective) {
                                                _.each(objective.questions, function (question) {
                                                    if (!_.isNullOrUndefined(progress.answers[question.shortId])) {
                                                        question.progress(progress.answers[question.shortId]);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }

                                return router.map(routes).buildNavigationModel().mapUnknownRoutes('viewmodels/404', '404').activate().then(function () {
                                    errorsHandler.startHandle();
                                });
                            });
                        });
                    });
                });
            }

        };

        function compositionComplete() {
            background.apply(templateSettings.background);
        }

        return viewModel;

    });
