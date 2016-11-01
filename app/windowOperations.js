define(['durandal/app', 'constants'],
    function(app, constants) {

        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            window.close();
            app.trigger(constants.events.appClosed);
        }
    }
);