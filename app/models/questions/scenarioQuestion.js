define(['guard', 'models/questions/question'],
    function (guard, Question) {
        "use strict";

        function ScenarioQuestion(spec) {
            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submitAnswer
            });

            this.embedCode = spec.embedCode;

            this.embedUrl = spec.embedUrl;

            this.projectId = spec.projectId;

            this.masteryScore = spec.masteryScore;
        }

        return ScenarioQuestion;

        function getProgress() {
            return this.score();
        }

        function restoreProgress(progress) {
            if (!_.isNaN(progress)) {
                this.score(progress);
            }
        }

        function submitAnswer(score) {
            guard.throwIfNotNumber(score, 'Score is not a number');

            var correctScore = score >= this.masteryScore ? 100 : score;

            return correctScore;
        }
    });