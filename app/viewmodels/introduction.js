define(['durandal/app', 'context', 'plugins/router', 'plugins/http'],
    function (app, context, router, http) {

        var courseTitle = null,
            content = null,

            canActivate = function () {
                if (context.course.hasIntroductionContent == false) {
                    return { redirect: '#objectives' };
                }
                return true;
            },

            activate = function () {
                this.courseTitle = "\"" + context.course.title + "\"";

                var that = this;
                return Q.fcall(function () {
                    return http.get('content/content.html').then(function (response) {
                        that.content = response;
                    }).fail(function () {
                        that.content = '';
                    });
                });

            },

            startCourse = function () {
                if (router.isNavigationLocked()) {
                    return;
                }
                router.navigate('objectives');

            };

        return {
            courseTitle: courseTitle,
            content: content,
            isNavigationLocked: router.isNavigationLocked,

            startCourse: startCourse,
            canActivate: canActivate,
            activate: activate
        };
    }
);