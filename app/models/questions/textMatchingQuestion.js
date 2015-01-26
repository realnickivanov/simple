define(['models/questions/question'],
    function (Question) {
        "use strict";

        function TextMatchingQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.answers = (function () {
                var index = 0;
                return _.map(spec.answers, function (answer) {
                    return {
                        id: answer.id,
                        shortId: index++,
                        key: answer.key,
                        value: answer.value,
                        attemptedValue: null
                    };
                });
            })();
        }

        return TextMatchingQuestion;

        function submitAnswer(pairs) {
            _.each(this.answers, function (answer) {
                var attempted = _.find(pairs, function (pair) {
                    return pair.id == answer.id;
                });
                if (attempted) {
                    answer.attemptedValue = attempted.value;
                } else {
                    answer.attemptedValue = null;
                }
            });

            return getScore(this.answers);
        }

        function getScore(answers) {
            return _.every(answers, function (answer) {
                return answer.value == answer.attemptedValue;
            }) ? 100 : 0;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.answers)
                    .filter(function (answer) {
                        return !!answer.attemptedValue;
                    })
                    .map(function (answer) {
                        return {
                            shortId: answer.shortId,
                            attemptedValue: answer.attemptedValue
                        }
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.shortId] = ctx.attemptedValue;
                        return obj;
                    }, {})
                    .value();
            }
        }

        function restoreProgress(progress) {
            if (progress === 100) {
                _.each(this.answers, function (answer) {
                    answer.attemptedValue = answer.value;
                });
            } else {
                _.each(this.answers, function (answer) {
                    if (progress[answer.shortId]) {
                        answer.attemptedValue = progress[answer.shortId];
                    }
                });
            }
            this.score(getScore(this.answers));
        }
    });