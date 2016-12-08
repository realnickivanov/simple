requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions'
    }
});

define('jquery', function () {
    return jQuery;
});
define('knockout', function () {
    return ko;
});
define('WebFont', function () {
    return WebFont;
});
define('q', function () {
    return Q;
});
define('underscore', function () {
    return _;
});
define('perfectScrollbar', function () {
    return Ps;
});

define(['durandal/app', 'durandal/system', 'underscore', 'bootstrapper', 'templateSettings', 'publishSettings', 'includedModules/modulesInitializer',
        'modules/index'
    ],
    function (app, system, _, bootstrapper, templateSettings, publishSettings, modulesInitializer, modulesLoader) {
        app.title = 'easygenerator';

        system.debug(false);

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true,
            widget: true
        });

        app.start().then(function () {
            bootstrapper.run();

            return ConfigurationReader.read().then(function (configsFiles) {
                var configs = ConfigurationReader.init(configsFiles);
                templateSettings.init(configs.templateSetting);
                TranslationPlugin.init(configs.translations);
                publishSettings.init(configsFiles.publishSettings);

                return modulesLoader.init(templateSettings, configsFiles.manifest, publishSettings).then(function () {
                    if (publishSettings.modules) {
                        return modulesInitializer.load(publishSettings.modules).then(initializeApp);
                    } else {
                        initializeApp();
                    }
                });
            }).catch(function (e) {
                console.error(e);
            });
        });

        function initializeApp() {
            app.setRoot('viewmodels/shell');
        }
    });
