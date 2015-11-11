define(['templateSettings', 'themes/themeSelector'], function (templateSettings, themeSelector) {
    "use strict";

    var themesInjector = {
        themesPath: 'css/themes',
        defaultThemeKey: 'default',

        init: init
    };

    return themesInjector;

    function init() {
        var
            selectedThemeKey = themeSelector.currentTheme,
            themePath = themesInjector.themesPath + '/' + selectedThemeKey + '.css';

        return injectStylesheetToDocument(themePath);
    }

    function injectStylesheetToDocument(url) {
        return $.get(url).then(function (cssText) {
            var style = $('<style>');
            style.attr('type', 'text/css');
            style.append(cssText);
            style.appendTo('head');
        });
    }
});