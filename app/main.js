requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions'
    }
});

define('jquery', function () { return jQuery; });
define('knockout', function () { return ko; });

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'bootstrapper', 'templateSettings', 'settingsReader', 'translation'],
    function(app, viewLocator, system, modulesInitializer, bootstrapper, templateSettings, settingsReader, translation) {
        app.title = 'easygenerator';

        system.debug(false);

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true,
            widget: true
        });

        app.start().then(function() {
            bootstrapper.run();

            var modules = {};

            modules['modules/localStorage_progressProvider'] = true;

            return readPublishSettings().then(function() {
                return readTemplateSettings().then(function(settings) {
                    return initTemplateSettings(settings).then(function() {
                        return initTranslations(settings).then(function() {
                            modulesInitializer.register(modules);
                            app.setRoot('viewmodels/shell');
                        });
                    });
                });
            }).catch(function(e) {
                console.error(e);
            });


            function readPublishSettings() {
                return settingsReader.readPublishSettings().then(function(settings) {
                    _.each(settings.modules, function(module) {
                        modules['../includedModules/' + module.name] = true;
                    });
                });
            }

            function readTemplateSettings() {
                return settingsReader.readTemplateSettings();
            }

            function initTemplateSettings(settings) {
                return templateSettings.init(settings).then(function() {
                    modules['xApi/xApiInitializer'] = templateSettings.xApi;
                });
            }

            function initTranslations(settings) {
                return translation.init(settings.languages.selected, settings.languages.customTranslations);
            }
        });
    }
);