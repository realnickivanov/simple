define(function() {
    "use strict";

    var viewModel = {
        question: null,
        content: null,
        statements: null,
        isAnswered: ko.observable(false),

        initialize: initialize,
        submit: submit,
        tryAnswerAgain: tryAnswerAgain,
        markStatementAsTrue: markStatementAsTrue,
        markStatementAsFalse: markStatementAsFalse
    };

    return viewModel;

    function initialize(question) {
        viewModel.question = question;
        viewModel.content = question.content;
        viewModel.isAnswered(question.isAnswered);
        viewModel.statements = _.map(question.statements, function(statement) {
            var result = {
                id: statement.id,
                text: statement.text,
                userAnswer: ko.observable(statement.userAnswer)
            };

            result.isTrueChecked = ko.computed(function() {
                return result.userAnswer() == true;
            });

            result.isFalseChecked = ko.computed(function() {
                return result.userAnswer() == false;
            });

            return result;
        });
    }

    function submit() {
        return Q.fcall(function() {
            var userAnswers = _.chain(viewModel.statements)
                .filter(function(statement) {
                    return !_.isNullOrUndefined(statement.userAnswer());
                })
                .map(function(statement) {
                    return { id: statement.id, answer: statement.userAnswer() };
                })
                .value();

            viewModel.question.submitAnswer(userAnswers);
            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function() {
            viewModel.isAnswered(false);
            _.each(viewModel.statements, function(statement) {
                statement.userAnswer(null);
            });
        });
    }

    function markStatementAsTrue(statement) {
        if (viewModel.isAnswered()) {
            return;
        }

        statement.userAnswer(true);
    }

    function markStatementAsFalse(statement) {
        if (viewModel.isAnswered()) {
            return;
        }

        statement.userAnswer(false);
    }
});