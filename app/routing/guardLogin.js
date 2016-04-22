define(['plugins/router', 'underscore'], function(router, _) {
    'use strict';

    var defaultGuard = null;

    return {
        createGuard: function(userAuthenticated) {
            var guardView = 'login';
            defaultGuard = router.guardRoute;

            router.guardRoute = function(model, route) {
                if (route.config.route == guardView) {
                    return userAuthenticated() ? '' : true;
                }
                if (!userAuthenticated()) {
                    return route.queryString ? guardView + '?' + route.queryString : guardView;
                }
                if (_.isFunction(defaultGuard)) {
                    return defaultGuard(model, route);
                }
                return true;
            };
        },
        removeGuard: function() {
            router.guardRoute = defaultGuard;
        }
    };
});