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
        if (!_.isString(answerGroupValue.value)) {
            return false;
        }

        return _.some(this.answers, function (answer) {
            return answer.isCorrect &&
                answer.matchCase ? answer.text === answerGroupValue.value : answer.text.toLowerCase() === answerGroupValue.value.toLowerCase();
        });
    }
})