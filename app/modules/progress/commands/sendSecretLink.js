define(['../utils/httpWrapper', '../utils/urlProvider', '../providers/authProvider'], function(http, urlProvider, authProvider) {
    'use strict';

    return {
        execute: function(email, courseTitle, sendMail, returnLink) {
            var headers = returnLink ? authProvider.headers : {};
            return http.post(urlProvider.progressStorageUrl + 'link', {
                email: email,
                courseTitle: courseTitle,
                courseLink: urlProvider.courseLink,
                sendMail: sendMail || false,
                returnLink: returnLink || false
            }, headers);
        }
    };
});