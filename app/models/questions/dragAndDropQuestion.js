define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/draggableAnswer'],
    function (eventManager, guard, eventDataBuilder, Question, DraggableAnswer) {
        "use strict";

        function DragAndDropQuestion(spec) {
            var _protected = {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            };

            Question.call(this, spec, _protected);

            this.background = spec.background;

            this.answers = _.map(spec.dropspots, function (answer) {
                return new DraggableAnswer({
                    id: answer.id,
                    isCorrect: true,
                    text: answer.text,
                    x: answer.x,
                    y: answer.y
                });
            });
        }

        return DragAndDropQuestion;

        function submitAnswer(dragableTexts) {
            guard.throwIfNotArray(dragableTexts, 'Dragable texts is not array.');

            saveAnswersState(dragableTexts, this.answers);

            this.isAnswered = true;

            this.score(calculateScore(this.answers));
            this.isCorrectAnswered = this.score() == 100;


            eventManager.answersSubmitted(
                eventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData(this)
            );
        }

        function calculateScore(answers) {
            var hasIncorrectAnswer = _.some(answers, function (answer) {
                return answer.currentPosition.x != answer.correctPosition.x || answer.currentPosition.y != answer.correctPosition.y;
            });

            return hasIncorrectAnswer ? 0 : 100;
        }

        function saveAnswersState(dragableTexts, answers) {
            _.each(dragableTexts, function (dragableText) {
                var answer = _.find(answers, function (answer) {
                    return answer.id === dragableText.id;
                });
                answer.currentPosition = dragableText.position;
            });
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                debugger;
            }
        }

        function restoreProgress(progress) {
            debugger;
        }

    });