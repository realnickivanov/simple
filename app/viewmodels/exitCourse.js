define(['durandal/app', 'windowOperations', 'repositories/courseRepository', 'progressContext', 'plugins/router', 'templateSettings', 'translation', 'constants'],
    function (app, windowOperations, courseRepository, progressContext, router, templateSettings, translation, constants) {
        "use strict";

        var progressStatuses = constants.progressContext.statuses;

        var statuses = {
            readyToFinish: 'readyToFinish',
            sendingRequests: 'sendingRequests',
            finished: 'finished'
        };

        var course = courseRepository.get();

        var viewModel = {
            type: ko.observable(),
            isNavigationLocked: router.isNavigationLocked,

            status: ko.observable(statuses.readyToFinish),
            statuses: statuses,

            score: course.score,
            masteryScore: templateSettings.masteryScore.score,
            activate: activate
        };


        viewModel.popup = {
            isVisible: ko.observable(false),
            show: showPopup,
            hide: hidePopup,

            actions: ko.computed(function () {
                if (viewModel.type() === 'extended') {
                    return { close: hidePopup, cancel: hidePopup, finish: finish };
                }
                return { close: hidePopup, exit: exit, finish: finish };
            })
        }

        viewModel.isProgressSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.saved;
        });

        viewModel.isProgressNotSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.error;
        });

        return viewModel;

        function activate(type) {
            viewModel.type(type);
        }

        function onCourseFinishedCallback() {
            viewModel.status(statuses.finished);

            progressContext.status(progressStatuses.ignored);
            windowOperations.close();
        }

        function exit() {
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

        function showPopup() {
            if (router.isNavigationLocked()) {
                return;
            }

            viewModel.popup.isVisible(true);
        }

        function hidePopup() {
            viewModel.popup.isVisible(false);
        }

    });