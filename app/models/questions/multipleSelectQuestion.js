define(['guard', 'models/questions/question', 'models/answers/checkableAnswer'],
    function (guard, Question, CheckableAnswer) {
        "use strict";

        function MultipleSelectQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.answers = (function () {
                var index = 0;
                return _.map(spec.answers, function (answer) {
                    return new CheckableAnswer({
                        id: answer.id,
                        shortId: index++,
                        isCorrect: answer.isCorrect,
                        text: answer.text
                    });
                });
            })();
        }

        return MultipleSelectQuestion;

        function submitAnswer(checkedAnswerIds) {
            guard.throwIfNotArray(checkedAnswerIds, 'Checked answer ids is not an array');

            _.each(this.answers, function (answer) {
                answer.isChecked = _.contains(checkedAnswerIds, answer.id);
            });

            return calculateScore(this.answers);
        }

        function calculateScore(answers) {
            var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
                return answer.isChecked != answer.isCorrect;
            });

            return hasIncorrectCheckedAnswer ? 0 : 100;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.answers)
                    .filter(function (answer) {
                        return answer.isChecked;
                    })
                    .map(function (answer) {
                        return answer.shortId;
                    }).value();
            }
        }

        function restoreProgress(progress) {
            _.each(this.answers, function (answer) {
                answer.isChecked = progress === 100 ? answer.isCorrect : progress && progress.indexOf(answer.shortId) > -1;
            });
            this.score(calculateScore(this.answers));
        }

    });