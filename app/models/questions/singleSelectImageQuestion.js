define(['eventManager', 'guard', 'constants', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/checkableImageAnswer'],
    function (eventManager, guard, constants, eventDataBuilder, Question, CheckableImageAnswer) {
        "use strict";

        function SingleSelectImageQuestion(spec) {
            var _protected = {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            };

            Question.call(this, spec, _protected);

            this.correctAnswerId = spec.correctAnswerId;
            this.checkedAnswerId = null;
            this.answers = _.map(spec.answers, function (answer) {
                return new CheckableImageAnswer({
                    id: answer.id,
                    image: answer.image || constants.defaultImageUrl
                });
            });
        }

        return SingleSelectImageQuestion;

        function submitAnswer(checkedAnswerId) {

            this.checkedAnswerId = checkedAnswerId;

            this.score(calculateScore(checkedAnswerId, this.correctAnswerId));
            this.isAnswered = true;
            this.isCorrectAnswered = this.score() == 100;

            eventManager.answersSubmitted(
                eventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData(this)
            );
        }

        function calculateScore(answerId, correctAnswerId) {
            return answerId != correctAnswerId ? 0 : 100;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return this.checkedAnswerId;
            }
        }

        function restoreProgress(progress) {
            this.checkedAnswerId = progress === 100 ? this.correctAnswerId : progress;
            this.score(calculateScore(this.checkedAnswerId, this.correctAnswerId));
        }

    });