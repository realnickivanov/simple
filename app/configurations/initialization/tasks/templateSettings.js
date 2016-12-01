define(['underscore', 'plugins/router'], function (_, router) {
    'use strict';

    var defaultSettings = {
        masteryScore: {
            score: 100
        },
        logoUrl: '',
        sectionsLayout: {
            key: ''
        },
        xApi: {},
        pdfExport: {},
        languages: {}
    };

    return function (settings, themeSettings, manifest) {
        var preset = manifest && _.isArray(manifest.presets) ? manifest.presets[0] : null;
        var defaultThemeSettings = preset != null ? preset.settings : {};
        var defaultTemplateSettings = manifest && manifest.defaultTemplateSettings ? manifest.defaultTemplateSettings : null;

        if (_.isNullOrUndefined(defaultTemplateSettings)) {
            throw 'Manifest don\'t have defaultTemplateSettings';
        }

        /**
         * fix for fonts and colors:
         * remove nulls from fonts array, because deepDiff in case with arrays returns array with the only changed element
         * e.g: deepDiff({ array: [{ id: 1 }, { id: 2 }] }, { array: [{ id: 1 }, { id: 3 }] }) => { array: [ , { id: 2 }] }
         * the first element in returned array will be not defined, json convert will return { array: [null, { id: 2 }] }
         * that'a why nulls should be deleted or untracked.
         */
        settings && _.isArray(settings.fonts) && removeNullsInArray(settings.fonts);
        themeSettings && _.isArray(themeSettings.fonts) && removeNullsInArray(themeSettings.fonts);
        settings && settings.branding && _.isArray(settings.branding.colors) && removeNullsInArray(settings.branding.colors);
        themeSettings && themeSettings.branding && _.isArray(themeSettings.branding.colors) && removeNullsInArray(themeSettings.branding.colors);
        /** end fix */

        var designSettings = _.defaults(themeSettings, defaultThemeSettings);
        var templateSettings = _.defaults(settings, defaultTemplateSettings);
        var fullSettings = deepExtend(templateSettings, designSettings);

        /** Mastery score */
        if (fullSettings.masteryScore) {
            var score = Number(fullSettings.masteryScore.score);
            defaultSettings.masteryScore.score = (_.isNumber(score) && score >= 0 && score <= 100) ? score : 100;
        }

        /** Course logo */
        if (fullSettings.branding.logo && fullSettings.branding.logo.url && fullSettings.branding.logo.url.length) {
            defaultSettings.logoUrl = fullSettings.branding.logo.url;
        }

        /** Sections layout */
        if (!_.isEmptyOrWhitespace(fullSettings.sectionsLayout.key)) {
            defaultSettings.sectionsLayout = fullSettings.sectionsLayout.key;
        }
        defaultSettings.treeOfContent = fullSettings.treeOfContent;
        defaultSettings.colors = fullSettings.branding.colors;
        defaultSettings.fonts = fullSettings.fonts;

        defaultSettings.background = fullSettings.branding.background;
        defaultSettings.xApi = fullSettings.xApi;
        defaultSettings.pdfExport = fullSettings.pdfExport;
        defaultSettings.showConfirmationPopup = fullSettings.showConfirmationPopup;
        defaultSettings.allowContentPagesScoring = fullSettings.allowContentPagesScoring;
        defaultSettings.allowCrossDeviceSaving = fullSettings.allowCrossDeviceSaving;
        defaultSettings.allowLoginViaSocialMedia = fullSettings.allowLoginViaSocialMedia;

        defaultSettings.hideFinishActionButtons = fullSettings.hideFinishActionButtons;
        defaultSettings.hideTryAgain = fullSettings.hideTryAgain;

        defaultSettings.languages.selected = fullSettings.languages.selected;
        defaultSettings.languages.customTranslations = fullSettings.languages.customTranslations;

        updateSettingsFromQueryString();
        updateSettingsByMode();

        return defaultSettings;
    };

    function deepExtend(destination, source) {
        if (_.isNullOrUndefined(destination)) {
            return source;
        }

        for (var property in source) {
            if (!source.hasOwnProperty(property)) {
                continue;
            }

            if (source[property] && source[property].constructor &&
                (source[property].constructor === Object || source[property].constructor === Array)) {
                if (destination.hasOwnProperty(property)) {
                    deepExtend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            } else {
                destination[property] = destination.hasOwnProperty(property) ? destination[property] : source[property];
            }
        }
        return destination;
    }

    function removeNullsInArray(array) {
        if (array && array.length) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === null) {
                    delete array[i];
                }
            }
        }
    }

    function updateSettingsFromQueryString() {
        var xapi = router.getQueryStringValue('xapi');
        var crossDevice = router.getQueryStringValue('cross-device');

        if (isXapiDisabled()) {
            defaultSettings.xApi.enabled = false;
        }
        if (isCrossDeviceDisabled()) {
            defaultSettings.allowCrossDeviceSaving = false;
        }

        function isXapiDisabled() {
            return !defaultSettings.xApi.required &&
                !_.isNullOrUndefined(xapi) &&
                xapi.toLowerCase() === 'false';
        }

        function isCrossDeviceDisabled() {
            return !_.isNullOrUndefined(crossDevice) &&
                crossDevice.toLowerCase() === 'false';
        }
    }

    function updateSettingsByMode(){
        var reviewApiUrl = router.getQueryStringValue('reviewApiUrl');
        if(location.href.indexOf('/preview/') !== -1 || !!reviewApiUrl){
            defaultSettings.allowCrossDeviceSaving = false;
            defaultSettings.xApi.enabled = false;
        }
    }
});