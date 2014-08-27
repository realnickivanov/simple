define(['models/answers/answer'], function (Answer) {
    "use strict";

    function DraggableAnswer(spec) {
        Answer.call(this, spec);

        this.correctPosition = { x: spec.x, y: spec.y };

        this.currentPosition = { x: -1, y: -1 };
    }

    return DraggableAnswer;

});