define(['durandal/app', 'durandal/composition', 'plugins/router', 'routing/routes', 'context', 'modulesInitializer', 'templateSettings', 'background', 'progressContext', 'constants', 'userContext', 'errorsHandler', 'lessProcessor'],
    function (app, composition, router, routes, context, modulesInitializer, templateSettings, background, progressContext, constants, userContext, errorsHandler, lessProcessor) {

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
            isInReviewMode: router.getQueryStringValue('reviewApiUrl'),


            viewSettings: function () {
                var settings = {
                    rootLinkEnabled: true,
                    exitButtonVisible: true,
                    treeOfContentVisible: true
                };

                var activeInstruction = router.activeInstruction();
                if (_.isObject(activeInstruction)) {
                    settings.rootLinkEnabled = !activeInstruction.config.rootLinkDisabled && !router.isNavigationLocked();
                    settings.exitButtonVisible = !activeInstruction.config.hideExitButton;
                    settings.treeOfContentVisible = templateSettings.treeOfContent.enabled && activeInstruction.config.displayTreeOfContent;
                }
                return settings;
            },

            title: '',
            createdOn: null,
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
                            return lessProcessor.init(templateSettings.colors, templateSettings.fonts).then(function () {
                                that.title = app.title = dataContext.course.title;
                                that.createdOn = dataContext.course.createdOn;

                                if (progressContext.ready()) {
                                    var progress = progressContext.get();
                                    if (_.isObject(progress)) {
                                        if (_.isString(progress.url)) {
                                            window.location.hash = progress.url.replace('objective', 'section'); //fix for old links
                                        }

                                        if (_.isObject(progress.answers)) {
                                            _.each(dataContext.course.sections, function (section) {
                                                _.each(section.questions, function (question) {
                                                    if (!_.isNullOrUndefined(progress.answers[question.shortId])) {
                                                        question.progress(progress.answers[question.shortId]);
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }


                                app.trigger(constants.events.appInitialized);
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
