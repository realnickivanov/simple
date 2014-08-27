define(['modules/templateSettings', 'constants'],
    function (templateSettings, constants) {

        var ctor = function (spec) {

            var objective = {
                id: spec.id,
                title: spec.title,
                questions: ko.observableArray(spec.questions)
            };

            objective.score = ko.computed(function () {
                var questions = _.filter(objective.questions(), function (question) { return question.type !== constants.questionTypes.informationContent; });
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