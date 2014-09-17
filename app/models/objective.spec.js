define(['models/objective', 'modules/templateSettings'], function (ObjectiveModel, templateSettings) {
    var constants = require('constants');
    describe('model [objective]', function () {

        it('should be defined', function () {
            expect(ObjectiveModel).toBeDefined();
        });

        it('should return function', function () {
            expect(ObjectiveModel).toBeFunction();
        });

        var spec = {
            id: 'id',
            title: 'title',
            image: 'image',
            score: 0,
            questions: []
        };
        var objective;

        beforeEach(function () {
            spec.questions = [];
        });

        describe('id:', function () {
            beforeEach(function () {
                objective = new ObjectiveModel(spec);
            });

            it('should be defined', function () {
                expect(objective.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(objective.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            beforeEach(function () {
                objective = new ObjectiveModel(spec);
            });

            it('should be defined', function () {
                expect(objective.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(objective.title).toBe(spec.title);
            });
        });

        describe('affectProgress:', function () {
            it('should be defined', function () {
                objective = new ObjectiveModel(spec);
                expect(objective.affectProgress).toBeDefined();
            });

            describe('when objective contains info pages only', function() {
                it('should be false', function() {
                    spec.questions.push({ score: ko.observable(0), type: constants.questionTypes.informationContent });
                    objective = new ObjectiveModel(spec);
                    expect(objective.affectProgress).toBeFalsy();
                });
            });

            describe('when objective contains info and question pages', function () {
                it('should be true', function () {
                    spec.questions.push({ score: ko.observable(0), type: constants.questionTypes.dragAndDrop});
                    spec.questions.push({ score: ko.observable(0), type: constants.questionTypes.informationContent });

                    objective = new ObjectiveModel(spec);
                    expect(objective.affectProgress).toBeTruthy();
                });
            });
        });

        describe('score:', function () {
            it('should be computed', function () {
                objective = new ObjectiveModel(spec);
                expect(objective.score).toBeComputed();
            });

            describe('when objective has questions', function () {
                it('should have value', function () {
                    spec.questions.push({ score: ko.observable(0) });
                    spec.questions.push({ score: ko.observable(100) });

                    objective = new ObjectiveModel(spec);
                    expect(objective.score()).toBe(50);
                });

                it('should ignore information content pages', function() {
                    spec.questions.push({ score: ko.observable(0) });
                    spec.questions.push({ score: ko.observable(0), type: constants.questionTypes.informationContent });
                    spec.questions.push({ score: ko.observable(100) });

                    objective = new ObjectiveModel(spec);
                    expect(objective.score()).toBe(50);
                });

                describe('when score value is fraction', function() {
                    it('should round value to floor', function () {
                        spec.questions.push({ score: ko.observable(0) });
                        spec.questions.push({ score: ko.observable(100) });
                        spec.questions.push({ score: ko.observable(67) });

                        objective = new ObjectiveModel(spec);
                        expect(objective.score()).toBe(55);
                    });
                });
            });

            describe('when objective has no questions', function () {
                it('should be 0', function () {
                    objective = new ObjectiveModel(spec);
                    expect(objective.score()).toBe(0);
                });
            });
        });

        describe('isCompleted:', function () {
            it('should be computed', function () {
                objective = new ObjectiveModel(spec);
                expect(objective.isCompleted).toBeComputed();
            });

            beforeEach(function () {
                templateSettings.masteryScore.score = 80;
            });

            describe('when score is less than course settings mastery score', function () {
                it('should be false', function () {
                    spec.questions.push({ score: ko.observable(20) });

                    objective = new ObjectiveModel(spec);
                    expect(objective.isCompleted()).toBeFalsy();
                });
            });

            describe('when score equals course settings mastery score', function () {
                it('should be true', function () {
                    spec.questions.push({ score: ko.observable(80) });

                    objective = new ObjectiveModel(spec);
                    expect(objective.isCompleted()).toBeTruthy();
                });
            });

            describe('when score is more than course settings mastery score', function () {
                it('should be true', function () {
                    spec.questions.push({ score: ko.observable(100) });
                    objective = new ObjectiveModel(spec);
                    expect(objective.isCompleted()).toBeTruthy();
                });
            });
        });

        describe('questions:', function () {
            beforeEach(function () {
                spec.questions.push({ score: ko.observable(100) });
                objective = new ObjectiveModel(spec);
            });

            it('should be defined', function () {
                expect(objective.questions).toBeDefined();
            });

            it('should be equal to spec questions', function () {
                expect(objective.questions).toBe(spec.questions);
            });
        });

    });
});