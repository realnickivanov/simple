define(['models/questions/question', 'models/answers/statementAnswer', 'guard', 'eventManager', 'eventDataBuilders/questionEventDataBuilder'],
    function(Question, StatementAnswer, guard, eventManager, questionEventDataBuilder) {
        "use strict";

        function StatementQuestion(spec) {
            Question.call(this, spec);

            this.statements = _.map(spec.statements, function(statement) {
                return new StatementAnswer({
                    id: statement.id,
                    text: statement.text,
                    isCorrect: statement.isCorrect
                });
            });

            this.submitAnswer = submitAnswer;
        }

        return StatementQuestion;

        function submitAnswer(userAnswers) {
            guard.throwIfNotArray(userAnswers, 'userAnswers is not an array');

            this.isAnswered = true;

            _.each(this.statements, function(statement) {
                var userAnswer = _.find(userAnswers, function(answer) { return answer.id == statement.id; });
                statement.userAnswer = !_.isNullOrUndefined(userAnswer) ? userAnswer.answer : null;
            });

            this.isCorrectAnswered = _.every(this.statements, function(statement) {
                return statement.userAnswer == statement.isCorrect;
            });
            this.score(this.isCorrectAnswered ? 100 : 0);

            var eventData = questionEventDataBuilder.buildStatementQuestionSubmittedEventData(this);
            eventManager.answersSubmitted(eventData);
        }
    });