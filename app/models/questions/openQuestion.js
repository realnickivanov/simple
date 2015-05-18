define(['models/questions/question', 'guard'], function (Question, guard) {
    "use strict";

    function OpenQuestion(spec) {
        Question.call(this, spec, {
            getProgress: getProgress,
            restoreProgress: restoreProgress,

            submit: submitAnswer
        });

        this.answeredText = '';
    }

    return OpenQuestion;

    function getProgress() {
        return this.isAnswered ? this.answeredText : 0;
    }

    function restoreProgress(progress) {
        if (progress === 0) {
            return;
        }

        this.answeredText = progress;
        this.score(progress ? 100 : 0);
    }

    function submitAnswer(answeredText) {
        guard.throwIfNotString(answeredText);
        this.answeredText = answeredText;
        return answeredText ? 100 : 0;
    }
});