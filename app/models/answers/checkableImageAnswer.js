define(['models/answers/checkableAnswer'], function (CheckableAnswer) {
    "use strict";

    function CheckableImageAnswer(spec) {
        this.id = spec.id;
        this.shortId = spec.shortId;
        this.image = spec.image;
    }

    return CheckableImageAnswer;

});