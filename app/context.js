define(['models/course', 'models/objective', 'models/questions/questionsFactory', 'progressContext'],
    function (Course, Objective, questionsFactory, progressContext) {

        var
            course = {},

            initialize = function () {
                var that = this;
                return $.ajax({
                    url: 'content/data.js',
                    contentType: 'application/json',
                    dataType: 'json',
                    cache: false
                }).then(function (response) {
                    var progress = progressContext.get();

                    that.course = new Course({
                        id: response.id,
                        title: response.title,
                        hasIntroductionContent: response.hasIntroductionContent,
                        objectives: _.chain(response.objectives)
                            .filter(function (item) {
                                return !_.isNullOrUndefined(item.questions) && item.questions.length > 0;
                            })
                            .map(function (objective) {
                                return new Objective({
                                    id: objective.id,
                                    title: objective.title,
                                    questions: _.map(objective.questions, function (question) {
                                        return questionsFactory.createQuestion(objective.id, question);
                                    })
                                });
                            })
                            .value()
                    });

                    if (_.isObject(progress)) {
                        _.each(that.course.objectives, function (objective) {
                            _.each(objective.questions, function (question) {
                                if (progress[question.id]) {
                                    question.progress(progress[question.id]);
                                }
                            });
                        });
                    }

                    return {
                        course: that.course
                    };
                });
            };

        return {
            initialize: initialize,
            course: course
        };

    });