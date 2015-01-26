define(['models/answers/answer'], function (Answer) {
    "use strict";

    function SatementAnswer(spec) {
        Answer.call(this, spec);
        this.userAnswer = null;
    }

    return SatementAnswer;
});