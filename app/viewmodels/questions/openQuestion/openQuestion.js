define(function() {
    "use strict";

    var viewModel = {
        question: null,
        content: null,
        answeredText: ko.observable(''),
        isAnswered: ko.observable(false),

        initialize: initialize,
        submit: submit,
        tryAnswerAgain: tryAnswerAgain
    };
    return viewModel;

    function initialize(question) {
        return Q.fcall(function() {
            viewModel.question = question;
            viewModel.content = question.content;
            viewModel.answeredText(question.answeredText);
            viewModel.isAnswered(question.isAnswered);
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(viewModel.answeredText());
            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function() {
            viewModel.isAnswered(false);
        });
    }
});