define(['browserSupport'], function (browserSupport) {
    "use strict";

    var viewModel = {
        canHover: !browserSupport.isMobileDevice,
        question: null,

        content: null,
        isAnswered: ko.observable(false),
        answers: null,
        checkedAnswerId: ko.observable(null),
        checkItem: checkItem,
        
        submit: submit,
        tryAnswerAgain: tryAnswerAgain,

        initialize: initialize
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;
            viewModel.checkedAnswerId(question.checkedAnswerId);

            viewModel.content = question.content;
            viewModel.isAnswered(question.isAnswered);
            viewModel.answers = _.map(question.answers, function (answer) {
                return {
                    id: answer.id,
                    image: answer.image,
                    isChecked: ko.observable(answer.isChecked)
                };
            });
        });
    }

    function checkItem() {
        if (viewModel.isAnswered()) {
            return;
        }
        viewModel.checkedAnswerId(this.id);
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(viewModel.checkedAnswerId());

            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            viewModel.checkedAnswerId(null);

            viewModel.isAnswered(false);
        });
    }
});