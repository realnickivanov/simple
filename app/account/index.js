define(['plugins/router', 'routing/routes', 'templateSettings', 'publishSettings', 'includedModules/modulesInitializer',
        './limitAccess/accessLimiter', './routing/guardRoute', './routing/routes', 'xApi/xApiInitializer', 'modules/progress/progressStorage/auth'
    ],
    function (router, mainRoutes, templateSettings, publishSettings, modulesInitializer, accessLimiter, guardRoute, routes, xApiInitializer, auth) {
        'use strict';

        return {
            enable: enable
        };

        function enable() {
            var xAPI = templateSettings.xApi.enabled;
            var isScormEnabled = modulesInitializer.hasModule('lms');
            var crossDeviceSaving = templateSettings.allowCrossDeviceSaving;
            
            if (isScormEnabled) {
                return;
            }

            var reviewApiUrl = router.getQueryStringValue('reviewApiUrl');
            if(location.href.indexOf('/preview/') !== -1 || !!reviewApiUrl){
               return;
            }
            
            accessLimiter.initialize(publishSettings.accessLimitation);

            if (xAPI || crossDeviceSaving || accessLimiter.accessLimitationEnabled()) {
                guardRoute.createGuard();
                mainRoutes.add(routes);
            }
        }

    });