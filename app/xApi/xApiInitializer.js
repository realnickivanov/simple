define(['durandal/app', 'plugins/router', './routingManager', './requestManager', './activityProvider', './configuration/xApiSettings', './configuration/viewConstants', './statementQueueHandler', './errorsHandler', 'context', 'progressContext', 'userContext', 'eventManager'],
    function (app, router, routingManager, requestManager, activityProvider, xApiSettings, viewConstants, statementQueueHandler, errorsHandler, context, progressContext, userContext, eventManager) {
        "use strict";

        var
            isInitialized = false,
            moduleSettings = null,

            xApiInitializer = {
                isActivated: isActivated,
                activate: activate,
                deactivate: deactivate,

                initialize: initialize,
            };

        return xApiInitializer;

        function isActivated() {
            return isInitialized;
        }

        function deactivate() {
            activityProvider.turnOffSubscriptions();
            routingManager.removeRoutes();
            isInitialized = false;
            app.trigger('user:authentication-skipped');
        }

        //Initialization function for moduleManager
        function initialize(settings) {
            return Q.fcall(function () {
                moduleSettings = settings;

                return xApiSettings.init(moduleSettings).then(function () {

                    var user = userContext.getCurrentUser(),
                        progress = progressContext.get(),
                        isCourseStarted = _.isObject(progress) && _.isObject(progress.user);

                    if (user && user.username && viewConstants.patterns.email.test(user.email)) {
                        return activate(user.username, user.email).then(function () {
                            if (!isCourseStarted) {
                                return eventManager.courseStarted();
                            }
                        });
                    }

                    if (_.isObject(progress)) {
                        if (_.isObject(progress.user)) {
                            return activate(progress.user.username, progress.user.email);
                        }
                        if (progress.user === 0) {
                            deactivate();
                            return;
                        }
                    }

                    routingManager.createGuard(xApiInitializer, 'login');
                    routingManager.mapRoutes();
                });
            });
        }


        function activate(username, email) {
            var actor = activityProvider.createActor(username, email);

            var id = context.course.id;
            var title = context.course.title;

            var url = "";
            if (window != window.top && ('referrer' in document)) {
                url = document.referrer;
            } else {
                url = window.location.toString();
            }

            url = url + '?course_id=' + context.course.id;

            return Q.all([
                  requestManager.init(moduleSettings),
                  activityProvider.init(id, actor, title, url)
            ]).spread(function () {
                isInitialized = true;
                statementQueueHandler.handle();
                app.trigger('user:authenticated', {
                    username: username,
                    email: email
                });
            }).fail(function (reason) {
                xApiInitializer.deactivate();
                errorsHandler.handleError(reason);
            });;
        }
    }
);