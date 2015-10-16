define([], function () {
    "use strict";

    var viewModel = {
        question: null,
        content: null,
        embedCode: null,
        isAnswered: ko.observable(false),
        initialize: initialize,
        submit: submit,
        tryAnswerAgain: tryAnswerAgain
    };
    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;
            viewModel.content = question.content;
            viewModel.embedCode = question.embedCode;
            viewModel.isAnswered(question.isAnswered);
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer();
            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            viewModel.isAnswered(false);
        });
    }
});