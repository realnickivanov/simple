define(['durandal/app', 'windowOperations', 'repositories/courseRepository', 'progressContext', 'plugins/router', 'translation', 'constants'],
    function (app, windowOperations, courseRepository, progressContext, router, translation, constants) {
        "use strict";

        var progressStatuses = constants.progressContext.statuses;

        var statuses = {
            readyToFinish: 'readyToFinish',
            sendingRequests: 'sendingRequests',
            finished: 'finished'
        };

        var viewModel = {
            isNavigationLocked: router.isNavigationLocked,

            status: ko.observable(statuses.readyToFinish),
            statuses: statuses,
            finishPopupVisibility: ko.observable(false),

            close: close,
            finish: finish,
            openFinishPopup: openFinishPopup,
            closeFinishPopup: closeFinishPopup
        };

        viewModel.isProgressSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.saved;
        });

        viewModel.isProgressNotSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.error;
        });

        return viewModel;

        function onCourseFinishedCallback() {
            viewModel.status(statuses.finished);

            progressContext.status(progressStatuses.ignored);
            windowOperations.close();
        }

        function close() {
            if (progressContext.status() === progressStatuses.error) {
                var isCourseClosingConfirmed = confirm(translation.getTextByKey('[progress is not saved confirmation]'));
                if (!isCourseClosingConfirmed) {
                    return;
                }
                progressContext.status(progressStatuses.ignored);
            }

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
            if (router.isNavigationLocked()) {
                return;
            }

            viewModel.finishPopupVisibility(true);
        }

        function closeFinishPopup() {
            viewModel.finishPopupVisibility(false);
        }

    });