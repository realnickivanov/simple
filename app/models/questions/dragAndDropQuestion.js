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

            var that = this;
            var answersArray = [];
            _.each(that.answers, function (answer) {
                answer.currentPosition = { x: -1, y: -1 };
            })
            _.each(dragableTexts, function (dragableText) {
                answersArray = _.where(that.answers, { text: dragableText.text });
                var answer = _.find(answersArray, function (answer) {
                    return answer.text === dragableText.text && answer.correctPosition.x === dragableText.x && answer.correctPosition.y === dragableText.y
                })
                if (answer && answer.currentPosition) {
                    answer.currentPosition.x = answer.correctPosition.x,
                    answer.currentPosition.y = answer.correctPosition.y
                }
                else {
                    var answer = _.find(that.answers, function (answer) {
                        return answer.text == dragableText.text
                    })
                    answer.currentPosition.x = dragableText.x,
                    answer.currentPosition.y = dragableText.y
                }
            });

            return calculateScore(this.answers);

        }

        function calculateScore(answers) {

            var hasIncorrectAnswer = _.some(answers, function (answer) {
                return answer.currentPosition.x != answer.correctPosition.x || answer.currentPosition.y != answer.correctPosition.y;
            });

            return hasIncorrectAnswer ? 0 : 100;
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