define(['context', 'repositories/courseRepository', 'plugins/router', 'windowOperations', 'templateSettings', 'progressContext'],
    function (context, repository, router, windowOperations, templateSettings, progressContext) {

        var
            objectives = [],
            score = 0,
            masteryScore = 0,
            courseTitle = "\"" + context.course.title + "\"",

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },
            status = ko.observable(statuses.readyToFinish),

            finishPopupVisibility = ko.observable(false),

            activate = function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }

                this.score = course.score();
                this.masteryScore = templateSettings.masteryScore.score;
                this.objectives = _.map(course.objectives, function (item) {

                    return {
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        score: item.score(),
                        questions: item.questions,
                        affectProgress: item.affectProgress,
                        goToFirstQuestion: function() {
                            router.navigate('#/objective/' + item.id + '/question/' + item.questions[0].id);
                        }
                    };
                });
            },

            finish = function () {
                if (status() != statuses.readyToFinish) {
                    return;
                }
                status(statuses.sendingRequests);
                var course = repository.get();
                course.finish(onCourseFinishedCallback);

                progressContext.remove();
            },

            closeFinishPopup = function() {
                finishPopupVisibility(false);
            },

            openFinishPopup = function () {
                finishPopupVisibility(true);
            },

            onCourseFinishedCallback = function () {
                status(statuses.finished);
                windowOperations.close();
            };

        return {
            activate: activate,
            caption: 'Objectives and questions',
            courseTitle: courseTitle,
            finishPopupVisibility: finishPopupVisibility,
            finish: finish,
            closeFinishPopup: closeFinishPopup,
            openFinishPopup: openFinishPopup,

            score: score,
            masteryScore: masteryScore,
            objectives: objectives,
            status: status,
            statuses: statuses
        };
    }
);