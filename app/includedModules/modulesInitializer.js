define(['underscore', 'q', './moduleLoader', './appExtender'],
    function (_, Q, moduleLoader, appExtender) {
        'use strict';

        var _loadedModules = [];

        return {
            hasModule: hasModule,
            load: load
        };

        function hasModule(moduleName) {
            moduleName = moduleName || '';
            return _.contains(_loadedModules, moduleName);
        }

        function load(modules) {
            var modulesIds = _.map(modules, function(module){
                return module.name;
            });

            var defer = Q.defer();


            loadModulesSequentially();

            return defer.promise;

            function loadModulesSequentially() {
                if (modulesIds.length == 0) {
                    defer.resolve();
                    return;
                }


                var module = modulesIds.shift();
                moduleLoader.loadModule('../includedModules/' + module)
                    .then(initializeModule)
                    .then(extendAppFromModule)
                    .then(function () {
                        _loadedModules.push(module);
                        loadModulesSequentially();
                    })
                    .fail(onModuleLoadingFailed);
            }
        }

        function initializeModule(module) {
            return Q.fcall(function () {
                if (_.isFunction(module.initialize)) {
                    module.initialize();
                }
                return module;
            });
        }

        function extendAppFromModule(module) {
            appExtender.extend(module)
        }

        function onModuleLoadingFailed(error) {
            throw 'Cannot load module"' + error.modulePath + '". because of next error "' + error.message + '".';
        }
    }
);