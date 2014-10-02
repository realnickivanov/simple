define(['models/answers/answer'], function(Answer) {
    "use strict";

    function SatementAnswer(spec) {
        Answer.call(this, spec);
        this.selectedState = null;
    }

    return SatementAnswer;
});