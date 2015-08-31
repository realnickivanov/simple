define(['durandal/app', 'windowOperations', 'repositories/courseRepository', 'progressContext', 'plugins/router', 'translation'],
    function (app, windowOperations, courseRepository, progressContext, router, translation) {
        "use strict";

        var statuses = {
            readyToFinish: 'readyToFinish',
            sendingRequests: 'sendingRequests',
            finished: 'finished'
        };

        var viewModel = {
            isProgressSaved: progressContext.isSaved,
            isNavigationLocked: router.isNavigationLocked,

            status: ko.observable(statuses.readyToFinish),
            statuses: statuses,
            finishPopupVisibility: ko.observable(false),

            close: close,
            finish: finish,
            openFinishPopup: openFinishPopup,
            closeFinishPopup: closeFinishPopup
        };

        return viewModel;

        function onCourseFinishedCallback() {
            viewModel.status(statuses.finished);

            viewModel.isProgressSaved(null);
            windowOperations.close();
        }

        function close() {
            if (viewModel.isProgressSaved() === true) {
                windowOperations.close();
            } else if (viewModel.isProgressSaved() === false && confirm(translation.getTextByKey('[progress is not saved confirmation]'))) {
                viewModel.isProgressSaved(null);
                windowOperations.close();
            }
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