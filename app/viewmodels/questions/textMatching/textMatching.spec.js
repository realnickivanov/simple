define(['viewmodels/questions/textMatching/textMatching'], function (viewModel) {
    "use strict";

    var
        Target = require('viewmodels/questions/textMatching/textMatchingTarget'),
        Source = require('viewmodels/questions/textMatching/textMatchingSource')
    ;

    describe('viewModel [textMatching]', function () {

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

        describe('submit:', function () {

            beforeEach(function () {
                viewModel.question = {
                    submitAnswer: function () {

                    }
                };
                spyOn(viewModel.question, 'submitAnswer');
            });

            it('should be a function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.submit()).toBePromise();
            });

            it('should submit question answer', function () {
                var
                    target1 = new Target('value1'),
                    source1 = new Source('id1', 'key1'),
                    source2 = new Source('id2', 'key2')
                ;

                source1.value(target1);

                viewModel.sources([source1, source2]);

                var promise = viewModel.submit();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.question.submitAnswer).toHaveBeenCalledWith([{ id: 'id1', value: 'value1' }, { id: 'id2', value: null }]);
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

            it('should reject value for each source', function () {
                var
                    target1 = new Target('value1'),
                    target2 = new Target('value2'),
                    source1 = new Source('id1', 'key1'),
                    source2 = new Source('id2', 'key2')
                ;

                source1.value(target1);
                source2.value(target2);

                viewModel.sources([source1, source2]);

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(source1.value()).toBeNull();
                    expect(source1.value()).toBeNull();
                });
            });

            it('should add rejected values to targets', function () {
                var
                    target1 = new Target('value1'),
                    target2 = new Target('value2'),
                    source1 = new Source('id1', 'key1'),
                    source2 = new Source('id2', 'key2')
                ;

                source1.value(target1);
                source2.value(target2);

                viewModel.sources([source1, source2]);
                viewModel.targets([]);

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.targets().length).toEqual(2);
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
                var question = {};

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
                var question = { content: '' };

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
                var question = { isAnswered: true };

                viewModel.isAnswered(false);
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.isAnswered()).toBe(question.isAnswered);
                });
            });

            it('should set sources and targets', function () {
                var question = { answers: [{ id: 'id1', key: 'key1', value: 'value1', attemptedValue: null }, { id: 'id2', key: 'key2', value: 'value2', attemptedValue: 'value1' }] };

                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.sources().length).toBe(2);
                    expect(viewModel.sources()[0]).toEqual(jasmine.any(Source));
                    expect(viewModel.sources()[0].value()).toBeNull();
                    expect(viewModel.sources()[1]).toEqual(jasmine.any(Source));
                    expect(viewModel.sources()[1].value()).toEqual(jasmine.any(Target));

                    expect(viewModel.targets().length).toBe(1);
                    expect(viewModel.targets()[0]).toEqual(jasmine.any(Target));
                    expect(viewModel.targets()[0].value).toEqual('value2');
                });
            });

            it('should randomize sources and targets', function () {
                var question = { answers: [] };

                spyOn(_, 'shuffle');
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(_.shuffle).toHaveBeenCalled();
                    expect(_.shuffle.callCount).toEqual(2);
                });
            });

        });

    });
})