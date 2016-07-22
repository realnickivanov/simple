define(['jsonReader'], function (jsonReader) {

    function readTemplateSettings() {
        return jsonReader.read('settings.js');
    }

    function readPublishSettings() {
        return jsonReader.read('publishSettings.js');
    }

    function readThemeSettings() {
        return jsonReader.read('themeSettings.js');
    }

    return {
        readTemplateSettings: readTemplateSettings,
        readPublishSettings: readPublishSettings,
        readThemeSettings: readThemeSettings
    };

});