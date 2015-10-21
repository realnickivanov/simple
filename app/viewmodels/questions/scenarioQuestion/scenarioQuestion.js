define(['knockout'], function (ko) {
    "use strict";

    var branchtarackInstance;

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
        customSubmitViewModel: 'viewmodels/scenarioQuestion/submitQuestion'
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;
            viewModel.content = question.content;
            viewModel.embedCode = question.embedCode;
            viewModel.isAnswered(question.isAnswered);
            branchtarackInstance = Branchtrack.create(question.projectId);
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(branchtarackInstance.score);
            viewModel.isAnswered(true);
            viewModel.tryScenarioQuestionAgain(false);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            viewModel.isAnswered(false);
            viewModel.tryScenarioQuestionAgain(true);
            branchtarackInstance.reset();
        });
    }

    function deactivate() {
        branchtarackInstance.destroy();
    }
});