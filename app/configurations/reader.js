define(['q', 'underscore', './fileReader'], function (Q, _, fileReader) {
    'use strict';

    var configs = {
        templateSettings: {},
        themeSettings: {},
        publishSettings: {},
        manifest: {},
        translations: {}
    };

    var _initialized = false;

    var reader = {
        read: read
    };
    return reader;

    function read() {
        var defer = Q.defer();

        if (_initialized) {
            defer.resolve(configs);
        }

        readConfigurations().then(function () {
            readTranslations().then(function () {
                _initialized = true;
                defer.resolve(configs);
            });
        });

        return defer.promise;
    }

    function readConfigurations() {
        var promises = [];
        promises.push(fileReader.readJSON('settings.js').then(function (data) {		
            configs.templateSettings = data;		
        }));
        promises.push(fileReader.readJSON('publishSettings.js').then(function (data) {
            configs.publishSettings = data;
        }));
        promises.push(fileReader.readJSON('themeSettings.js').then(function (data) {
            configs.themeSettings = data;
        }));
        promises.push(fileReader.readJSON('manifest.json').then(function (data) {
            configs.manifest = data;
        }));
        return Q.all(promises);
    };

    function readTranslations() {
        var defer = Q.defer(),
            languages = configs.templateSettings.languages || configs.manifest.defaultTemplateSettings.languages,
            code = 'en';

        if (_.isNull(configs.manifest) || _.isNull(configs.settings)) {
            throw 'Run {readConfigurations} firstly';
        }

        _readTranslation(code).then(function(defaultTrnaslation){
            configs.translations[code] = defaultTrnaslation;

            if (languages && languages.selected && languages.selected !== 'xx') {
                code = languages.selected;
                _readTranslation(code).then(function(resultTranslations){
                    configs.translations[code] = resultTranslations;
                    defer.resolve();
                });
            } else {
                defer.resolve();
            }
        });

        return defer.promise;

        function _readTranslation(code) {
            var langUrl = _getLangUrlByCode(code);
            return fileReader.readJSON(langUrl);
        }

        function _getLangUrlByCode(code) {
            var lang = _.find(configs.manifest.languages, function (item) {
                return item.code === code;
            });
            if (!_.isNull(lang) && !_.isUndefined(lang)) {
                return lang.url;
            } else {
                throw 'Translations for [' + code + '] not found! Please contact template developer.';
            }
        }
    };


});