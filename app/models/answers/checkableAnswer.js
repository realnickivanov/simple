define(['models/answers/answer'], function (Answer) {
    "use strict";

    function CheckableAnswer(spec) {
        Answer.call(this, spec);

        this.isChecked = false;
    }

    return CheckableAnswer;

});