define(['viewmodels/questions/dragAndDrop/dragAndDrop', 'viewmodels/questions/dragAndDrop/dropspot'], function (viewModel, Dropspot) {
    "use strict";

    describe('viewModel [dragAndDrop]', function () {

        var
            question = {
                id: '1',
                content: 'Some question content',
                isAnswered: true,
                answers: [
                   {
                       id: 'id',
                       text: 'title',
                       isCorrect: false,
                       correctPosition: { x: 20, y: 30 },

                       currentPosition: { x: -1, y: -1 }
                   }
                ],
                submitAnswer: function () { }
            };



        beforeEach(function () {
            viewModel.stockDropspot = new Dropspot({
                position: { x: -1, y: -1 },
                limit: 0,
                items: ko.observableArray([{ id: '0' }])
            });
            viewModel.dropspots = ko.observableArray(_.map(question.answers, function (answer) {
                return new Dropspot({
                    position: answer.correctPosition,
                    limit: 1,
                    items: ko.observableArray([{ id: '1' }])
                });
            }));
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('question:', function () {

            it('should be defined', function () {
                expect(viewModel.question).toBeDefined();
            });

        });

        describe('content:', function () {

            it('should be observable', function () {
                expect(viewModel.content).toBeObservable();
            });

        });

        describe('isAnswered:', function () {

            it('should be observable', function () {
                expect(viewModel.isAnswered).toBeObservable();
            });

        });

        describe('stockDropspot:', function () {

            it('should be defined', function () {
                expect(viewModel.stockDropspot).toBeDefined();
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
                    expect(viewModel.question.submitAnswer).toHaveBeenCalled();
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

            it('should remove items from dropspots', function () {

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.dropspots()[0].items().length).toBe(0);
                });
            });

            it('should move items to stockDropspot', function () {

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.stockDropspot.items().length).toBe(2);
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
                viewModel.content(null);
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.content()).toBe(question.content);
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

            it('should map dropspots', function () {
                viewModel.dropspots([]);

                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.dropspots()[0].limit).toBe(1);
                    expect(viewModel.dropspots()[0].position.x).toBe(question.answers[0].correctPosition.x);
                    expect(viewModel.dropspots()[0].position.y).toBe(question.answers[0].correctPosition.y);
                });
            });

            it('should map answers', function () {
                viewModel.dropspots([]);

                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.dropspots()[0].items().length).toBe(0);

                    expect(viewModel.stockDropspot.items().length).toBe(1);
                });
            });

        });

    });
});