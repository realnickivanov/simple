define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder', 'models/questions/question', 'models/answers/answerGroup', 'models/answers/answer'],
    function (eventManager, guard, eventDataBuilder, Question, AnswerGroup, Answer) {
        "use strict";

        function FillInTheBlankQuestion(spec) {
            Question.call(this, spec);

            this.submitAnswer = submitAnswer;
            this.answerGroupsValues = null;

            this.answerGroups = _.map(spec.answerGroups, function (answerGroup) {
                return new AnswerGroup({
                    id: answerGroup.id,
                    type: answerGroup.type,
                    answers: _.map(answerGroup.answers, function (answer) {
                        return new Answer({
                            id: answer.id,
                            isCorrect: answer.isCorrect,
                            text: answer.text
                        });
                    })
                });
            });
        }

        return FillInTheBlankQuestion;

        function submitAnswer(inputValues) {
            guard.throwIfNotArray(inputValues, 'Input values is not array.');

            this.answerGroupsValues = inputValues;
            this.isAnswered = true;

            this.score(calculateScore(inputValues, this.answerGroups));
            this.isCorrectAnswered = this.score() == 100;

            saveAnsweredTexts(inputValues, this.answerGroups);

            eventManager.answersSubmitted(
                eventDataBuilder.buildFillInQuestionSubmittedEventData(this)
            );
        }

        function calculateScore(answerGroupValues, pointer) {
            var hasIncorrectAnswer = _.some(answerGroupValues, function (answerGroupValue) {
                return _.some(pointer, function (answerGroup) {
                    if (_.isFunction(answerGroup.checkIsCorrect) && answerGroupValue.id == answerGroup.id) {
                        return !answerGroup.checkIsCorrect(answerGroupValue);
                    }
                    return false;
                });
            });

            return hasIncorrectAnswer ? 0 : 100;
        }

        function saveAnsweredTexts(answerGroupValues, answerGroups) {
            _.each(answerGroupValues, function (answerGroupValue) {
                var answerGroup = _.find(answerGroups, function (answerGroup) {
                    return answerGroup.id === answerGroupValue.id;
                });
                
                answerGroup.answeredText = answerGroupValue.value;
            });
        }

    });