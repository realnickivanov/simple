define(['models/questions/fillInTheBlankQuestion'], function (FillInTheBlankQuestion) {
    "use strict";

    describe('model [fillInTheBlankQuestion]', function () {

        var
            eventManager = require('eventManager'),
            questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder'),
            AnswerGroup = require('models/answers/answerGroup'),
            Answer = require('models/answers/answer'),
            constants = require('constants');

        it('should be defined', function() {
            expect(FillInTheBlankQuestion).toBeDefined();
        });

        var spec = {
            answerGroups: [{
                id: "blankId_0",
                answers: [{
                    id: '0',
                    text: 'answer_0',
                    isCorrect: true
                }]
            },{
                id: "blankId_2",
                answers: [{
                    id: '0',
                        text: 'answer_0',
                    isCorrect: true
                }]
            },{
                id: "blankId_1",
                answers: [{
                    id: '1',
                    text: 'answer_1',
                    isCorrect: false
                },
                {
                    id: '2',
                    text: 'answer_2',
                    isCorrect: true
                }]
            }]
        };

        var question;
        beforeEach(function() {
            question = new FillInTheBlankQuestion(spec);
        });

        describe('submitAnswer:', function () {

            it('should be function', function() {
                expect(question.submitAnswer).toBeFunction();
            });

            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'answersSubmitted');
                spyOn(questionEventDataBuilder, 'buildFillInQuestionSubmittedEventData').andReturn(eventData);
            });

            var inputValues;

            describe('when input argument is not array', function() {

                beforeEach(function() {
                    inputValues = null;
                });

                it('should throw \'Input values is not array.\' exception', function() {
                    var f = function () { question.submitAnswer(inputValues); };
                    expect(f).toThrow('Input values is not array.');
                });

            });

            describe('when input argument is array', function() {

                beforeEach(function() {
                    inputValues = [];
                });

                it('should set answerGroupsValues', function() {
                    question.answerGroupsValues = null;
                    question.submitAnswer(inputValues);
                    expect(question.answerGroupsValues).toBe(inputValues);
                });

                it('should set isAnswered to true', function () {
                    question.isAnswered = false;
                    question.submitAnswer(inputValues);
                    expect(question.isAnswered).toBeTruthy();
                });

                describe('when all texts entered correct', function() {

                    beforeEach(function() {
                        inputValues = [
                        {
                            id: 'blankId_0',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_2',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_1',
                            value: 'answer_2'
                        }
                        ];
                    });

                    it('should set score to 100', function () {
                        question.score(0);
                        question.submitAnswer(inputValues);
                        expect(question.score()).toBe(100);
                    });

                    it('should set isCorrectAnswered to true', function () {
                        question.isCorrectAnswered = false;
                        question.submitAnswer(inputValues);
                        expect(question.isCorrectAnswered).toBeTruthy();
                    });

                });

                describe('when texts entered partially correct', function () {

                    beforeEach(function () {
                        inputValues = [
                        {
                            id: 'blankId_0',
                            type: 'input',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_2',
                            type: 'input',
                            value: 'incorrect'
                        },
                        {
                            id: 'blankId_1',
                            type: 'dropdown',
                            value: '2'
                        }
                        ];
                    });

                    it('should set score to 0', function () {
                        question.score(100);
                        question.submitAnswer(inputValues);
                        expect(question.score()).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(inputValues);
                        expect(question.isCorrectAnswered).toBeFalsy();
                    });

                });

                describe('when all texts entered incorrect', function () {

                    beforeEach(function () {
                        inputValues = [
                        {
                            id: 'blankId_0',
                            type: 'input',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_2',
                            type: 'input',
                            value: 'incorrect'
                        },
                        {
                            id: 'blankId_1',
                            type: 'dropdown',
                            value: '2'
                        }
                        ];
                    });

                    it('should set score to 0', function () {
                        question.score(100);
                        question.submitAnswer(inputValues);
                        expect(question.score()).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(inputValues);
                        expect(question.isCorrectAnswered).toBeFalsy();
                    });

                });

                it('should save answered texts', function() {
                    question.answerGroups[0].answeredText = '';
                    question.answerGroups[1].answeredText = '';
                    question.answerGroups[2].answeredText = '';

                    inputValues = [
                        {
                            id: 'blankId_0',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_2',
                            value: 'answer_0'
                        },
                        {
                            id: 'blankId_1',
                            value: 'answer_2'
                        }
                    ];

                    question.submitAnswer(inputValues);

                    expect(question.answerGroups[0].answeredText).toBe(inputValues[0].value);
                    expect(question.answerGroups[1].answeredText).toBe(inputValues[1].value);
                    expect(question.answerGroups[2].answeredText).toBe(inputValues[2].value);
                });

                it('should call event data builder buildFillInQuestionSubmittedEventData', function () {
                    question.submitAnswer(inputValues);
                    expect(questionEventDataBuilder.buildFillInQuestionSubmittedEventData).toHaveBeenCalled();
                });

                it('should call event manager answersSubmitted', function () {
                    question.submitAnswer(inputValues);
                    expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                });

            });

        });

        describe('answerGroupsValues:', function () {

            it('should be defined', function() {
                expect(question.answerGroupsValues).toBeDefined();
            });

            it('should be null by default', function() {
                expect(question.answerGroupsValues).toBeNull();
            });

        });

        describe('answerGroups:', function() {

            it('should be defined', function() {
                expect(question.answerGroups).toBeDefined();
            });

            it('should map spec answers', function () {
                expect(question.answerGroups.length).toBe(spec.answerGroups.length);
            });

            describe('when answerGroups mapped', function () {

                it('should be instance of answers/answerGroup', function () {
                    expect(question.answerGroups[0] instanceof AnswerGroup).toBeTruthy();
                });

                it('id:', function() {
                    expect(question.answerGroups[0].id).toBe(spec.answerGroups[0].id);
                    expect(question.answerGroups[1].id).toBe(spec.answerGroups[1].id);
                    expect(question.answerGroups[2].id).toBe(spec.answerGroups[2].id);
                });

                it('type:', function () {
                    expect(question.answerGroups[0].type).toBe(spec.answerGroups[0].type);
                    expect(question.answerGroups[1].type).toBe(spec.answerGroups[1].type);
                    expect(question.answerGroups[2].type).toBe(spec.answerGroups[2].type);
                });

                it('answers:', function () {
                    expect(question.answerGroups[0].answers[0].id).toBe(spec.answerGroups[0].answers[0].id);
                    expect(question.answerGroups[1].answers[0].id).toBe(spec.answerGroups[1].answers[0].id);
                    expect(question.answerGroups[2].answers[0].id).toBe(spec.answerGroups[2].answers[0].id);
                });

            });

        });

    });

});