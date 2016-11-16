define(['underscore'], function (_) {
    'use strict';

    return {
        routes: [{
            route: ['', 'introduction'],
            moduleId: 'viewmodels/introduction',
            title: 'Introduction'
        }, {
            route: 'sections',
            moduleId: 'viewmodels/sections',
            title: 'Sections',
            displayTreeOfContent: true
        }, {
            route: 'section/:sectionId/question/:questionId',
            moduleId: 'viewmodels/questions/content',
            title: 'Question',
            displayTreeOfContent: true,
            showExitButton: true,
            rootLinkEnabled: true
        }, {
            route: 'finish',
            moduleId: 'resultPage/resultPage',
            title: 'Results'
        }, {
            route: '404(/:url)',
            moduleId: 'viewmodels/404',
            title: 'Not found'
        }],
        add: add
    };

    function add(routes) {
        var self = this;
        if (_.isObject(routes) && _isRouteCorrect(routes)) {
            this.routes.push(routes);
        } else if (_.isArray(routes)) {
            _.each(routes, function (route) {
                if (_isRouteCorrect(route)) {
                    self.routes.push(route);
                } else {
                    throw 'Route not correct';
                }
            });
        }
    };

    function _isRouteCorrect(route) {
        return _.isObject(route) && route.hasOwnProperty('route') &&
            route.hasOwnProperty('moduleId') && route.hasOwnProperty('title');
    }
});