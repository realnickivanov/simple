define(['models/questions/question', 'eventManager', 'eventDataBuilders/questionEventDataBuilder', ],
    function (Question, eventManager, eventDataBuilder) {
        "use strict";

        function TextMatchingQuestion(spec) {

            var _protected = {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            };

            Question.call(this, spec, _protected);

            this.answers = _.map(spec.answers, function (answer) {
                return {
                    id: answer.id,
                    key: answer.key,
                    value: answer.value,
                    attemptedValue: null
                };
            });
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

            this.score(getScore(this.answers));
            this.isAnswered = true;
            this.isCorrectAnswered = this.score() == 100;

            eventManager.answersSubmitted(
                eventDataBuilder.buildTextMatchingQuestionSubmittedEventData(this)
            );
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
                            id: answer.id,
                            attemptedValue: answer.attemptedValue
                        }
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.id] = ctx.attemptedValue;
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
                    if (progress[answer.id]) {
                        answer.attemptedValue = progress[answer.id];
                    }
                });
            }
            this.score(getScore(this.answers));            
        }
    });