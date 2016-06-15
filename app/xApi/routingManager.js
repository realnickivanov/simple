define(['plugins/router', './configuration/routes'], function(router, routes) {
    'use strict';

    return {
        mapRoutes: function() {
            router.map(routes);
        }
    };
});