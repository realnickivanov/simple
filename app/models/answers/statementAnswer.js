define(['models/answers/answer'], function(Answer) {
    "use strict";

    function SatementAnswer(spec) {
        Answer.call(this, spec);
        this.userSelect = null;
    }

    return SatementAnswer;
});