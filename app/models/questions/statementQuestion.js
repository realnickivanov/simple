define(['models/questions/question', 'models/answers/statementAnswer', 'guard'],
    function (Question, StatementAnswer, guard) {
        "use strict";

        function StatementQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.statements = (function () {
                var index = 0;
                return _.map(spec.statements, function (statement) {
                    return new StatementAnswer({
                        id: statement.id,
                        shortId: index++,
                        text: statement.text,
                        isCorrect: statement.isCorrect
                    });
                });
            })();
        }

        return StatementQuestion;

        function submitAnswer(userAnswers) {
            guard.throwIfNotArray(userAnswers, 'userAnswers is not an array');

            _.each(this.statements, function (statement) {
                var userAnswer = _.find(userAnswers, function (answer) { return answer.id == statement.id; });
                statement.userAnswer = !_.isNullOrUndefined(userAnswer) ? userAnswer.answer : null;
            });

            return calculateScore.call(this);
        }

        function calculateScore() {
            return _.every(this.statements, function (statement) {
                return statement.userAnswer == statement.isCorrect;
            }) ? 100 : 0;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.statements)
                    .filter(function (statement) {
                        return _.isBoolean(statement.userAnswer);
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.shortId] = ctx.userAnswer ? 1 : 0;
                        return obj;
                    }, {})
                    .value();

            }
        }

        function restoreProgress(progress) {
            _.chain(this.statements)
                .each(function (statement) {
                    if (progress == 100) {
                        statement.userAnswer = statement.isCorrect;
                    } else {
                        statement.userAnswer = !!progress[statement.shortId];
                    }
                });
            this.score(calculateScore.call(this));
        }

    });