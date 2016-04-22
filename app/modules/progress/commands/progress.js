define(['../utils/httpWrapper', '../utils/urlProvider', '../providers/authProvider'], function(http, urlProvider, authProvider) {
    'use strict';

    return (function() {
        var url = urlProvider.progressStorageUrl + 'progress';

        return {
            get: function(courseId, templateId) {
                return http.get(url, {
                    courseId: courseId,
                    templateId: templateId
                }, authProvider.headers);
            },
            set: function(courseId, templateId, progress) {
                return http.post(url, {
                    courseId: courseId,
                    templateId: templateId,
                    jsonProgress: progress ? JSON.stringify(progress) : null
                }, authProvider.headers);
            }
        }
    })();
});