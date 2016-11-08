define(['eventManager', 'progressContext', 'userContext'],
    function (eventManager, progressContext, userContext) {
        'use strict';

        return {
            extend: extend
        };

        function extend(module) {
            if (_.isFunction(module.courseFinished)) {
                eventManager.subscribeForEvent(eventManager.events.courseFinished).then(module.courseFinished);
            }
            if (_.isFunction(module.courseFinalized)) {
                eventManager.subscribeForEvent(eventManager.events.courseFinalized).then(module.courseFinalized);
            }
            if (_.isObject(module.userInfoProvider)) {
                userContext.use(module.userInfoProvider);
            }
            if (_.isObject(module.progressProvider)) {
                progressContext.use(module.progressProvider);
            }
        }
    });