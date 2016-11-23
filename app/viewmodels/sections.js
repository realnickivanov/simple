define(['context', 'repositories/courseRepository', 'plugins/router', 'windowOperations', 'templateSettings', 'translation'],
    function (context, repository, router, windowOperations, templateSettings, translation) {

        var
            sections = [],
            masteryScore = 0,
            courseTitle = context.course.title,
            sectionsLayout = null,
            sectionThumbnail = { width: 284, height: 170 },

            activate = function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }
                this.sectionsLayout = templateSettings.sectionsLayout,
                this.masteryScore = templateSettings.masteryScore.score;

                if(sectionsLayout === "List") {
                    sectionThumbnail.width = 100;
                    sectionThumbnail.height = 70;
                }
                
                this.sections = _.map(course.sections, function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        imageUrl: item.imageUrl,
                        imageWidth: sectionThumbnail.width,
                        imageHeight: sectionThumbnail.height,
                        score: item.score(),
                        scoreTooltipText: getScoreTooltipText(templateSettings.masteryScore.score, item.score()),
                        questions: item.questions,
                        affectProgress: item.affectProgress,
                        goToFirstQuestion: function () {
                            if (router.isNavigationLocked()) {
                                return;
                            }
                            router.navigate('#/section/' + item.id + '/question/' + item.questions[0].id);
                        }
                    };
                });
            }


        return {
            activate: activate,
            isNavigationLocked: router.isNavigationLocked,
            caption: 'Sections and questions',
            courseTitle: courseTitle,
            sectionsLayout: sectionsLayout,

            masteryScore: masteryScore,
            sections: sections
        };

        function getScoreTooltipText(masteryScore, score) {
            var scoreToComplete = masteryScore - score;
            return scoreToComplete > 0 ? scoreToComplete + '% ' + translation.getTextByKey('[to complete]') : translation.getTextByKey('[completed]');
        }

    });