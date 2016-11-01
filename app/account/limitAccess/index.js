define(['plugins/router', 'context', 'userContext', './accessLimiter'], function (router, context, userContext, accessLimiter) {

    "use strict";

    return {
        courseTitle: context.course.title,
        canActivate: function () {
            var user = userContext.getCurrentUser();
            if (!accessLimiter.accessLimitationEnabled() || (user && accessLimiter.userHasAccess(user))) {
                return { redirect: '/' };
            }

            return true;
        },
        activate: function () {
        },
        backToSignin: function () {
            userContext.clear();
            router.navigate('login');
        }
    };
});