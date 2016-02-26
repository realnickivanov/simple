define(['modules/questionsNavigation', 'plugins/router'], function (navigationModule, router) {
    "use strict";

    var viewModel = {
        title: null,
        learningContents: null,
        navigateNext: navigateNext,

        activate: activate,
        isNavigationLocked: router.isNavigationLocked
    };

    return viewModel;

    function navigateNext() {
        if (router.isNavigationLocked()) {
            return;
        }

        var nextUrl = !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) ? viewModel.navigationContext.nextQuestionUrl : 'sections';
        router.navigate(nextUrl);
    }

    function activate(sectionId, question) {
        return Q.fcall(function () {
            viewModel.navigationContext = navigationModule.getNavigationContext(sectionId, question.id);
            viewModel.id = question.id;
            viewModel.title = question.title;
            viewModel.learningContents = question.learningContents;
            question.submitAnswer();
        });
    }
});