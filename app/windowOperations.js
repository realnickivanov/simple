define(['durandal/app', 'translation', 'constants'],
    function (app, translation, constants) {

        "use strict";

        var
            windowOperations = {
                close: close
            };

        return windowOperations;

        function close() {
            window.close();
            app.trigger(constants.events.appClosed);
            if (navigator.appName != "Microsoft Internet Explorer") {
                _.delay(function () {
                    window.alert(translation.getTextByKey('[thank you message]'));
                }, 100);
            }
        }

    }
);