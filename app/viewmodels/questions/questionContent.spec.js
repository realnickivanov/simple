define(['viewmodels/questions/questionContent', 'viewmodels/questions/multipleSelect/multipleSelect', 'viewmodels/questions/singleSelectText/singleSelectText', 'viewmodels/questions/fillInTheBlank/fillInTheBlank', 'viewmodels/questions/dragAndDrop/dragAndDrop'],
    function (viewModel, multipleSelectQuestionViewModel, singleSelectTextQuestionViewModel, fillInTheBlankQuestionViewModel, dragAndDropQuestionViewModel) {
    "use strict";

    var
        constants = require('constants'),
        navigationModule = require('modules/questionsNavigation'),
        router = require('plugins/router');

    describe('viewModel [questionContent]', function () {

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

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objectiveId:', function () {

            it('should be defined', function () {
                expect(viewModel.objectiveId).toBeDefined();
            });

        });

        describe('question:', function () {

            it('should be defined', function () {
                expect(viewModel.question).toBeDefined();
            });

        });

        describe('title:', function () {

            it('should be defined', function () {
                expect(viewModel.title).toBeDefined();
            });

        });

        describe('isAnswered:', function () {

            it('should be observable', function () {
                expect(viewModel.isAnswered).toBeObservable();
            });

            it('should be false by default', function () {
                expect(viewModel.isAnswered()).toBeFalsy();
            });

        });

        describe('isCorrect:', function () {

            it('should be observable', function () {
                expect(viewModel.isCorrect).toBeObservable();
            });

            it('should be false by default', function () {
                expect(viewModel.isCorrect()).toBeFalsy();
            });

        });

        describe('isExpanded:', function () {

            it('should be observable', function () {
                expect(viewModel.isExpanded).toBeObservable();
            });

            it('should be true by default', function () {
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('learningContents:', function () {

            it('should be defined', function () {
                expect(viewModel.learningContents).toBeDefined();
            });

        });

        describe('correctFeedback:', function () {

            it('should be observable', function () {
                expect(viewModel.correctFeedback).toBeObservable();
            });

        });

        describe('incorrectFeedback:', function () {

            it('should be observable', function () {
                expect(viewModel.incorrectFeedback).toBeObservable();
            });

        });

        describe('navigationContext:', function () {

            it('should be defined', function () {
                expect(viewModel.navigationContext).toBeDefined();
            });

        });

        describe('navigateNext:', function () {

            it('should be function', function() {
                expect(viewModel.navigateNext).toBeFunction();
            });

            beforeEach(function () {
                spyOn(router, 'navigate');
            });

            describe('when viewModel.navigationContext.nextQuestionUrl is defined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: '123' };
                });

                it('should navigate to viewModel.navigationContext.nextQuestionUrl value', function () {
                    viewModel.navigateNext();
                    expect(router.navigate).toHaveBeenCalledWith(viewModel.navigationContext.nextQuestionUrl);
                });

            });

            describe('when viewModel.navigationContext.nextQuestionUrl is undefined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: undefined };
                });

                it('should navigate to \'objectives\'', function () {
                    viewModel.navigateNext();
                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

            });

        });

        describe('navigateNextText:', function () {

            it('should be function', function() {
                expect(viewModel.navigateNextText).toBeFunction();
            });

            describe('when viewModel.navigationContext.nextQuestionUrl is defined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: '123' };
                });

                it('should return \'Next\'', function () {
                    expect(viewModel.navigateNextText()).toBe('Next');
                });

            });

            describe('when viewModel.navigationContext.nextQuestionUrl is undefined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: undefined };
                });

                it('should return \'Home\'', function () {
                    expect(viewModel.navigateNextText()).toBe('Home');
                });

            });

        });

        describe('activeQuestionViewModel:', function () {

            it('should be defined', function () {
                expect(viewModel.activeQuestionViewModel).toBeDefined();
            });

        });

        describe('toggleExpand:', function () {

            it('should be function', function () {
                expect(viewModel.toggleExpand).toBeFunction();
            });

            it('should change isExpanded', function () {
                viewModel.isExpanded(false);
                viewModel.toggleExpand();
                expect(viewModel.isExpanded()).toBeTruthy();
            });

        });

        describe('submit:', function () {

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            var activeQuestionViewModelSubmit;
            beforeEach(function () {
                viewModel.activeQuestionViewModel = {
                    submit: function () { }
                };
                activeQuestionViewModelSubmit = Q.defer();
                spyOn(viewModel.activeQuestionViewModel, 'submit').andReturn(activeQuestionViewModelSubmit.promise);
            });

            it('should call activeQuestionViewModel.submit', function () {
                viewModel.submit();
                expect(viewModel.activeQuestionViewModel.submit).toHaveBeenCalled();
            });

            describe('and when activeQuestionViewModel.submit was resolved', function () {

                beforeEach(function () {
                    activeQuestionViewModelSubmit.resolve();
                });

                it('should set isAnswered from question', function () {
                    viewModel.question = { isAnswered: true };
                    viewModel.isAnswered(false);

                    var promise = viewModel.submit();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isAnswered()).toBeTruthy();
                    });
                });

                it('should set isCorrect from question', function () {
                    viewModel.question = { isCorrectAnswered: true };
                    viewModel.isCorrect(false);

                    var promise = viewModel.submit();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isCorrect()).toBeTruthy();
                    });
                });

            });

        });

        describe('tryAnswerAgain:', function () {

            it('should be function', function () {
                expect(viewModel.tryAnswerAgain).toBeFunction();
            });

            var activeQuestionViewModelTryAnswerAgain;
            beforeEach(function () {
                viewModel.activeQuestionViewModel = {
                    tryAnswerAgain: function () { }
                };
                activeQuestionViewModelTryAnswerAgain = Q.defer();
                spyOn(viewModel.activeQuestionViewModel, 'tryAnswerAgain').andReturn(activeQuestionViewModelTryAnswerAgain.promise);
            });

            it('should call activeQuestionViewModel.tryAnswerAgain', function () {
                viewModel.tryAnswerAgain();
                expect(viewModel.activeQuestionViewModel.tryAnswerAgain).toHaveBeenCalled();
            });

            describe('and when activeQuestionViewModel.tryAnswerAgain was resolved', function () {

                beforeEach(function () {
                    activeQuestionViewModelTryAnswerAgain.resolve();
                });

                it('should set isAnswered to false', function () {
                    viewModel.isAnswered(true);

                    var promise = viewModel.tryAnswerAgain();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isAnswered()).toBeFalsy();
                    });
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            var navigationContext = {
                previousQuestionUrl: 'previousQuestionUrl',
                nextQuestionUrl: 'nextQuestionUrl',
                questionsCount: 10,
                currentQuestionIndex: 1
            };
            beforeEach(function () {
                spyOn(navigationModule, 'getNavigationContext').andReturn(navigationContext);
            });

            it('should return promise', function () {
                expect(viewModel.activate(objective.id, question)).toBePromise();
            });

            it('should get navigation context from navigation module for correct objective and question', function () {
                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(navigationModule.getNavigationContext).toHaveBeenCalledWith(objective.id, question.id);
                });
            });

            it('should set navigationContext to value returned from navigation module', function () {
                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.navigationContext).toBe(navigationContext);
                });
            });

            it('should set title', function () {
                viewModel.title = null;

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.title).toBe(question.title);
                });
            });

            it('should set isAnswered', function () {
                viewModel.isAnswered(null);

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isAnswered()).toBe(question.isAnswered);
                });
            });

            it('should set isCorrect', function () {
                viewModel.isCorrect(null);

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isCorrect()).toBe(question.isCorrectAnswered);
                });
            });

            it('should set learning contents', function () {
                question.learningContents = [{ content: 'c1' }, { content: 'c2' }];
                viewModel.learningContents = [];

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.learningContents.length).toBe(2);
                    expect(viewModel.learningContents[0].content).toBe(question.learningContents[0].content);
                    expect(viewModel.learningContents[1].content).toBe(question.learningContents[1].content);
                });
            });

            it('should set correctFeedback', function () {
                question.feedback.correct = 'correct feedback text';
                viewModel.correctFeedback(null);

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.correctFeedback()).toBe(question.feedback.correct);
                });
            });

            it('should set incorrectFeedback', function () {
                question.feedback.incorrect = 'incorrect feedback text';
                viewModel.incorrectFeedback(null);

                var promise = viewModel.activate(objective.id, question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.incorrectFeedback()).toBe(question.feedback.incorrect);
                });
            });

            describe('and when question.type = ' + constants.questionTypes.multipleSelect, function () {

                beforeEach(function () {
                    question.type = constants.questionTypes.multipleSelect;
                });

                it('should set activeQuestionViewModel to multipleSelectQuestionViewModel', function () {
                    viewModel.activeQuestionViewModel = null;

                    var promise = viewModel.activate(objective.id, question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeQuestionViewModel.__moduleId__).toBe(multipleSelectQuestionViewModel.__moduleId__);
                    });
                });

            });

            describe('and when question.type = ' + constants.questionTypes.singleSelectText, function () {

                beforeEach(function () {
                    question.type = constants.questionTypes.singleSelectText;
                });

                it('should set activeQuestionViewModel to multipleSelectQuestionViewModel', function () {
                    viewModel.activeQuestionViewModel = null;

                    var promise = viewModel.activate(objective.id, question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeQuestionViewModel.__moduleId__).toBe(singleSelectTextQuestionViewModel.__moduleId__);
                    });
                });

            });

            describe('and when question.type = ' + constants.questionTypes.fillInTheBlank, function () {

                beforeEach(function () {
                    question.type = constants.questionTypes.fillInTheBlank;
                });

                it('should set activeQuestionViewModel to fillInTheBlankQuestionViewModel', function () {
                    viewModel.activeQuestionViewModel = null;

                    var promise = viewModel.activate(objective.id, question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeQuestionViewModel.__moduleId__).toBe(fillInTheBlankQuestionViewModel.__moduleId__);
                    });
                });

            });

            describe('and when question.type = ' + constants.questionTypes.dragAndDrop, function () {

                beforeEach(function () {
                    question.type = constants.questionTypes.dragAndDrop;
                });

                it('should set activeQuestionViewModel to dragAndDropQuestionViewModel', function () {
                    viewModel.activeQuestionViewModel = null;

                    var promise = viewModel.activate(objective.id, question);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.activeQuestionViewModel.__moduleId__).toBe(dragAndDropQuestionViewModel.__moduleId__);
                    });
                });

            });

            it('should call activeQuestionViewModel.initialize', function () {
                spyOn(viewModel.activeQuestionViewModel, 'initialize');

                viewModel.activate(objective.id, question);

                expect(viewModel.activeQuestionViewModel.initialize).toHaveBeenCalledWith(question);
            });

        });

    });
});