define(['../guard'],
    function (guard) {
        "use strict";

        var languageMap = function(text) {
            guard.throwIfNotString(text, 'You should provide valid text according to \'RFC 5646 Language Tag\'.');

            return {
                "en-US": text
            };
        };

        return languageMap;

    }
);