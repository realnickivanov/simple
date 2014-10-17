define(['viewmodels/questions/statement/statement'], function(viewModel) {
    "use strict";

    describe('viewModel [statement]', function() {

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('question:', function() {
            it('should be defined', function() {
                expect(viewModel.question).toBeDefined();
            });
        });

        describe('content:', function() {
            it('should be defined', function() {
                expect(viewModel.content).toBeDefined();
            });
        });

        describe('statements:', function() {
            it('should be defined', function() {
                expect(viewModel.statements).toBeDefined();
            });
        });

        describe('isAnswered', function() {
            it('should be observable', function() {
                expect(viewModel.isAnswered).toBeObservable();
            });
        });

        describe('initialize:', function() {
            it('should be a function', function() {
                expect(viewModel.initialize).toBeFunction();
            });

            it('should set question', function() {
                var question = { id: 'questionId' };
                viewModel.question = null;

                viewModel.initialize(question);

                expect(viewModel.question).toBe(question);
            });

            it('should set question content', function() {
                var question = { content: 'questionContent' };
                viewModel.content = null;

                viewModel.initialize(question);

                expect(viewModel.content).toBe(question.content);
            });

            it('should set isAnswered', function() {
                var question = { isAnswered: false };
                viewModel.isAnswered(null);

                viewModel.initialize(question);

                expect(viewModel.isAnswered()).toBe(question.isAnswered);
            });

            it('should set statements', function() {
                var question = { statements: [{ id: '1' }, { id: '2' }, { id: '3' }] };
                viewModel.statements = null;

                viewModel.initialize(question);

                expect(viewModel.statements.length).toBe(question.statements.length);
            });

            it('should set id for each statement', function() {
                var question = { statements: [{ id: '1' }, { id: '2' }, { id: '3' }] };
                viewModel.statements = null;

                viewModel.initialize(question);

                expect(viewModel.statements[0].id).toBe(question.statements[0].id);
                expect(viewModel.statements[1].id).toBe(question.statements[1].id);
                expect(viewModel.statements[2].id).toBe(question.statements[2].id);
            });

            it('should set text for each statement', function() {
                var question = { statements: [{ text: '1' }, { text: '2' }, { text: '3' }] };
                viewModel.statements = null;

                viewModel.initialize(question);

                expect(viewModel.statements[0].text).toBe(question.statements[0].text);
                expect(viewModel.statements[1].text).toBe(question.statements[1].text);
                expect(viewModel.statements[2].text).toBe(question.statements[2].text);
            });

            it('should set userAnswer for each statement', function() {
                var question = { statements: [{ userAnswer: true }, { userAnswer: false }, { userAnswer: null }] };
                viewModel.statements = null;

                viewModel.initialize(question);

                expect(viewModel.statements[0].userAnswer()).toBeTruthy();
                expect(viewModel.statements[1].userAnswer()).toBeFalsy();
                expect(viewModel.statements[2].userAnswer()).toBeNull();
            });
        });

        describe('submit:', function() {
            it('should be a function', function() {
                expect(viewModel.submit).toBeFunction();
            });

            it('should return promise', function() {
                var result = viewModel.submit();

                expect(result).toBePromise();
            });

            it('should call question submit answer', function() {
                viewModel.question = { submitAnswer: function() { } };
                spyOn(viewModel.question, 'submitAnswer');

                viewModel.statements = [
                    { id: '1', userAnswer: ko.observable(false) },
                    { id: '2', userAnswer: ko.observable(true) },
                    { id: '3', userAnswer: ko.observable(null) }
                ];

                var promise = viewModel.submit();

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.question.submitAnswer).toHaveBeenCalledWith([{ id: '1', answer: false }, { id: '2', answer: true }]);
                });
            });

            it('should set isAnswered to true', function() {
                viewModel.isAnswered(false);

                var promise = viewModel.submit();

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.isAnswered()).toBeTruthy();
                });
            });
        });

        describe('tryAnswerAgain:', function() {
            it('should be a function', function() {
                expect(viewModel.tryAnswerAgain).toBeFunction();
            });

            it('should return promise', function() {
                var result = viewModel.tryAnswerAgain();

                expect(result).toBePromise();
            });

            it('should set isAnswered to false', function() {
                viewModel.isAnswered(true);

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.isAnswered()).toBeFalsy();
                });
            });

            it('should set reset userAnswers', function() {
                viewModel.statements = [
                    { userAnswer: ko.observable(true) },
                    { userAnswer: ko.observable(false) }
                ];

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.statements[0].userAnswer()).toBeNull();
                    expect(viewModel.statements[1].userAnswer()).toBeNull();
                });
            });
        });

        describe('markStatementAsTrue:', function() {
            it('should be a function', function() {
                expect(viewModel.markStatementAsTrue);
            });

            describe('when question is not answered', function() {
                beforeEach(function() {
                    viewModel.isAnswered(false);
                });

                it('should set student statement answer in true', function() {
                    var statement = { userAnswer: ko.observable(null) };

                    viewModel.markStatementAsTrue(statement);

                    expect(statement.userAnswer()).toBeTruthy();
                });
            });

            describe('when question is answered', function() {
                beforeEach(function() {
                    viewModel.isAnswered(true);
                });

                it('should not change student statement answer', function() {
                    var statement = { userAnswer: ko.observable(null) };

                    viewModel.markStatementAsTrue(statement);

                    expect(statement.userAnswer()).toBeNull();
                });
            });
        });

        describe('markStatementAsFalse:', function() {
            it('should be a function', function() {
                expect(viewModel.markStatementAsFalse);
            });

            describe('when question is not answered', function() {
                beforeEach(function() {
                    viewModel.isAnswered(false);
                });

                it('should set student statement answer in true', function() {
                    var statement = { userAnswer: ko.observable(null) };

                    viewModel.markStatementAsFalse(statement);

                    expect(statement.userAnswer()).toBeFalsy();
                });
            });

            describe('when question is answered', function() {
                beforeEach(function() {
                    viewModel.isAnswered(true);
                });

                it('should not change student statement answer', function() {
                    var statement = { userAnswer: ko.observable(null) };

                    viewModel.markStatementAsFalse(statement);

                    expect(statement.userAnswer()).toBeNull();
                });
            });
        });
    });
});