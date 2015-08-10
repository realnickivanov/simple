define(['plugins/router', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'templateSettings', 'modules/questionsNavigation'],
    function (router, constants, questionRepository, objectiveRepository, templateSettings, navigationModule) {
        "use strict";

        var viewModel = {
            isNavigationLocked: ko.observable(false),
            objective: null,
            question: null,

            startTime: null,

            masteryScore: 0,

            navigationContext: null,
            backToObjectives: backToObjectives,
            isNextQuestionAvailable: isNextQuestionAvailable,
            nextQuestionUrl: nextQuestionUrl,
            isPreviousQuestionAvailable: isPreviousQuestionAvailable,
            previousQuestionUrl: previousQuestionUrl,

            activeViewModel: null,

            activate: activate,
            deactivate: deactivate
        };

        return viewModel;

        function backToObjectives() {
            if (viewModel.isNavigationLocked()) {
                return;
            }
            router.navigate('objectives');
        }

        function isNextQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) && !viewModel.isNavigationLocked();
        }

        function nextQuestionUrl() {
            return viewModel.isNavigationLocked() ? undefined : viewModel.navigationContext.nextQuestionUrl;
        }

        function isPreviousQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.previousQuestionUrl) && !viewModel.isNavigationLocked();
        }

        function previousQuestionUrl() {
            return viewModel.isNavigationLocked() ? undefined : viewModel.navigationContext.previousQuestionUrl;
        }

        function getActiveContentViewModel(question) {
            switch (question.type) {
                case constants.questionTypes.informationContent:
                    return 'viewmodels/questions/informationContent';
                default:
                    return 'viewmodels/questions/questionContent';
            }
        }

        function activate(objectiveId, questionId, queryString) {
            return Q.fcall(function () {
                if (queryString && queryString.lock) {
                    viewModel.isNavigationLocked(queryString.lock.toLowerCase() == "true");
                }

                viewModel.objective = objectiveRepository.get(objectiveId);
                if (viewModel.objective === null) {
                    router.navigate('404');
                    return;
                }

                viewModel.question = questionRepository.get(objectiveId, questionId);
                if (viewModel.question === null) {
                    router.navigate('404');
                    return;
                }

                viewModel.startTime = new Date();
                viewModel.masteryScore = templateSettings.masteryScore.score;
                viewModel.navigationContext = navigationModule.getNavigationContext(viewModel.objective.id, viewModel.question.id);

                return viewModel.question.load().then(function () {
                    viewModel.activeViewModel = getActiveContentViewModel(viewModel.question);
                });
            });
        }

        function deactivate() {
            if (viewModel.question.learningContents.length > 0) {
                viewModel.question.learningContentExperienced(new Date() - viewModel.startTime);
            }
        }

    }
);