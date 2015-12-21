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
            nextQuestionUrl: nextQuestionUrl,
            isPreviousQuestionAvailable: isPreviousQuestionAvailable,
            previousQuestionUrl: previousQuestionUrl,

            voiceOver: null,
            mainInterfaceColour: null,

            activeViewModel: null,

            activate: activate,
            isNavigationLocked: router.isNavigationLocked,
            deactivate: deactivate
        };

        return viewModel;

        function backToObjectives() {
            if (router.isNavigationLocked()) {
                return;
            }
            router.navigate('objectives');
        }

        function isNextQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) && !router.isNavigationLocked();
        }

        function nextQuestionUrl() {
            return router.isNavigationLocked() ? undefined : viewModel.navigationContext.nextQuestionUrl;
        }

        function isPreviousQuestionAvailable() {
            return !_.isNullOrUndefined(viewModel.navigationContext.previousQuestionUrl) && !router.isNavigationLocked();
        }

        function previousQuestionUrl() {
            return router.isNavigationLocked() ? undefined : viewModel.navigationContext.previousQuestionUrl;
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


                viewModel.voiceOver = viewModel.question.voiceOver;

                viewModel.mainInterfaceColour = _.find(templateSettings.colors, function (pair) {
                    return pair.key === "@main-color"
                }).value
           
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