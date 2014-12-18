define(['durandal/app', 'translation', 'constants'],
    function(app, translation, constants) {

        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            window.close();
            app.trigger(constants.events.appClosed);
            _.delay(function() {
                window.alert(translation.getTextByKey('[thank you message]'));
            }, 100);
        }

    }
);