define([],
    function () {

        function Answer(spec) {
            this.id = spec.id;
            this.shortId = spec.shortId;
            this.text = spec.text;
            this.isCorrect = spec.isCorrect;
        }

        return Answer;
    }
);