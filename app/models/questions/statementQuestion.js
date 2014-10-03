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

    function submitAnswer(studentAnswers) {
        guard.throwIfNotArray(studentAnswers, 'studentAnswers is not an array');

        this.isAnswered = true;
        this.isCorrectAnswered = _.every(this.statements, function(statement) {
            var studentAnswer = _.find(studentAnswers, function(answer) { return answer.id == statement.id; });
            console.log(!_.isNullOrUndefined(studentAnswer) && studentAnswer.answer == statement.isCorrect);
            return !_.isNullOrUndefined(studentAnswer) && studentAnswer.answer == statement.isCorrect;
        });
        this.score(this.isCorrectAnswered ? 100 : 0);
    }
});