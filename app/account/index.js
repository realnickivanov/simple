define(['plugins/router', 'routing/routes', 'templateSettings', 'publishSettings', 'includedModules/modulesInitializer',
        './limitAccess/accessLimiter', './routing/guardRoute', './routing/routes', 'xApi/xApiInitializer', 'modules/progress/progressStorage/auth', 'modules/publishModeProvider'
    ],
    function (router, mainRoutes, templateSettings, publishSettings, modulesInitializer, accessLimiter, guardRoute, routes, xApiInitializer, auth, publishModeProvider) {
        'use strict';

        return {
            enable: enable
        };

        function enable() {
            var xAPI = templateSettings.xApi.enabled;
            var crossDeviceSaving = templateSettings.allowCrossDeviceSaving;
            
            if (publishModeProvider.isScormEnabled) {
                return;
            }

            if (publishModeProvider.isPreview || publishModeProvider.isReview) {
               return;
            }
            
            accessLimiter.initialize(publishSettings.accessLimitation);

            if (xAPI || crossDeviceSaving || accessLimiter.accessLimitationEnabled()) {
                guardRoute.createGuard();
                mainRoutes.add(routes);
            }
        }

    });