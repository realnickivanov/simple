define([], function () {

    return [
        {
            route: 'login',
            moduleId: 'xApi/viewmodels/login',
            title: 'Login',
            rootLinkDisabled: true,
            exitButtonDisabled: true
        },
        {
            route: 'xapierror(/:backUrl)',
            moduleId: 'xApi/viewmodels/xAPIError',
            title: 'xAPI Error',
            rootLinkDisabled: true,
            exitButtonDisabled: true
        }
    ];

});