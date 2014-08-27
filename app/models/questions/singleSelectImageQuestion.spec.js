define(['models/questions/singleSelectImageQuestion'], function (SingleSelectImageQuestion) {
    "use strict";

    describe('model [SingleSelectImageQuestion]', function () {

        var
            eventManager = require('eventManager'),
            constants = require('constants'),
            questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder'),
	        CheckableImageAnswer = require('models/answers/checkableImageAnswer');

        it('should be defined', function () {
            expect(SingleSelectImageQuestion).toBeDefined();
        });

        var spec = {
            correctAnswerId: '2',
            answers: [
                {
                    id: '0',
                    image: null
                },
                {
                    id: '1',
                    image: 'image_0.png'
                },
                {
                    id: '2',
                    image: 'image_0.png'
                }
            ]
        };

        var question;
        beforeEach(function () {
            question = new SingleSelectImageQuestion(spec);
        });

        describe('correctAnswerId:', function () {
            it('should be defined', function () {
                expect(question.correctAnswerId).toBeDefined();
            });

            it('should be equal to spec.correctAnswerId', function () {
                expect(question.correctAnswerId).toBe(spec.correctAnswerId);
            });
        });

        describe('checkedAnswerId:', function () {
            it('should be defined', function () {
                expect(question.checkedAnswerId).toBeDefined();
            });


            it('should be null', function () {
                expect(question.checkedAnswerId).toBeNull();
            });
        });

        describe('submitAnswer:', function () {
            var answerId;
            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'answersSubmitted');
                spyOn(questionEventDataBuilder, 'buildSingleSelectImageQuestionSubmittedEventData').andReturn(eventData);
                answerId = '2';
            });

            it('should be function', function () {
                expect(question.submitAnswer).toBeFunction();
            });

            it('should update checked answer value', function () {
                question.submitAnswer(answerId);
                expect(question.checkedAnswerId).toBe(answerId);
            });

            it('should set isAnswered to true', function () {
                question.isAnswered = false;
                question.submitAnswer(answerId);
                expect(question.isAnswered).toBeTruthy();
            });

            describe('when checked answer is correct', function () {

                beforeEach(function () {
                    answerId = '2';
                });

                it('should set score to 100', function () {
                    question.score(0);
                    question.submitAnswer(answerId);
                    expect(question.score()).toBe(100);
                });

                it('should set isCorrectAnswered to true', function () {
                    question.isCorrectAnswered = false;
                    question.submitAnswer(answerId);
                    expect(question.isCorrectAnswered).toBe(true);
                });

            });

            describe('when checked answer is incorrect', function () {

                beforeEach(function () {
                    answerId = '0';
                });

                it('should set score to 0', function () {
                    question.score(0);
                    question.submitAnswer(answerId);
                    expect(question.score()).toBe(0);
                });

                it('should set isCorrectAnswered to false', function () {
                    question.isCorrectAnswered = true;
                    question.submitAnswer(answerId);
                    expect(question.isCorrectAnswered).toBe(false);
                });

            });

            it('should call event data builder buildSingleSelectTextQuestionSubmittedEventData', function () {
                question.submitAnswer(answerId);
                expect(questionEventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData).toHaveBeenCalled();
            });

            it('should call event manager answersSubmitted', function () {
                question.submitAnswer(answerId);
                expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
            });

        });

        describe('answers:', function () {

            it('should be defined', function () {
                expect(question.answers).toBeDefined();
            });

            it('should map spec answers', function () {
                expect(question.answers.length).toBe(spec.answers.length);
            });

            describe('when answers mapped', function () {

                it('should be instance of answers/checkableAnswer', function () {
                    expect(question.answers[0] instanceof CheckableImageAnswer).toBeTruthy();
                });

                it('id:', function () {
                    expect(question.answers[0].id).toBe(spec.answers[0].id);
                    expect(question.answers[1].id).toBe(spec.answers[1].id);
                    expect(question.answers[2].id).toBe(spec.answers[2].id);
                });

                it('isCorrect:', function () {
                    expect(question.answers[0].isCorrect).toBe(spec.answers[0].isCorrect);
                    expect(question.answers[1].isCorrect).toBe(spec.answers[1].isCorrect);
                    expect(question.answers[2].isCorrect).toBe(spec.answers[2].isCorrect);
                });

                describe('image:', function () {

                    describe('when spec image is null', function () {

                        it('should use default image instead', function () {
                            expect(question.answers[0].image).toBe(constants.defaultImageUrl);
                        });

                    });

                    describe('when spec image not null', function () {

                        it('should use spec image ', function () {
                            expect(question.answers[1].image).toBe(spec.answers[1].image);
                            expect(question.answers[2].image).toBe(spec.answers[2].image);
                        });

                    });

                });

                it('isChecked:', function () {
                    expect(question.answers[0].isChecked).toBeFalsy();
                    expect(question.answers[1].isChecked).toBeFalsy();
                    expect(question.answers[2].isChecked).toBeFalsy();
                });

            });

        });

    });

});