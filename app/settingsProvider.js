define(['settingsReader'], function (settingsReader) {

    var
        _templateSettings = {
            source: {},
            read: settingsReader.readTemplateSettings
        },

        _publishSettings = {
            source: {},
            read: settingsReader.readPublishSettings
        },

        _themeSettings = {
            source: {},
            read: settingsReader.readThemeSettings
        };
    
    
    function getTemplateSettings() {
        return getSettings(_templateSettings);
    }

    function getPublishSettings() {
        return getSettings(_publishSettings);
    }

    function getThemeSettings() {
        return getSettings(_themeSettings);
    }

    function getSettings(_settings) {
        var defer = Q.defer();

        if(_.isEmpty(_settings.source)) {
            _settings.read()
                .then(function(settings) {
                    _settings.source = settings;

                    defer.resolve(_settings.source);
                });
        } else {          
            defer.resolve(_settings.source);
        }

        return defer.promise;
    }

    return {
        getTemplateSettings: getTemplateSettings,
        getPublishSettings: getPublishSettings,
        getThemeSettings: getThemeSettings
    };

});