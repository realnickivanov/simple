define(['plugins/router', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'templateSettings', 'modules/questionsNavigation'],
    function (router, constants, questionRepository, objectiveRepository, templateSettings, navigationModule) {
        "use strict";

        var viewModel = {
            objective: null,
            question: null,

            startTime: null,

            masteryScore: 0,

            navigationContext: null,
            backToObjectives: backToObjectives,
            isNextQuestionAvailable: isNextQuestionAvailable,
            isPreviousQuestionAvailable: isPreviousQuestionAvailable,

            activeViewModel: null,

            activate: activate,
            deactivate: deactivate
        };

        return viewModel;

        function backToObjectives() {
            router.navigate('objectives');
        }

        function isNextQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl);
        }

        function isPreviousQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.previousQuestionUrl);
        }

        function getActiveContentViewModel(question) {
            switch (question.type) {
                case constants.questionTypes.informationContent:
                    return 'viewmodels/questions/informationContent';
                default:
                    return 'viewmodels/questions/questionContent';
            }
        }

        function activate(objectiveId, questionId) {
            return Q.fcall(function () {
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