define(['context', 'repositories/courseRepository', 'plugins/router', 'windowOperations', 'templateSettings', 'progressContext'],
    function (context, repository, router, windowOperations, templateSettings, progressContext) {

        var
            objectives = [],
            score = 0,
            masteryScore = 0,
            courseTitle = "\"" + context.course.title + "\"",
            objectivesLayout = null,

            activate = function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }
                this.objectivesLayout = templateSettings.objectivesLayout,
                this.score = course.score();
                this.masteryScore = templateSettings.masteryScore.score;
                this.objectives = _.map(course.objectives, function (item) {

                    return {
                        id: item.id,
                        title: item.title,
                        imageUrl: getResizedObjectiveThumbnailUrl(item.imageUrl),
                        score: item.score(),
                        questions: item.questions,
                        affectProgress: item.affectProgress,
                        goToFirstQuestion: function () {
                            if (router.isNavigationLocked()) {
                                return;
                            }
                            router.navigate('#/objective/' + item.id + '/question/' + item.questions[0].id);
                        }
                    };
                });
            }


        return {
            activate: activate,
            isNavigationLocked: router.isNavigationLocked,
            caption: 'Objectives and questions',
            courseTitle: courseTitle,
            objectivesLayout: objectivesLayout,

            score: score,
            masteryScore: masteryScore,
            objectives: objectives
        };

        function getResizedObjectiveThumbnailUrl(imageUrl) {
            var regex = /\?width=\d+\&height=\d+&scaleBySmallerSide=\w+/,
                imageResizerOptions = '?width=284&height=170&scaleBySmallerSide=false',
                coincidences = regex.exec(imageUrl),
                originalImage = imageUrl;
            if (templateSettings.objectivesLayout === "List") {
                imageResizerOptions = '?width=100&height=70&scaleBySmallerSide=false';
            }
            if (coincidences && coincidences.length) {
                originalImage = imageUrl.substring(0, coincidences.index);
            }

            return originalImage + imageResizerOptions;
        }

    });