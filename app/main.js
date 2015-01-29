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

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'browserSupport', 'settingsReader', 'bootstrapper'],
    function (app, viewLocator, system, modulesInitializer, browserSupport, settingsReader, bootstrapper) {
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

            var modules = [];

            //modules['modules/localStorage_progressProvider'] = true;

            return readPublishSettings().then(function () {
                return readTemplateSettings().then(function() {
                    modulesInitializer.register(modules);
                    if (!browserSupport.isSupportedMobile && !browserSupport.isSupportedBrowser) {
                        app.setRoot(browserSupport.isMobileDevice ? 'viewmodels/notsupportedbrowserMobile' : 'viewmodels/notsupportedbrowser');
                        return;
                    }

                    app.setRoot('viewmodels/shell');
                });
            }).catch(function(e) {
                console.error(e);
            });

            function readTemplateSettings() {
                return settingsReader.readTemplateSettings().then(function (settings) {
                    modules['modules/templateSettings'] = settings;
                    modules['xApi/xApiInitializer'] = settings.xApi;
                });
            }

            function readPublishSettings() {
                return settingsReader.readPublishSettings().then(function (settings) {
                    _.each(settings.modules, function (module) {
                        modules[module.name] = true;
                    });
                });
            }

        });
    }
);