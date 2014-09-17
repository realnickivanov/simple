define(['models/course'], function (CourseModel) {

    var eventManager = require('eventManager'),
        eventDataBuilder = require('eventDataBuilders/courseEventDataBuilder');

    describe('model [course]', function () {

        it('should be defined', function () {
            expect(CourseModel).toBeDefined();
        });

        it('should return function', function () {
            expect(CourseModel).toBeFunction();
        });

        var course;
        var spec = {
            id: 'id',
            title: 'title',
            hasIntroductionContent: false,
            objectives: []
        };

        describe('id:', function () {
            beforeEach(function () {
                course = new CourseModel(spec);
            });

            it('should be defined', function () {
                expect(course.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(course.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            beforeEach(function () {
                course = new CourseModel(spec);
            });

            it('should be defined', function () {
                expect(course.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(course.title).toBe(spec.title);
            });
        });

        describe('hasIntroductionContent:', function () {
            beforeEach(function () {
                course = new CourseModel(spec);
            });

            it('should be defined', function () {
                expect(course.hasIntroductionContent).toBeDefined();
            });

            it('should be equal to spec hasIntroductionContent', function () {
                expect(course.hasIntroductionContent).toBe(spec.hasIntroductionContent);
            });
        });


        describe('objectives:', function () {
            beforeEach(function () {
                spec.objectives = [];
                spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: true });
                course = new CourseModel(spec);
            });

            it('should be defined', function () {
                expect(course.objectives).toBeDefined();
            });

            it('should be equal to spec objectives', function () {
                expect(course.objectives).toBe(spec.objectives);
            });
        });

        describe('score:', function () {
            it('should be computed', function () {
                spec.objectives = [];
                course = new CourseModel(spec);

                expect(course.score).toBeComputed();
            });


            describe('when course has objectives those affect progress', function () {
                it('should have average value', function () {
                    spec.objectives = [];
                    spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: true });
                    spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });

                    course = new CourseModel(spec);

                    expect(course.score()).toBe(50);
                });

                describe('when value is fraction', function() {
                    it('should round value to floor', function() {
                        spec.objectives = [];
                        spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: true });
                        spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });
                        spec.objectives.push({ score: ko.observable(67), isCompleted: ko.observable(true), affectProgress: true });

                        course = new CourseModel(spec);

                        expect(course.score()).toBe(55);
                    });
                });
            });

            describe('when course has objectives those no affect progress', function () {
                it('should not include such objectives into account', function () {
                    spec.objectives = [];
                    spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: false });
                    spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });

                    course = new CourseModel(spec);

                    expect(course.score()).toBe(100);
                });
            });

            describe('when course has no objectives', function () {

                it('should be 0', function () {
                    spec.objectives = [];
                    course = new CourseModel(spec);

                    expect(course.score()).toBe(0);
                });
            });
        });

        describe('isCompleted:', function () {
            it('should be computed', function () {
                spec.objectives = [];
                course = new CourseModel(spec);

                expect(course.isCompleted).toBeComputed();
            });

            describe('when course has at least one not passed objective that affect progress', function () {

                it('should be false', function () {
                    spec.objectives = [];
                    spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: true });
                    spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });

                    course = new CourseModel(spec);

                    expect(course.isCompleted()).toBeFalsy();
                });
            });

            describe('when course has one not passed objective that not affect progress', function () {

                it('should be true', function () {
                    spec.objectives = [];
                    spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(false), affectProgress: false });
                    spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });

                    course = new CourseModel(spec);

                    expect(course.isCompleted()).toBeTruthy();
                });
            });

            describe('when all objectives are passed', function () {

                it('should be true', function () {
                    spec.objectives = [];
                    spec.objectives.push({ score: ko.observable(0), isCompleted: ko.observable(true), affectProgress: true });
                    spec.objectives.push({ score: ko.observable(100), isCompleted: ko.observable(true), affectProgress: true });

                    course = new CourseModel(spec);

                    expect(course.isCompleted()).toBeTruthy();
                });
            });
        });

        describe('finish:', function () {
            var eventData = {};
            var obj = {
                callback: function () { }
            };
            beforeEach(function () {
                spyOn(eventDataBuilder, 'buildCourseFinishedEventData').andReturn(eventData);
                spyOn(eventManager, 'turnAllEventsOff');
                spyOn(eventManager, 'courseFinished').andCallFake(function (arg, callbackFunction) {
                    callbackFunction();
                });

                spec.objectives = [];
                course = new CourseModel(spec);
            });

            it('should be function', function () {
                expect(course.finish).toBeFunction();
            });

            it('should call eventDataBuilder buildCourseFinishedEventData', function () {
                course.finish(obj.callback);
                expect(eventDataBuilder.buildCourseFinishedEventData).toHaveBeenCalled();
            });

            it('should call event manager course finished event', function () {
                course.finish(obj.callback);
                expect(eventManager.courseFinished).toHaveBeenCalled();
            });

            describe('when course finished', function () {
                it('should call event manager course turnAllEventsOff', function () {
                    course.finish(obj.callback);
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should call callback function', function () {
                    spyOn(obj, 'callback');
                    course.finish(obj.callback);
                    expect(obj.callback).toHaveBeenCalled();
                });

            });
        });
    });
});