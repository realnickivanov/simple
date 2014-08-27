define(['models/questions/question', 'eventManager', 'eventDataBuilders/questionEventDataBuilder', ],
    function (Question, eventManager, eventDataBuilder) {
        "use strict";

        function TextMatchingQuestion(spec) {
            Question.call(this, spec);

            this.answers = _.map(spec.answers, function (answer) {
                return {
                    id: answer.id,
                    key: answer.key,
                    value: answer.value,
                    attemptedValue: null
                };
            });
            this.submitAnswer = submitAnswer;
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

    });