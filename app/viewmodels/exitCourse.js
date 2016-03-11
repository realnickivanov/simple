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

        viewModel.popup = new Popup();
        viewModel.finishPopupActions = {
            close: viewModel.popup.hide,
            finish: function () {
                finish();
                viewModel.popup.hide();
            }
        };

        viewModel.takeABreakPopupActions = { close: viewModel.popup.hide, exit: exit };

        viewModel.isProgressSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.saved;
        });

        viewModel.isProgressNotSaved = ko.computed(function () {
            return progressContext.status() === progressStatuses.error;
        });

        viewModel.finishAction = function () {
            if (templateSettings.showConfirmationPopup) {
                viewModel.popup.actions(viewModel.finishPopupActions);
                viewModel.popup.show();
            } else {
                finish();
            }
        };

        viewModel.takeABreakAction = function () {
            viewModel.popup.actions(viewModel.takeABreakPopupActions);
            viewModel.popup.show();
        }

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
            if (viewModel.isNavigationLocked() || viewModel.status() !== statuses.readyToFinish) {
                return;
            }
            viewModel.status(statuses.sendingRequests);
            var course = courseRepository.get();
            course.finish(onCourseFinishedCallback);

            progressContext.remove();
        }

        function Popup() {
            var that = this;
            this.actions = ko.observable();
            this.isVisible = ko.observable(false);
            this.show = function () {
                if (router.isNavigationLocked()) {
                    return;
                }

                that.isVisible(true);
            };

            this.hide = function () {
                that.isVisible(false);
            };
        }

    });