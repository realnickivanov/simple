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
            if (!inIframe()) {
                _.delay(function() {
                    window.alert(translation.getTextByKey('[thank you message]'));
                }, 100);
            }
        }
        
        function inIframe() {
            // browsers can block access to window.top due to same origin policy, so exception can be thrown here.
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        }
    }
);