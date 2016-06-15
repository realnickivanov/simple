define(['../utils/httpWrapper', '../utils/urlProvider'], function(http, urlProvider) {
    'use strict';

    return {
        execute: function(email, password, shortTermAccess) {
            return http.post(urlProvider.progressStorageUrl + 'login', {
                email: email,
                password: password,
                shortTermAccess: shortTermAccess
            });
        }
    };
});