define(function () {
    'use strict';

    return [
        {
            route: 'login',
            moduleId: 'account/account',
            title: 'Login'
        }, {
            route: 'noaccess',
            moduleId: 'account/limitAccess/index',
            title: 'Limited access'
        }, {
            route: 'signin',
            moduleId: 'account/signin/index',
            title: 'Sign in'
        }, {
            route: 'register',
            moduleId: 'account/register/index',
            title: 'Register'
        }
    ];
});