define(['models/questions/question'], function(Question) {
    "use strict";

    function StatementQuestion(spec) {
        Question.call(this, spec);

        this.statements = spec.statements;
    }

    return StatementQuestion;
});