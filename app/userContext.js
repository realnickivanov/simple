define(['plugins/router'], function (router) {
    var self = {
        currentUser: null
    },
        context = {
            initialize: initialize,
            getCurrentUser: getCurrentUser
        }
    ;

    return context;

    function getCurrentUser() {
        return self.currentUser;
    }

    function initialize() {
        return Q.fcall(function () {
            var username = router.getQueryStringValue('name'),
                email = router.getQueryStringValue('email');

            if (username || email) {
                self.currentUser = { username: username ? username : '', email: email ? email : '' };
            }
        });
    }
});