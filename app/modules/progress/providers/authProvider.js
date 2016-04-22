define(['../commands/login', '../commands/register', '../utils/urlProvider'], function(loginCommand, registerCommand, urlProvider) {
    'use strict';

    function AuthProvider() {
        var that = this;
        var _private = {
            tokenKey: 'token.auth.template',
            linkKey: 'token.auth.templatelink',
            getToken: function() {
                return localStorage.getItem(_private.tokenKey);
            },
            removeToken: function() {
                localStorage.removeItem(_private.tokenKey);
            },
            removeLink: function() {
                localStorage.removeItem(_private.linkKey);
            },
            setLink: function(value) {
                if (typeof value !== 'undefined') {
                    localStorage.setItem(_private.linkKey, value);
                }
            }
        };

        Object.defineProperty(this, 'headers', {
            get: function() {
                return {
                    'x-access-token': _private.getToken()
                };
            }
        });

        Object.defineProperty(this, 'authenticated', {
            get: function() {
                return _private.getToken() !== null;
            }
        });
        
        this.setLink = function (value) {
            if (typeof value !== 'undefined') {
                localStorage.setItem(_private.linkKey, value);
            }
        }

        this.authLink = function() {
            return localStorage.getItem(_private.linkKey);
        };

        this.register = function(email, username, courseTitle, shortTermAccess) {
            var that = this;
            return registerCommand.execute(email, username, courseTitle, shortTermAccess)
                .then(function(response) {
                    that.setToken(response.token);
                    that.setLink(response.shortLink);
                    return response;
                });
        };
        this.login = function(email, password, shortTermAccess) {
            return loginCommand.execute(email, password, shortTermAccess)
                .then(function(response) {
                    that.setToken(response.token);
                    return true;
                });
        };

        this.setToken = function(value) {
            if (typeof value !== 'undefined') {
                localStorage.setItem(_private.tokenKey, value);
            }
        };

        this.getSecretLink = function() {
            return localStorage.getItem(_private.linkKey);
        };

        this.getValueFromUrl = function(key) {
            key = key || 'token';
            var url = window.location.href,
                regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)', 'i'),
                result = regex.exec(url);

            if (!result || !result[2]) {
                return null;
            }

            return decodeURIComponent(result[2].replace(/\+/g, ' '));
        };

        this.logOut = function() {
            _private.removeToken();
            _private.removeLink();
        };
    }

    return new AuthProvider();
});