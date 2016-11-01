define(function () {
    'use strict';

    var _instance = null;

    var _getAuthLink = function (courseTitle, progressStorageUrl, socialNetwork) {
        return progressStorageUrl + 'auth/' + socialNetwork +
            '?courseLink=' + encodeURIComponent(window.location.href) +
            '&courseTitle=' + encodeURIComponent(courseTitle);
    };

    function SocialNetworks(courseTitle, progressStorageUrl) {
        if (_instance) {
			return _instance;
		}
        var getAuthLink = _getAuthLink.bind(this, courseTitle, progressStorageUrl);
        this.facebookAuthLink = getAuthLink('facebook');
        this.linkedinAuthLink = getAuthLink('linkedin');
        this.googleAuthLink = getAuthLink('google');
    }

    return SocialNetworks;
});