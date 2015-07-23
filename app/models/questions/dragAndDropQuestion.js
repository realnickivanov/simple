define(['guard', 'models/questions/question', 'models/answers/draggableAnswer'],
    function (guard, Question, DraggableAnswer) {
        "use strict";

        function DragAndDropQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.background = spec.background;

            this.answers = (function () {
                var index = 0;
                return _.map(spec.dropspots, function (answer) {
                    return new DraggableAnswer({
                        id: answer.id,
                        shortId: index++,
                        isCorrect: true,
                        text: answer.text,
                        x: answer.x,
                        y: answer.y
                    });
                });
            })();
        }

        return DragAndDropQuestion;

        function submitAnswer(dragableTexts) {
            guard.throwIfNotArray(dragableTexts, 'Dragable texts is not array.');

            saveAnswersState(dragableTexts, this.answers);

            return calculateScore(this.answers);
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
                answer.currentPosition = {
                    x: dragableText.x,
                    y: dragableText.y
                };
            });
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.answers)
                    .filter(function (answer) {
                        return answer.currentPosition
                            && answer.currentPosition.x
                            && answer.currentPosition.x > -1
                            && answer.currentPosition.y
                            && answer.currentPosition.y > -1;
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.shortId] = ctx.currentPosition;
                        return obj;
                    }, {})
                    .value();
            }
        }

        function restoreProgress(progress) {
            if (progress === 100) {
                _.each(this.answers, function (answer) {
                    answer.currentPosition = { x: answer.correctPosition.x, y: answer.correctPosition.y }
                });
            } else {
                _.each(this.answers, function (answer) {
                    if (progress[answer.shortId]) {
                        answer.currentPosition = progress[answer.shortId];
                    }
                });

            }
            this.score(calculateScore(this.answers));
        }

    });