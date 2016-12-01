define([
    'durandal/app', 'windowOperations', 'repositories/courseRepository', 'progressContext',
    'plugins/router', 'templateSettings', 'translation', 'constants',
    'xApi/xApiInitializer', 'includedModules/modulesInitializer', 'context'
], function(app, windowOperations, courseRepository, progressContext, router, templateSettings,
    translation, constants, xApiInitializer, modulesInitializer, context) {
    "use strict";

    var progressStatuses = constants.progressContext.statuses;

    var statuses = {
        readyToFinish: 'readyToFinish',
        sendingRequests: 'sendingRequests',
        finished: 'finished'
    };

    var viewModel = {
        type: ko.observable(),
        isNavigationLocked: router.isNavigationLocked,

        status: ko.observable(statuses.readyToFinish),
        statuses: statuses,

        score: null,
        masteryScore: templateSettings.masteryScore.score,
        xAPIEnabled: false,
        scormEnabled: false,
        hideFinishActionButtons: false,
        activate: activate
    };

    viewModel.continueLaterPopup = new Popup();

    viewModel.continueLaterPopup.actions = {
        close: viewModel.continueLaterPopup.hide,
        exit: exit
    };

    viewModel.isProgressSaved = ko.computed(function() {
        return progressContext.status() === progressStatuses.saved;
    });

    viewModel.isProgressNotSaved = ko.computed(function() {
        return progressContext.status() === progressStatuses.error;
    });

    viewModel.finishAction = function() {
        router.navigate('#finish');
    };

    viewModel.takeABreakAction = function() {
        viewModel.continueLaterPopup.show();
    }

    return viewModel;

    function activate(type) {
        viewModel.score = context.course.score;
        viewModel.type(type);
        viewModel.xAPIEnabled = xApiInitializer.isActivated();
        viewModel.scormEnabled = modulesInitializer.hasModule('lms');
        viewModel.hideFinishActionButtons = templateSettings.hideFinishActionButtons;
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

    function Popup() {
        var that = this;
        this.actions = {};
        this.isVisible = ko.observable(false);
        this.show = function() {
            if (router.isNavigationLocked()) {
                return;
            }

            that.isVisible(true);
        };

        this.hide = function() {
            that.isVisible(false);
        };
    }

});