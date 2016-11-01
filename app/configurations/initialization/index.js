define(['./tasks/templateSettings', './tasks/translations'],
    function (getTemplateSettings, getTranslations) {
        'use strict';

        function initialize(configs) {
            var templateSetting = getTemplateSettings(configs.templateSettings, configs.themeSettings, configs.manifest);
            var translations = getTranslations(configs.translations, templateSetting);
            return {
                templateSetting: templateSetting,
                translations: translations
            };
        }
        return {
            initialize: initialize
        };
    });