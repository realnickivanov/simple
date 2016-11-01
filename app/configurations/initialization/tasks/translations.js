define(['underscore'], function (_) {
    'use strict';
    
    var defaultTranslationsCode = 'en';

    return function(translations, templateSettings){
        var languageCode = templateSettings.languages.selected;
        var customTranslations = templateSettings.languages.customTranslations;
        var resolvedTranslations = [];

        if (!languageCode || languageCode === defaultTranslationsCode) {
            resolvedTranslations = [];
        }

        if (languageCode === 'xx') {
            resolvedTranslations = customTranslations || [];
        }

        if(languageCode !== defaultTranslationsCode && languageCode !== 'xx'){
            resolvedTranslations = translations[languageCode]; 
        }

        translations = _.defaults(resolvedTranslations, translations[defaultTranslationsCode]);
        return translations;
    };
});