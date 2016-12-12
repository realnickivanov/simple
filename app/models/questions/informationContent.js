define(['models/questions/question', 'templateSettings'],
    function (Question, templateSettings) {
        "use strict";

        function InformationContent(spec) {

            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submit
            });

            this.affectProgress = templateSettings.allowContentPagesScoring;

            var superSubmitAnswer = this.submitAnswer;
            this.submitAnswer = function () {
                if (this.isAnswered)
                    return;

                superSubmitAnswer.call(this);
            }
        }

        return InformationContent;

        function getProgress() {
            return this.score();
        }

        function restoreProgress(progress) {
            if (!_.isNaN(progress)) {
                this.score(progress === 100 ? progress : 0);
            }
        }

        function submit() {
            return 100;
        }
});