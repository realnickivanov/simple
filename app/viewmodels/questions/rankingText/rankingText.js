define(function () {
    "use strict";

    var viewModel = {
        question: null,

        content: null,
        isAnswered: ko.observable(false),
        rankingItems: ko.observableArray([]),

        submit: submit,
        tryAnswerAgain: tryAnswerAgain,

        initialize: initialize
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;

            viewModel.content = question.content;
            viewModel.isAnswered(question.isAnswered);

            viewModel.rankingItems(question.rankingItems);
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(viewModel.rankingItems());

            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {

            viewModel.isAnswered(false);
        });
    }
});