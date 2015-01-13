define(['eventManager'],
    function (eventManager) {

        var ctor = function (spec) {

            var course = {
                id: spec.id,
                title: spec.title,

                createdBy: spec.createdBy,
                createdOn: spec.createdOn,

                hasIntroductionContent: spec.hasIntroductionContent,
                objectives: spec.objectives
            }

            var affectProgressObjectives = _.filter(course.objectives, function (objective) {
                return objective.affectProgress;
            });

            course.score = ko.computed(function () {
                var result = _.reduce(affectProgressObjectives, function (memo, objective) {
                    return memo + objective.score();
                }, 0);

                var objectivesLength = affectProgressObjectives.length;
                return objectivesLength == 0 ? 0 : Math.floor(result / objectivesLength);
            });

            course.isCompleted = ko.computed(function () {
                return !_.some(affectProgressObjectives, function (objective) {
                    return !objective.isCompleted();
                });
            });

            course.finish = function (callback) {
                eventManager.courseFinished(course, function () {
                    eventManager.turnAllEventsOff();
                    callback();
                });
            };

            return course;
        };

        return ctor;
    }
);