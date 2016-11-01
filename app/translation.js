define(['underscore'], function (_) {
    var _translations = [];

    function init(translations) {
        _translations = translations;
    }

    function getTextByKey(key) {
        if (typeof _translations[key] != "string") {
            throw 'Unable to localize ' + key;
        }
        return _.unescape(_translations[key]);
    }

    return {
        init: init,
        getTextByKey: getTextByKey
    }
})