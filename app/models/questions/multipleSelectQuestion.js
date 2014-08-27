define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/checkableAnswer'],
    function (eventManager, guard, eventDataBuilder, Question, CheckableAnswer) {
        "use strict";

        function MultipleSelectQuestion(spec) {
            Question.call(this, spec);

            this.submitAnswer = submitAnswer;
            
            this.answers = _.map(spec.answers, function (answer) {
                return new CheckableAnswer({
                    id: answer.id,
                    isCorrect: answer.isCorrect,
                    text: answer.text
                });
            });
        }

        return MultipleSelectQuestion;

        function submitAnswer(checkedAnswerIds) {
            guard.throwIfNotArray(checkedAnswerIds, 'Checked answer ids is not an array');

            _.each(this.answers, function (answer) {
                answer.isChecked = _.contains(checkedAnswerIds, answer.id);
            });

            this.score(calculateScore(this.answers));
            this.isAnswered = true;
            this.isCorrectAnswered = this.score() == 100;

            eventManager.answersSubmitted(
                eventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData(this)
            );
        }

        function calculateScore(answers) {
            var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
                return answer.isChecked != answer.isCorrect;
            });

            return hasIncorrectCheckedAnswer ? 0 : 100;
        }
     
    });