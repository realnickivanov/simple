define(['durandal/app', 'plugins/router', 'constants'],
    function (app, router, constants) {
        "use strict";

        var lastError;
        var started = false;

        function handleError(error) {
            if (error && error.navigateUrl) {
                setTimeout(function() {
                    router.navigate(error.navigateUrl, { replace: true, trigger: true });
                }, 100);
            }
        }

        function startHandle() {
            started = true;
            handleError(lastError);
        };

        app.on(constants.events.onError).then(function (error) {
            if (started) {
                handleError(error);
            } else {
                lastError = error;
            }
        });

        return {
            startHandle: startHandle
        }
    }
);