define(['models/answers/checkableAnswer'], function (CheckableAnswer) {
    "use strict";

    function CheckableImageAnswer(spec) {
        this.id = spec.id;
        this.image = spec.image;
    }

    return CheckableImageAnswer;

});