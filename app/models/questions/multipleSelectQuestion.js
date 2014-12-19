define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/checkableAnswer', 'durandal/app'],
    function (eventManager, guard, eventDataBuilder, Question, CheckableAnswer, app) {
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

            this.progress = function (data) {
                if (data) {
                    return restoreProgress.call(this, data);
                } else {
                    return getProgress.call(this);
                }
            };
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

            app.trigger('question:answered', this);
        }
        function calculateScore(answers) {
            var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
                return answer.isChecked != answer.isCorrect;
            });

            return hasIncorrectCheckedAnswer ? 0 : 100;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.chain(this.answers)
                    .filter(function (answer) {
                        return answer.isChecked;
                    })
                    .map(function (answer) {
                        return answer.id;
                    }).value();
            }
        }

        function restoreProgress(progress) {
            _.each(this.answers, function (answer) {
                answer.isChecked = progress === 100 ? answer.isCorrect : progress && progress.indexOf(answer.id) > -1;
            });
            this.score(calculateScore(this.answers));
            this.isAnswered = true;
            this.isCorrectAnswered = this.score() == 100;
        }

    });