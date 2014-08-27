define(['viewmodels/questions/singleSelectText/singleSelectText'], function (viewModel) {
    "use strict";

    describe('viewModel [singleSelectText]', function () {

        var
            question = {
                id: '1',
                title: 'Some question 1',
                isAnswered: true,
                isCorrectAnswered: false,
                answers: [
                    { id: '1', isCorrect: false, text: 'Some answer option 1', isChecked: false },
                    { id: '2', isCorrect: true, text: 'Some answer option 2', isChecked: true }
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

        describe('answers:', function () {

            it('should be defined', function () {
                expect(viewModel.answers).toBeDefined();
            });

        });

        describe('checkItem:', function () {

            it('shouldBeFunction', function () {
                expect(viewModel.checkItem).toBeFunction();
            });

            describe('when question is answered', function () {

                beforeEach(function () {
                    viewModel.isAnswered(true);
                });

                it('should not check item', function () {
                    var item = { isChecked: ko.observable(false) };

                    viewModel.checkItem(item);

                    expect(item.isChecked()).toBeFalsy();
                });

            });

            describe('when question is not answered', function () {

                beforeEach(function () {
                    viewModel.isAnswered(false);
                });

                it('should check item and uncheck all another items', function () {
                    viewModel.answers = _.map(question.answers, function (answer) {
                        return { isChecked: ko.observable(answer.isChecked) };
                    });
                    viewModel.answers[1].isChecked(true);

                    viewModel.checkItem(viewModel.answers[0]);

                    expect(viewModel.answers[0].isChecked()).toBeTruthy();
                    expect(viewModel.answers[1].isChecked()).toBeFalsy();
                });

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
                viewModel.answers = [
                    { id: '1', isChecked: ko.observable(false) },
                    { id: '2', isChecked: ko.observable(true) }
                ];

                spyOn(viewModel.question, 'submitAnswer');

                var promise = viewModel.submit();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.question.submitAnswer).toHaveBeenCalledWith([viewModel.answers[1].id]);
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

            it('should reset answers', function () {
                viewModel.answers = [
                    { isChecked: ko.observable(false) },
                    { isChecked: ko.observable(true) }
                ];

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.answers[0].isChecked()).toBeFalsy();
                    expect(viewModel.answers[1].isChecked()).toBeFalsy();
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

            it('should map answers', function () {
                viewModel.answers = [];

                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.answers[0].id).toBe(question.answers[0].id);
                    expect(viewModel.answers[1].id).toBe(question.answers[1].id);
                    expect(viewModel.answers[0].text).toBe(question.answers[0].text);
                    expect(viewModel.answers[1].text).toBe(question.answers[1].text);
                    expect(viewModel.answers[0].isChecked()).toBe(question.answers[0].isChecked);
                    expect(viewModel.answers[1].isChecked()).toBe(question.answers[1].isChecked);
                });
            });

        });

    });

});