define(['plugins/router', 'durandal/app', 'context', 'constants', 'templateSettings'], function (router, app, context, constants, templateSettings) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        var reviewApiUrl = router.getQueryStringValue('reviewApiUrl');
        if (!reviewApiUrl)
            return;

        var reviewPlugin = new easygeneratorPlugins.ReviewPlugin();

        postMessage({ supportsNativeReview: true });

        app.on(constants.events.appInitialized, function () {
            reviewPlugin.init({
                locale: templateSettings.languages.selected,
                reviewApiUrl: decodeURIComponent(reviewApiUrl),
                courseId: context.course.id
            });

            router.on('router:navigation:composition-complete').then(function () {
                reviewPlugin.renderSpots();
            });
        });

        function postMessage(data) {
            var editorWindow = window.parent;
            editorWindow.postMessage(data, '*');
        }
    }
});