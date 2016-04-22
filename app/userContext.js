define(['plugins/router'], function(router) {
    var context = {
        initialize: initialize,
        getCurrentUser: getCurrentUser,
        user: new UserContext()
    };
    
    return context;

    function UserContext() {
        this.email = null;
        this.username = null;
        this.password = null;
        this.keepMeLoggedIn = false;
    }

    function getCurrentUser() {
        return context.user.email && context.user.username ? context.user : null;
    }

    function initialize() {
        return Q.fcall(function() {
            var username = router.getQueryStringValue('name'),
                email = router.getQueryStringValue('email');

            if (username || email) {
                context.user.email = email ? email : '';
                context.user.username = username ? username : '';
            }
        });
    }
});