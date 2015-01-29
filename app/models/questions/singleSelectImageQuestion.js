define(['guard', 'constants', 'models/questions/question', 'models/answers/checkableImageAnswer'],
    function (guard, constants, Question, CheckableImageAnswer) {
        "use strict";

        function SingleSelectImageQuestion(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.correctAnswerId = spec.correctAnswerId;
            this.checkedAnswerId = null;
            this.answers = (function () {
                var index = 0;
                return _.map(spec.answers, function (answer) {
                    return new CheckableImageAnswer({
                        id: answer.id,
                        shortId: index++,
                        image: answer.image || constants.defaultImageUrl
                    });
                });
            })();
        }

        return SingleSelectImageQuestion;

        function submitAnswer(checkedAnswerId) {

            this.checkedAnswerId = checkedAnswerId;

            return calculateScore(checkedAnswerId, this.correctAnswerId);
        }

        function calculateScore(answerId, correctAnswerId) {
            return answerId != correctAnswerId ? 0 : 100;
        }

        function getProgress() {
            var that = this;
            if (that.isCorrectAnswered) {
                return 100;
            } else {
                var checked = _.find(that.answers, function (answer) {
                    return answer.id == that.checkedAnswerId;
                });

                return checked ? checked.shortId : undefined;
            }
        }

        function restoreProgress(progress) {
            var that = this;
            if (progress === 100) {
                that.checkedAnswerId = that.correctAnswerId;
            } else {
                var checked = _.find(that.answers, function (answer) {
                    return answer.shortId == progress;
                });

                if (checked) {
                    that.checkedAnswerId = checked.id;
                }

            }
            that.score(calculateScore(that.checkedAnswerId, that.correctAnswerId));
        }

    });