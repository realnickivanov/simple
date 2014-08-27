define(['models/questions/textMatchingQuestion'], function (TextMatchingQuestion) {
    "use strict";

    var
        eventManager = require('eventManager'),
        questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder')
    ;

    describe('model [textMatchingQuestion]', function () {

        it('should be function', function () {
            expect(TextMatchingQuestion).toBeFunction();
        });



        describe('submitAnswer:', function () {

            var
                question,
                answers = [{ id: 'id1', key: 'key1', value: 'value1' }, { id: 'id2', key: 'key2', value: 'value2' }],

                eventData = {}
            ;

            beforeEach(function () {
                question = new TextMatchingQuestion({
                    answers: answers
                });

                spyOn(eventManager, 'answersSubmitted');
                spyOn(questionEventDataBuilder, 'buildTextMatchingQuestionSubmittedEventData').andReturn(eventData);
            });

            it('should be function', function () {
                expect(question.submitAnswer).toBeFunction();
            });

            it('should set isAnswered to true', function () {
                question.isAnswered = false;
                question.submitAnswer();
                expect(question.isAnswered).toBeTruthy();
            });

            describe('when answer is not an array', function () {

                it('should set score to 0', function () {
                    question.score(100);
                    question.submitAnswer();
                    expect(question.score()).toBe(0);
                });

                it('should set isCorrectAnswered to false', function () {
                    question.isCorrectAnswered = true;
                    question.submitAnswer();
                    expect(question.isCorrectAnswered).toBeFalsy();
                });

                it('should set attemptedValue for each key', function () {
                    question.answers[0].attemptedValue = 'value1';
                    question.answers[1].attemptedValue = 'value2';
                    question.submitAnswer();
                    expect(question.answers[0].attemptedValue).toEqual(null);
                    expect(question.answers[1].attemptedValue).toEqual(null);
                });

            });

            describe('when answer is an array', function () {

                describe('and all values match keys', function () {

                    var
                        correctAnswer = [{ id: 'id1', value: 'value1' }, { id: 'id2', value: 'value2' }]
                    ;

                    it('should set score to 100', function () {
                        question.score(0);
                        question.submitAnswer(correctAnswer);
                        expect(question.score()).toBe(100);
                    });

                    it('should set isCorrectAnswered to true', function () {
                        question.isCorrectAnswered = false;
                        question.submitAnswer(correctAnswer);
                        expect(question.isCorrectAnswered).toBeTruthy();
                    });

                    it('should set attemptedValue for each key', function () {
                        question.submitAnswer(correctAnswer);
                        expect(question.answers[0].attemptedValue).toEqual(correctAnswer[0].value);
                        expect(question.answers[1].attemptedValue).toEqual(correctAnswer[1].value);
                    });

                });

                describe('and at least one value does not match the key', function () {

                    var
                        incorrectAnswer = [{ id: 'id1', value: 'value1' }]
                    ;

                    it('should set score to 0', function () {
                        question.score(100);
                        question.submitAnswer(incorrectAnswer);
                        expect(question.score()).toEqual(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(incorrectAnswer);
                        expect(question.isCorrectAnswered).toBeFalsy();
                    });

                    it('should set attemptedValue for each key', function () {
                        question.submitAnswer(incorrectAnswer);
                        expect(question.answers[0].attemptedValue).toEqual(incorrectAnswer[0].value);
                        expect(question.answers[1].attemptedValue).toEqual(null);
                    });
                });

            });

            it('should call event data builder buildTextMatchingQuestionSubmittedEventData', function () {
                question.submitAnswer();
                expect(questionEventDataBuilder.buildTextMatchingQuestionSubmittedEventData).toHaveBeenCalled();
            });

            it('should call event manager answersSubmitted', function () {
                question.submitAnswer();
                expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
            });

        });


        describe('answers:', function () {

            var
                question,
                answers = [{ id: 'id1', key: 'key1', value: 'value1' }, { id: 'id2', key: 'key2', value: 'value2' }]
            ;

            beforeEach(function () {
                question = new TextMatchingQuestion({
                    answers: answers
                });
            });

            it('should be defined', function () {
                expect(question.answers).toBeDefined();
            });

            it('should map answers', function () {
                expect(question.answers.length).toBe(answers.length);
            });

            describe('when answers are mapped', function () {

                it('id:', function () {
                    expect(question.answers[0].id).toBe(answers[0].id);
                    expect(question.answers[1].id).toBe(answers[1].id);
                });


                it('key:', function () {
                    expect(question.answers[0].key).toBe(answers[0].key);
                    expect(question.answers[1].key).toBe(answers[1].key);
                });

                it('value:', function () {
                    expect(question.answers[0].value).toBe(answers[0].value);
                    expect(question.answers[1].value).toBe(answers[1].value);
                });

                it('attemptedValue:', function () {
                    expect(question.answers[0].attemptedValue).toBeNull();
                    expect(question.answers[1].attemptedValue).toBeNull();
                });
            });
        });

    });

});