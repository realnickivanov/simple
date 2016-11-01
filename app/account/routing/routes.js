define(function () {
    'use strict';

    return [
        {
            route: 'login',
            moduleId: 'account/account',
            title: 'Login',
            rootLinkDisabled: true,
            hideExitButton: true
        }, {
            route: 'noaccess',
            moduleId: 'account/limitAccess/index',
            title: 'Limited access',
            rootLinkDisabled: true,
            hideExitButton: true
        }, {
            route: 'signin',
            moduleId: 'account/signin/index',
            title: 'Sign in',
            rootLinkDisabled: true,
            hideExitButton: true
        }, {
            route: 'register',
            moduleId: 'account/register/index',
            title: 'Register',
            rootLinkDisabled: true,
            hideExitButton: true
        }
    ];
});