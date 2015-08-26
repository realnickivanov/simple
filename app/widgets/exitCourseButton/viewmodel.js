define(['windowOperations', 'repositories/courseRepository', 'progressContext'], function (windowOperations, courseRepository, progressContext) {
    "use strict";

    var statuses = {
        readyToFinish: 'readyToFinish',
        sendingRequests: 'sendingRequests',
        finished: 'finished'
    };
    
    var viewModel = {
        activate: activate,

        status: ko.observable(statuses.readyToFinish),
        statuses: statuses,
        finishPopupVisibility: ko.observable(false),

        close: close,
        finish: finish,
        openFinishPopup: openFinishPopup,
        closeFinishPopup: closeFinishPopup
    };

    return viewModel;

    function activate() {

    }
    
    function onCourseFinishedCallback() {
        viewModel.status(statuses.finished);
        windowOperations.close();
    }

    function close() {
        windowOperations.close();
    }

    function finish() {
        if (viewModel.status() != statuses.readyToFinish) {
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