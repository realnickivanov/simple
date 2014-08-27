define(['models/course', 'models/objective', 'models/questions/questionsFactory'],
    function (Course, Objective, questionsFactory) {

        var
            course = {},

            initialize = function () {
                var that = this;
                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
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