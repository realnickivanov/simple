define(['viewmodels/questions/content'], function (viewModel) {
    "use strict";

    var
        objectiveRepository = require('repositories/objectiveRepository'),
        repository = require('repositories/questionRepository'),
        templateSettings = require('modules/templateSettings'),
        router = require('plugins/router'),
        constants = require('constants');

    describe('viewmodel [content]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objective:', function() {

            it('should be defined', function() {
                expect(viewModel.objective).toBeDefined();
            });

        });

        describe('question:', function () {

            it('should be defined', function () {
                expect(viewModel.question).toBeDefined();
            });

        });

        describe('isLoadingNewQuestion:', function () {

            it('should be equal to router.isNavigating', function() {
                expect(viewModel.isLoadingNewQuestion).toBe(router.isNavigating);
            });

        });

        describe('masteryScore:', function () {

            it('should be defined', function () {
                expect(viewModel.masteryScore).toBeDefined();
            });

            it('should be 0 by default', function () {
                expect(viewModel.masteryScore).toBe(0);
            });

        });

        describe('navigationContext:', function () {

            it('should be defined', function() {
                expect(viewModel.navigationContext).toBeDefined();
            });

        });

        describe('backToObjectives:', function () {

            it('should be function', function() {
                expect(viewModel.backToObjectives).toBeFunction();
            });

            it('should navigate to objectives', function () {
                spyOn(router, 'navigate');
                viewModel.backToObjectives();
                expect(router.navigate).toHaveBeenCalledWith('objectives');
            });

        });

        describe('startTime:', function () {

            it('should be defined', function () {
                expect(viewModel.startTime).toBeDefined();
            });

        });

        describe('activate:', function () {

            var
            question = {
                id: '1',
                title: 'Some question 1',
                type: 'multipleSelect',
                isAnswered: true,
                isCorrectAnswered: false,
                answers: [
                    { id: '1', isCorrect: false, text: 'Some answer option 1', isChecked: false },
                    { id: '2', isCorrect: true, text: 'Some answer option 2', isChecked: true }
                ],
                learningContents: [
                    { id: '1' },
                    { id: '2' }
                ],
                feedback: {
                    hasCorrect: false,
                    correct: null,

                    hasIncorrect: false,
                    incorrect: null
                },
                learningContentExperienced: function () {
                },
                submitAnswer: function () {
                },
                load: function () { }
            },
            objective = {
                id: '1',
                title: 'Objective title',
                score: ko.observable(80)
            };

            beforeEach(function () {
                spyOn(router, 'navigate');
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            describe('when objective is not found', function () {

                beforeEach(function () {
                    spyOn(objectiveRepository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
                    var promise = viewModel.activate(objective.id, question.id);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when objective is found', function () {

                beforeEach(function () {
                    spyOn(objectiveRepository, 'get').andReturn(objective);
                });

                describe('and when question is not found', function () {

                    beforeEach(function () {
                        spyOn(repository, 'get').andReturn(null);
                    });

                    it('should navigate to 404', function () {
                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).toHaveBeenCalledWith('404');
                        });
                    });

                });

                describe('and when question is found', function () {

                    var questionLoadDeferred;
                    beforeEach(function () {
                        questionLoadDeferred = Q.defer();
                        spyOn(question, 'load').andReturn(questionLoadDeferred.promise);
                        questionLoadDeferred.resolve();

                        spyOn(repository, 'get').andReturn(question);
                    });

                    it('should not navigate', function () {
                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).not.toHaveBeenCalled();
                        });
                    });

                    it('should set startTime', function () {
                        viewModel.startTime = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.startTime).not.toBeNull();
                        });
                    });

                    it('should set mastery score', function () {
                        viewModel.masteryScore = 0;
                        templateSettings.masteryScore.score = 55;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.masteryScore).toBe(55);
                        });
                    });

                    it('should set navigationContext', function () {
                        viewModel.navigationContext = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.navigationContext).not.toBeNull();
                        });
                    });

                    it('should load question', function () {
                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.question.load).toHaveBeenCalled();
                        });
                    });

                    describe('and when question loaded', function () {

                        describe('and when question type = ' + constants.questionTypes.informationContent, function () {

                            beforeEach(function() {
                                question.type = constants.questionTypes.informationContent;
                            });

                            it('should set activeViewModel to \'viewmodels/questions/informationContent\'', function () {
                                viewModel.activeViewModel = null;
                                
                                var promise = viewModel.activate(objective.id, question.id);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.activeViewModel).toBe('viewmodels/questions/informationContent');
                                });
                            });

                        });

                        describe('and when question type is another', function () {

                            beforeEach(function () {
                                question.type = constants.questionTypes.multipleSelect;
                            });

                            it('should set activeViewModel to \'viewmodels/questions/questionContent\'', function () {
                                viewModel.activeViewModel = null;

                                var promise = viewModel.activate(objective.id, question.id);

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.activeViewModel).toBe('viewmodels/questions/questionContent');
                                });
                            });

                        });

                    });

                });

            });

        });

        describe('deactivate:', function () {

            beforeEach(function () {
                viewModel.question = {
                    learningContentExperienced: function () { },
                    learningContents: [
                        { id: '1' },
                        { id: '2' }
                    ]
                };
                spyOn(viewModel.question, 'learningContentExperienced');
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should call question learningContentExperienced', function () {
                viewModel.deactivate();
                expect(viewModel.question.learningContentExperienced).toHaveBeenCalled();
            });

        });

    });

});