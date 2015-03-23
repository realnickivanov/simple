define(['templateSettings', 'constants'],
    function (templateSettings, constants) {

        var ctor = function (spec) {

            var objective = {
                id: spec.id,
                title: spec.title,
                imageUrl: spec.imageUrl,
                questions: spec.questions
            };

            var questions = _.filter(objective.questions, function(question) {
                 return question.type !== constants.questionTypes.informationContent;
            });

            objective.affectProgress = questions.length > 0;

            objective.score = ko.computed(function () {
                var result = _.reduce(questions, function (memo, question) { return memo + question.score(); }, 0);
                var questionsLength = questions.length;
                return questionsLength == 0 ? 0 : Math.floor(result / questionsLength);
            });

            objective.isCompleted = ko.computed(function () {
                return objective.score() >= templateSettings.masteryScore.score;
            });

            return objective;
        };

        return ctor;
    }
);