define(['templateSettings'], function (templateSettings) {
    "use strict";

    var themesSelector = {
        defaultThemeKey: 'default',
        currentTheme: '',
        init: init
    };

    return themesSelector;

    function init() {
        themesSelector.currentTheme = getCurrentThemeKey();
    }

    function getCurrentThemeKey() {
        var selectedThemeKey = getQueryStringParameterByName('theme');
        if (_.isEmptyOrWhitespace(selectedThemeKey)) {
            selectedThemeKey = (!!templateSettings.theme && !!templateSettings.theme.key) ? templateSettings.theme.key : themesSelector.defaultThemeKey;
        }

        return selectedThemeKey;
    }

    function getQueryStringParameterByName(name) {
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

});