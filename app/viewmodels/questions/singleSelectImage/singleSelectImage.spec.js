define(['viewmodels/questions/singleSelectImage/singleSelectImage'], function (viewModel) {
    "use strict";

    var imagePreview = require('widgets/imagePreview/viewmodel');

    describe('viewModel [singleSelectImage]', function () {

        var
            question = {
                id: '1',
                title: 'Some question 1',
                isAnswered: true,
                isCorrectAnswered: false,
                answers: [
                    { id: '1', image: 'image.png' },
                    { id: '2', image: 'image.png' }
                ],
                submitAnswer: function () { },
                checkedAnswerId: ko.observable()
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

        describe('checkedAnswerId:', function () {
            it('should be defined', function () {
                expect(viewModel.checkedAnswerId).toBeDefined();
            });


            it('should be observable', function () {
                expect(viewModel.checkedAnswerId).toBeObservable();
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

                it('should check item', function () {
                    viewModel.question = question;
                    viewModel.answers = _.map(question.answers, function (answer) {
                        return { isChecked: ko.observable(answer.isChecked) };
                    });
                    viewModel.checkItem(viewModel.answers[0]);

                    expect(viewModel.question.checkedAnswerId()).toBe(viewModel.answers[0].id);
                });

            });

        });

        describe('previewItem:', function () {

            beforeEach(function () {
                spyOn(imagePreview, 'openPreviewImage');
                viewModel.previewItem(question.answers[1]);
            });

            it('should be a function', function () {
                expect(viewModel.previewItem).toBeFunction();
            });

            it('should call imagePreview.openPreviewImage', function () {
                expect(imagePreview.openPreviewImage).toHaveBeenCalledWith(question.answers[1].image);
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
                    { id: '1'},
                    { id: '2'}
                ];
                viewModel.checkedAnswerId(viewModel.answers[1].id);

                spyOn(viewModel.question, 'submitAnswer');

                var promise = viewModel.submit();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.question.submitAnswer).toHaveBeenCalledWith(viewModel.answers[1].id);
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
                viewModel.checkedAnswerId('2');

                var promise = viewModel.tryAnswerAgain();

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.checkedAnswerId()).toBeNull();
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

            it('should set checkedAnswerId', function () {
                viewModel.checkedAnswerId(null);
                var promise = viewModel.initialize(question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.checkedAnswerId()).toBe(question.checkedAnswerId);
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
                    expect(viewModel.answers[0].image).toBe(question.answers[0].image);
                    expect(viewModel.answers[1].image).toBe(question.answers[1].image);
                    expect(viewModel.answers[0].isChecked()).toBe(question.answers[0].isChecked);
                    expect(viewModel.answers[1].isChecked()).toBe(question.answers[1].isChecked);
                });
            });

        });

    });

});