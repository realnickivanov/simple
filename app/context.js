define(['models/course', 'models/objective', 'models/questions/questionsFactory'],
    function (Course, Objective, questionsFactory) {

        var
            course = {},

            initialize = function () {
                var dfd = Q.defer();
                var that = this;
                $.ajax({
                    url: 'content/data.js',
                    contentType: 'application/json',
                    dataType: 'json',
                    cache: false
                }).done(function (response) {
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
                                    imageUrl: objective.imageUrl,
                                    questions: _.chain(objective.questions).map(function (question) {
                                        return questionsFactory.createQuestion(objective.id, question); 
                                    }).filter(function(question){
                                        return question != null;
                                    }).value()
                                });
                            })
                            .value(),
                        createdOn: new Date(response.createdOn),
                        createdBy: response.createdBy
                    });

                    dfd.resolve({
                        course: that.course
                    });
                }).fail(function () {
                    dfd.reject('Unable to load data.js');
                });

                return dfd.promise;
            };

        return {
            initialize: initialize,
            course: course
        };
    });