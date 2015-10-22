define(['knockout', 'viewmodels/questions/scenarioQuestion/components/branchtrackProvider'], function (ko, branchtrackProvider) {
    "use strict";

    var viewModel = {
        question: null,
        content: null,
        embedCode: null,
        isAnswered: ko.observable(false),
        initialize: initialize,
        tryScenarioQuestionAgain: ko.observable(false),
        submit: submit,
        tryAnswerAgain: tryAnswerAgain,
        deactivate: deactivate,
        customSubmitViewModel: 'viewmodels/questions/scenarioQuestion/submitQuestion'
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;
            viewModel.content = question.content;
            viewModel.embedCode = question.embedCode;
            viewModel.isAnswered(question.isAnswered);
            branchtrackProvider.init(question.projectId, question.masteryScore);
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(branchtrackProvider.score());
            viewModel.isAnswered(true);
            viewModel.tryScenarioQuestionAgain(false);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            viewModel.isAnswered(false);
            viewModel.tryScenarioQuestionAgain(true);
            branchtrackProvider.reset();
        });
    }

    function deactivate() {
        branchtrackProvider.destroy();
    }
});