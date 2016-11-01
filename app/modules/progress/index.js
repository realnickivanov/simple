define(['q', 'underscore', 'context', 'userContext', 'templateSettings', './localStorage/index', './progressStorage/index',
        './progressStorage/auth'
    ],
    function (Q, _, context, userContext, templateSettings, LocalStorageProvider, ProgressStorageProvider, auth) {
        'use strict';
        var _psProvider = null,
            _lsProvider = null;

        return {
            initialize: initialize,
            initProgressStorage: initProgressStorage,
            clearLocalStorage: clearLocalStorage
        };

        function initialize() {
            var defer = Q.defer();

            _psProvider = new ProgressStorageProvider(context.course.id, context.course.templateId);
            _lsProvider = new LocalStorageProvider(context.course.id, context.course.templateId);

            if(userContext.user.email){
                auth.signout();
            }

            if (templateSettings.allowCrossDeviceSaving) {
                var token = auth.getValueFromUrl('token');

                if (!_.isNull(token)) {
                    auth.setToken(token);
                }

                if (auth.authenticated) {
                    initProgressStorage(resolve);
                } else {
                    resolve(_lsProvider);
                }
            } else {
                resolve(_lsProvider);
            }

            return defer.promise;

            function resolve(provider) {
                defer.resolve(provider);
            }
        }

        function initProgressStorage(callback) {
            auth.identify().then(function (user) {
                userContext.user.email = user.email;
                userContext.user.username = user.name;
                userContext.user.keepMeLoggedIn = !auth.shortTermAccess;

                clearLocalStorageByEmail(user.email);
                return _psProvider.getProgressFromServer().then(callback.bind(null, _psProvider));
            }).fail(function(){
                callback(_lsProvider);
            });
        }

        function clearLocalStorage() {
            _lsProvider.removeProgress();
        }

        function clearLocalStorageByEmail(email) {
            var progress = _lsProvider.getProgress();
            if (progress && progress.user && email == progress.user.email) {
                _lsProvider.removeProgress();
            }
        }
    });