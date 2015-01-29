define(function () {
    "use strict";

    function AnswerGroup(spec) {
        this.id = spec.id;
        this.shortId = spec.shortId;
        this.answeredText = '';
        this.answers = spec.answers;

        this.getCorrectText = getCorrectText;
        this.checkIsCorrect = checkIsCorrect;
    }

    return AnswerGroup;

    function getCorrectText() {
        var correctAnswers = _.where(this.answers, {
            isCorrect: true
        });
        return _.map(correctAnswers, function (answer) {
            return answer.text;
        });
    }

    function checkIsCorrect(answerGroupValue) {
        return _.some(this.answers, function (answer) {
            return answer.text == answerGroupValue.value && answer.isCorrect;
        });
    }
})