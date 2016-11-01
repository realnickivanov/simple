define(['plugins/router', 'context', './header/index', './socialNetworks/index', './helpers/validatedValue', 'xApi/constants',
        'userContext', 'templateSettings', 'modules/progress/progressStorage/urlProvider',
        'modules/progress/progressStorage/auth', './limitAccess/accessLimiter', 'xApi/xApiInitializer', './routing/guardRoute',
        'modules/progress/index', 'progressContext'
    ],
    function (router, context, Header, SocialNetworks, validatedValue, constants, userContext, templateSettings,
        urlProvider, auth, accessLimiter, xApiInitializer, guardRoute, progressProvider, progressContext) {
        'use strict';

        var _private = {
            crossDeviceEnabled: templateSettings.allowCrossDeviceSaving,
            isActivatedPreviously: false
        };

        var viewmodel = {
            activate: activate,
            submit: submit,
            skip: skip,
            header: null,
            socialNetworks: null,
            email: userContext.email || '',
            socialLoginEnabled: false,
            skipAllowed: false,
            canActivate: canActivate
        };
        
        viewmodel.socialLoginEnabled = templateSettings.allowCrossDeviceSaving && templateSettings.allowLoginViaSocialMedia;
        viewmodel.skipAllowed = !templateSettings.xApi.required;

        viewmodel.email = validatedValue(function (value) {
            return !!value() && constants.patterns.email.test(value());
        });

        return viewmodel;

        function canActivate(){
            var defer = Q.defer();
            if(userContext.user.email && !_private.isActivatedPreviously){
                _private.isActivatedPreviously = true;
                viewmodel.email(userContext.user.email);
                submit(true, function(canActivate){
                    defer.resolve(canActivate);
                });
            } else {
                _private.isActivatedPreviously = true;
                defer.resolve(true);
            }
            return defer.promise;
        }

        function activate() {
            viewmodel.header = new Header(context.course.title);
            viewmodel.socialNetworks = viewmodel.socialLoginEnabled ? new SocialNetworks(context.course.title, urlProvider.progressStorageUrl) : null;
        }

        function submit(replaceWindow, callback) {
            callback = callback || function(){};
            if(!viewmodel.email.isValid()){
                viewmodel.email.markAsModified();
                callback(true)
            }
            userContext.user.email = viewmodel.email();
            if(!accessLimiter.userHasAccess({ email: viewmodel.email() })){
                _navigate('noaccess', replaceWindow);
                callback(false)
            }
            if(_private.crossDeviceEnabled){
                return userExists(replaceWindow, callback);
            } else {
                _navigate('register', replaceWindow);
                callback(false);
            }
        }

        function skip() {
            templateSettings.allowCrossDeviceSaving = false;
            xApiInitializer.deactivate();
            guardRoute.skipLoginGuard();
            progressProvider.initialize().then(function(provider){
                progressContext.use(provider);
                if(!accessLimiter.userHasAccess({ email: viewmodel.email() })){
                    router.navigate('noaccess');
                    return;
                }
                progressContext.restoreProgress();
            });
        }

        function userExists(replaceWindow, callback){
            return auth.exists(viewmodel.email()).then(function(){
                _navigate('register', replaceWindow);
                callback(false);
            }).fail(function(){
                _navigate('signin', replaceWindow);
                callback(false);
            });
        }

        function _navigate(route, replaceWindow){
            if(replaceWindow){
                window.location.hash = '#' + route;
                return;
            }
            router.navigate(route);
        }
    });