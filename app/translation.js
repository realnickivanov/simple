define(['translationsReader'], function (translationsReader) {
    var translations = [];
    var defaultTranslationsCode = 'en';

    function init(languageCode, customTranslations) {
        if (languageCode === 'xx') {
            return translationsReader.readTranslations(defaultTranslationsCode).then(function (defaultTranslations) {
                translations = _.defaults(customTranslations, defaultTranslations);
            });
        }
        else {
            return translationsReader.readTranslations(languageCode || defaultTranslationsCode).then(function (selectedTranslations) {
                translations = selectedTranslations;
            });
        }
    }

    function getTextByKey(key) {
        if (translations[key]) {
            return _.unescape(translations[key]);
        }
        throw 'Unable to localize ' + key;
    }

    return {
        init: init,
        getTextByKey: getTextByKey
    }
})