define(['models/course', 'models/section', 'models/questions/questionsFactory'],
    function (Course, Section, questionsFactory) {

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
                        templateId: response.templateId,
                        title: response.title,
                        hasIntroductionContent: response.hasIntroductionContent,
                        sections: _.chain(response.sections)
                            .filter(function (item) {
                                return !_.isNullOrUndefined(item.questions) && item.questions.length > 0;
                            })
                            .map(function (section) {
                                return new Section({
                                    id: section.id,
                                    title: section.title,
                                    imageUrl: section.imageUrl,
                                    questions: _.chain(section.questions).map(function (question) {
                                        return questionsFactory.createQuestion(section.id, question); 
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