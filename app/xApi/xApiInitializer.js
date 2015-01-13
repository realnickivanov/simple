define(['plugins/router', './routingManager', './requestManager', './activityProvider', 'xApi/configuration/xApiSettings', './statementQueueHandler', './errorsHandler', 'context'],
    function (router, routingManager, requestManager, activityProvider, xApiSettings, statementQueueHandler, errorsHandler, context) {
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
        }

        //Initialization function for moduleManager
        function initialize(settings, progressContext) {
            return Q.fcall(function () {
                moduleSettings = settings;

                if (_.isObject(progressContext)) {
                    if (_.isObject(progressContext.user)) {
                        activate(progressContext.user.username, progressContext.user.email);
                        return;
                    }
                    if (progressContext.user === 0) {
                        deactivate();
                        return;
                    }
                }

                routingManager.createGuard(xApiInitializer, 'login');
                routingManager.mapRoutes();

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
                  xApiSettings.init(moduleSettings),
                  requestManager.init(moduleSettings),
                  activityProvider.init(id, actor, title, url)
            ]).spread(function () {
                isInitialized = true;
                statementQueueHandler.handle();
            }).fail(function (reason) {
                xApiInitializer.deactivate();
                errorsHandler.handleError(reason);
            });;
        }
    }
);