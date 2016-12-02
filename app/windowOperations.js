define(['durandal/app', 'constants'],
    function(app, constants) {

        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            if (window.opener && window !== window.opener) {
                window.close();
            }
            app.trigger(constants.events.appClosed);
        }
    }
);