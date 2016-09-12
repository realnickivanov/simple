define(['plugins/router'], function(router) {
    var context = {
        use: use,
        initialize: initialize,
        getCurrentUser: getCurrentUser,
        user: new UserContext()
    };
    
    return context;

    function UserContext() {
        this.account = null;
        this.email = null;
        this.username = null;
        this.password = null;
        this.keepMeLoggedIn = false;
        this.showProgressStorageInfo = true;
    }

    function getCurrentUser() {
        return (context.user.email || context.user.account) && context.user.username ? context.user : null;
    }

    function use(userInfoProvider) {
        if(!userInfoProvider) {
            return;
        }
        var accountId = userInfoProvider.getAccountId(),
            accountHomePage = userInfoProvider.getAccountHomePage(),
            username = userInfoProvider.getUsername();
        if(!accountId || !accountHomePage || !username) {
            return;
        }
        context.user.email = accountId;
        context.user.username = username;
        context.user.account = {
            homePage: accountHomePage,
            name: accountId
        };
    }

    function initialize() {
        return Q.fcall(function() {
            var username = router.getQueryStringValue('name'),
                email = router.getQueryStringValue('email'),
                hideContinueCourseOptions = router.getQueryStringValue('hideContinueCourseOptions');

            if (username || email) {
                context.user.email = email ? email : '';
                context.user.username = username ? username : '';
            }

            context.user.showProgressStorageInfo = hideContinueCourseOptions == null;
        });
    }
});