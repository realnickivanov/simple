define(['viewmodels/questions/fillInTheBlank/fillInTheBlank'], function (viewModel) {
    "use strict";

    describe('viewModel [fillInTheBlank]', function () {

        var
            question = {
                id: '1',
                content: 'Some question content',
                isAnswered: true,
                answerGroups: [
                    {
                        id: 'answerGroupId1',
                        type: 'input',
                        answeredText: 'answered text 1',
                        answers: [
                            { id: '1' }
                        ]
                    },
                    {
                        id: 'answerGroupId2',
                        type: 'dropdown',
                        answeredText: '2',
                        answers: [
                            { id: '3' },
                            { id: '2' }
                        ]
                    }
                ],
                submitAnswer: function () { }
            };

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('question:', function () {

            it('should be defined', function () {
                expect(viewModel.question).toBeDefined();
            });

        });

        describe('content:', function () {

            it('should be defined', function () {
                expect(viewModel.content).toBeDefined();
            });

        });

        describe('isAnswered:', function () {

            it('should be observable', function () {
                expect(viewModel.isAnswered).toBeObservable();
            });

        });

        describe('inputValues:', function () {

            it('should be observable', function () {
                expect(viewModel.inputValues).toBeObservable();
            });

        });

        describe('submit:', function () {

            it('should be a function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.submit()).toBePromise();
            });

            it('should call question submit answer', function () {
                viewModel.question = question;
                spyOn(viewModel.question, 'submitAnswer');
                var promise = viewModel.submit();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.question.submitAnswer).toHaveBeenCalledWith(viewModel.inputValues());
                });
            });

            it('should set isAnswered to true', function () {
                viewModel.isAnswered(false);

                var promise = viewModel.submit();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isAnswered()).toBeTruthy();
                });
            });

        });

        describe('tryAnswerAgain', function () {

            it('should be a function', function () {
                expect(viewModel.tryAnswerAgain).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.tryAnswerAgain()).toBePromise();
            });

            it('should reset inputValues', function () {
                viewModel.inputValues([
                    { value: 'some answer text' }
                ]);

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.inputValues()[0].value).toBe('');
                });
            });

            it('should set question isAnswered to false', function () {
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

        describe('initialize:', function () {

            it('should be function', function () {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.initialize()).toBePromise();
            });

            it('should set question', function () {
                viewModel.question = null;
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.question).toBe(question);
                });
            });

            it('should set content', function () {
                viewModel.content = null;
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.content).toBe(question.content);
                });
            });

            it('should set isAnswered', function () {
                viewModel.isAnswered(false);
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isAnswered()).toBe(question.isAnswered);
                });
            });

            it('should map inputValues', function () {
                viewModel.inputValues([]);

                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.inputValues()[0].id).toBe(question.answerGroups[0].id);
                    expect(viewModel.inputValues()[1].id).toBe(question.answerGroups[1].id);
                    expect(viewModel.inputValues()[0].value).toBe(question.answerGroups[0].answeredText);
                    expect(viewModel.inputValues()[1].value).toBe(question.answerGroups[1].answeredText);
                });
            });

        });

    });
});