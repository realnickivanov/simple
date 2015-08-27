define(['durandal/app', 'windowOperations', 'repositories/courseRepository', 'progressContext', 'plugins/router'],
    function (app, windowOperations, courseRepository, progressContext, router) {
    "use strict";

    var statuses = {
        readyToFinish: 'readyToFinish',
        sendingRequests: 'sendingRequests',
        finished: 'finished'
    };

    var viewModel = {
        isProgressSaved: ko.observable(null),
        isNavigationLocked: router.isNavigationLocked,

        status: ko.observable(statuses.readyToFinish),
        statuses: statuses,
        finishPopupVisibility: ko.observable(false),

        close: close,
        finish: finish,
        openFinishPopup: openFinishPopup,
        closeFinishPopup: closeFinishPopup
    };

    app.on('progressContext:saved').then(function (isSaved) {
        viewModel.isProgressSaved(isSaved);
    });

    return viewModel;

    function onCourseFinishedCallback() {
        viewModel.status(statuses.finished);
        windowOperations.close();
    }

    function close() {
        windowOperations.close();
    }

    function finish() {
        if (viewModel.isNavigationLocked() || viewModel.status() != statuses.readyToFinish) {
            return;
        }
        viewModel.status(statuses.sendingRequests);
        var course = courseRepository.get();
        course.finish(onCourseFinishedCallback);

        progressContext.remove();
    }

    function openFinishPopup() {
        viewModel.finishPopupVisibility(true);
    }

    function closeFinishPopup() {
        viewModel.finishPopupVisibility(false);
    }

});