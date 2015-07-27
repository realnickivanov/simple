define(['eventManager', 'constants'],
    function (eventManager, constants) {

        var ctor = function (spec) {

            var course = {
                id: spec.id,
                title: spec.title,

                createdBy: spec.createdBy,
                createdOn: spec.createdOn,

                hasIntroductionContent: spec.hasIntroductionContent,
                objectives: spec.objectives,
                isFinished: false
            }

            var affectProgressObjectives = _.filter(course.objectives, function (objective) {
                return objective.affectProgress;
            });

            course.score = function () {
                var result = _.reduce(affectProgressObjectives, function (memo, objective) {
                    return memo + objective.score();
                }, 0);

                var objectivesLength = affectProgressObjectives.length;
                return objectivesLength == 0 ? 0 : Math.floor(result / objectivesLength);
            };

            course.result = function () {
                return course.score() / 100;
            }

            course.isCompleted = function () {
                return !_.some(affectProgressObjectives, function (objective) {
                    return !objective.isCompleted();
                });
            };

            course.getStatus = function () {
                if (!course.isFinished) {
                    return constants.course.statuses.inProgress;
                }

                return course.isCompleted() ? constants.course.statuses.completed : constants.course.statuses.failed;
            };

            course.finish = function (callback) {
                course.isFinished = true;
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