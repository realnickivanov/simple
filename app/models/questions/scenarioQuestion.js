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

            this.masteryScore = spec.masteryScore;
        }

        return ScenarioQuestion;

        function getProgress() {
            
        }

        function restoreProgress() {

        }

        function submitAnswer() {

        }
    });