define(['durandal/app', 'durandal/composition', 'plugins/router', 'configuration/routes', 'context', 'modulesInitializer', 'templateSettings', 'themesInjector', 'background', 'progressContext', 'constants'],
    function (app, composition, router, routes, context, modulesInitializer, templateSettings, themesInjector, background, progressContext, constants) {


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
                    navigationEnabled: true
                };

                var activeInstruction = router.activeInstruction();
                if (_.isObject(activeInstruction)) {
                    settings.rootLinkEnabled = !activeInstruction.config.rootLinkDisabled;
                    settings.navigationEnabled = !activeInstruction.config.hideNav;
                }
                return settings;
            },

            logoUrl: ko.observable(''),
            isNavigatingToAnotherView: ko.observable(false),
            isClosed: ko.observable(false),
            compositionComplete: compositionComplete,


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
                    return modulesInitializer.init().then(function () {
                        that.logoUrl(templateSettings.logoUrl);

                        return themesInjector.init().then(function () {
                            app.title = dataContext.course.title;

                            if (progressContext.ready()) {
                                viewModel.isProgressDirty = ko.observable(true);

                                viewModel.saveProgress = function () {
                                    if (viewModel.isProgressDirty()) {
                                        progressContext.save();
                                    }
                                }

                                app.on('progressContext:dirty:changed').then(function (isProgressDirty) {
                                    viewModel.isProgressDirty(isProgressDirty);
                                });


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

                            return router.map(routes)
                                .buildNavigationModel()
                                .mapUnknownRoutes('viewmodels/404', '404')
                                .activate();
                        });
                    });
                });
            }

        };

        function compositionComplete() {
            background.apply(templateSettings.background)

        }

        return viewModel;

    });
