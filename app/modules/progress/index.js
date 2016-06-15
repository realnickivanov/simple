define(['durandal/app', 'q', 'userContext', './providers/progressProviders/localStorage', './providers/progressProviders/progressStorage', './providers/authProvider', './utils/urlProvider',
        './commands/sendSecretLink', 'context', 'translation'
    ],
    function(app, Q, userContext, LocalStorageProvider, ProgressStorageProvider, authProvider, urlProvider, sendSecretLinkCommand, context, translation) {
        'use strict';

        function ProgressContext() {
            var _private = {
                progressProviders: [],
                localStorageProvider: null,
                progresStorageProvider: null,
                getProgress: function() {
                    return _private.localStorageProvider.getProgress();
                },
                saveProgress: function(progress) {
                    return _private.callFunctionInEachProvider('saveProgress', progress, _private.userEmail);
                },
                saveResults: function() {
                    return _private.callFunctionInEachProvider('saveResults', context.course.score, context.course.getStatus, translation.getTextByKey('[not enough memory to save progress]'));
                },
                removeProgress: function() {
                    return _private.callFunctionInEachProvider('removeProgress', _private.userEmail);
                },
                createProviders: function (courseId, templateId){
                    _private.localStorageProvider = new LocalStorageProvider(courseId, templateId);
                    _private.progressProviders.push(_private.localStorageProvider);
                    _private.progresStorageProvider = new ProgressStorageProvider(courseId, templateId);
                    _private.progressProviders.push(_private.progresStorageProvider);
                },
                callFunctionInEachProvider: function(nameOfFunction) {
                    var promises = [];
                    var args = Array.prototype.slice.call(arguments, 1);
                    _.each(_private.progressProviders, function(progressProvider) {
                        if (_.isFunction(progressProvider[nameOfFunction])) {
                            promises.push(progressProvider[nameOfFunction].apply(progressProvider, args));
                        }
                    });

                    return Q.all(promises);
                },
                userEmail: '',
                courseTitle: '',
                deleteProgressStorageProvider: function(){
                   _private.progressProviders = _.reject(_private.progressProviders, function(progressProvider){
                       return progressProvider instanceof ProgressStorageProvider;
                   });
                }
            };

            this.isOnline = true;
            this.isInitialized = false;

            this.progressProvider = {
                getProgress: _private.getProgress,
                saveProgress: _private.saveProgress,
                saveResults: _private.saveResults,
                removeProgress: _private.removeProgress
            };

            this.initialize = function(courseId, courseTitle, templateId) {
                var defer = Q.defer();
                this.isInitialized = true;
                _private.courseTitle = courseTitle;
                _private.createProviders(courseId, templateId);
                if (authProvider.authenticated) {
                    this.syncProviders().then(resolvePromise).fail(defer.reject);
                } else {
                    var token = authProvider.getValueFromUrl('token');
                    if (!_.isNull(token)) {
                        authProvider.setToken(token);
                        this.syncProviders().then(resolvePromise).fail(defer.reject);
                    } else {
                        defer.resolve(null);
                    }
                }
                return defer.promise;
                
                function resolvePromise(user){
                    defer.resolve(user)
                }
                function rejectPromise(){
                    defer.reject();
                }
            };

            this.deactivateProgressStorage = function() {
                this.isInitialized = false;
                _private.deleteProgressStorageProvider();
            };

            this.syncProviders = function() {
                var that = this;
                return _private.progresStorageProvider.getProgress().then(function(response) {
                    if (_.isNull(response.progress) || _.isEmpty(response.progress)) {
                        _private.localStorageProvider.removeProgress();
                        if (response.email) {
                            authenticate(response.email, response.name, true);
                            _private.userEmail = response.email;
                            return {
                                name: response.name,
                                email: response.email
                            };
                        }
                        return null;
                    } else {
                        var progress = JSON.parse(response.progress);
                        progress.user = {
                            username: response.name,
                            email: response.email
                        };
                        authenticate(response.email, response.name);
                        _private.localStorageProvider.saveProgress(progress);
                        _private.userEmail = response.email;
                        return {
                            name: response.name,
                            email: response.email
                        };
                    }
                }).fail(function(reason) {
                    that.isOnline = false;
                    that.logOut();
                    _private.deleteProgressStorageProvider();
                    if (reason.status == 401) {
                        return null;
                    }
                });
                
                function setSecretLink(email, title, sendMail){
                    sendMail = sendMail || false;
                    var shortLink = authProvider.getValueFromUrl('shortLink');
                    if(shortLink){
                        authProvider.setLink(shortLink);
                    } else {
                        sendSecretLinkCommand.execute(email, title, sendMail, true).then(function(response){
                            authProvider.setLink(response.shortLink);
                        });
                    }
                }

                function authenticate(email, name, sendMail) {
                    app.trigger('user:authenticated', {
                        username: name,
                        email: email
                    });
                    var password = authProvider.getValueFromUrl('password');
                    userContext.user.password = password;
                    userContext.user.email = email;
                    userContext.user.username = name;
                    setSecretLink(email, _private.courseTitle, sendMail);
                }
            };

            this.isUserAuthenticated = function() {
                return authProvider.authenticated;
            };

            this.sendSecretLink = function(email, title, sendMail, returnLink) {
                return sendSecretLinkCommand.execute(email, title, sendMail, returnLink);
            };

            this.register = function(email, username, courseTitle, shortTermAccess) {
                return authProvider.register(email, username, courseTitle, shortTermAccess);
            };

            this.login = function(email, password, shortTermAccess) {
                return authProvider.login(email, password, shortTermAccess);
            };

            this.logOut = function() {
                _private.localStorageProvider.removeProgress();
                authProvider.logOut();
            };

            this.progressStorageUrl = urlProvider.progressStorageUrl;
            this.authLink = function() {
                return authProvider.authLink()
            };
        }

        return new ProgressContext();
    });