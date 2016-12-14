define(function () {
    'use strict';

    return [
        {
            route: 'login',
            moduleId: 'account/account',
            title: TranslationPlugin.getTextByKey('[login page title]')
        }, {
            route: 'noaccess',
            moduleId: 'account/limitAccess/index',
            title: TranslationPlugin.getTextByKey('[limited access page title]')
        }, {
            route: 'signin',
            moduleId: 'account/signin/index',
            title: TranslationPlugin.getTextByKey('[sign in page title]')
        }, {
            route: 'register',
            moduleId: 'account/register/index',
            title: TranslationPlugin.getTextByKey('[register page title]')
        }
    ];
});