define(['eventManager', 'guard', 'constants', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/checkableImageAnswer'],
    function (eventManager, guard, constants, eventDataBuilder, Question, CheckableImageAnswer) {
        "use strict";

        function SingleSelectImageQuestion(spec) {
            Question.call(this, spec);
            this.correctAnswerId = spec.correctAnswerId;
            this.checkedAnswerId = null;

            this.submitAnswer = submitAnswer;

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

    });