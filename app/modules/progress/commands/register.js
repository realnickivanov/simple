define(['../utils/httpWrapper', '../utils/urlProvider'], function(http, urlProvider) {
    'use strict';

    return {
        execute: function(email, username, courseTitle, shortTermAccess) {
            return http.post(urlProvider.progressStorageUrl + 'register', {
                email: email,
                name: username,
                courseTitle: courseTitle,
                courseLink: urlProvider.courseLink,
                shortTermAccess: shortTermAccess
            });
        }
    };
});