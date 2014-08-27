define(['models/questions/MultipleSelectQuestion'], function (MultipleSelectQuestion) {
	"use strict";

	describe('model [MultipleSelectQuestion]', function () {

	    var
            eventManager = require('eventManager'),
            questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder'),
	        CheckableAnswer = require('models/answers/checkableAnswer');

	    it('should be defined', function() {
	        expect(MultipleSelectQuestion).toBeDefined();
	    });

	    var spec = {
	        answers: [
                {
                    id: '0',
                    isCorrect: true,
                    text: 'answer_0'
                },
                {
                    id: '1',
                    isCorrect: false,
                    text: 'answer_1'
                },
                {
                    id: '2',
                    isCorrect: true,
                    text: 'answer_2'
                }
	        ]
	    };

	    var question;
	    beforeEach(function () {
	        question = new MultipleSelectQuestion(spec);
	    });

	    describe('submitAnswer:', function () {

	        var eventData = {};
	        beforeEach(function () {
	            spyOn(eventManager, 'answersSubmitted');
	            spyOn(questionEventDataBuilder, 'buildSingleSelectTextQuestionSubmittedEventData').andReturn(eventData);
	        });

	        it('should be function', function () {
	            expect(question.submitAnswer).toBeFunction();
	        });

	        var answersIds;

	        describe('when checked answers ids is not an array', function () {

	            beforeEach(function() {
	                answersIds = null;
	            });

	            it('should throw exception with \'Checked answer ids is not an array\'', function () {
	                var f = function () {
	                    question.submitAnswer(answersIds);
	                };
	                expect(f).toThrow('Checked answer ids is not an array');
	            });

	        });

	        describe('when checked answers ids is an array', function () {

	            beforeEach(function() {
	                answersIds = ['0', '2'];
	            });

	            it('should update answers checked values', function () {
	                question.submitAnswer(answersIds);
	                expect(question.answers[0].isChecked).toBeTruthy();
	                expect(question.answers[1].isChecked).toBeFalsy();
	                expect(question.answers[2].isChecked).toBeTruthy();
	            });

	            it('should set isAnswered to true', function () {
	                question.isAnswered = false;
	                question.submitAnswer(answersIds);
	                expect(question.isAnswered).toBeTruthy();
	            });

	            describe('when all answers checked correct', function () {

	                beforeEach(function() {
	                    answersIds = ['0', '2'];
	                });
	                
	                it('should set score to 100', function () {
	                    question.score(0);
	                    question.submitAnswer(['0', '2']);
	                    expect(question.score()).toBe(100);
	                });

	                it('should set isCorrectAnswered to true', function () {
	                    question.isCorrectAnswered = false;
	                    question.submitAnswer(answersIds);
	                    expect(question.isCorrectAnswered).toBe(true);
	                });

	            });

	            describe('when answers checked partially correct', function () {

	                beforeEach(function() {
	                    answersIds = ['0', '1'];
	                });
	                
	                it('should set score to 0', function () {
	                    question.score(0);
	                    question.submitAnswer(answersIds);
	                    expect(question.score()).toBe(0);
	                });

	                it('should set isCorrectAnswered to false', function () {
	                    question.isCorrectAnswered = true;
	                    question.submitAnswer(answersIds);
	                    expect(question.isCorrectAnswered).toBe(false);
	                });

	            });

	            describe('when answers checked incorrect', function () {

	                beforeEach(function() {
	                    answersIds = ['1', '3'];
	                });
	                
	                it('should set score to 0', function () {
	                    question.score(0);
	                    question.submitAnswer(answersIds);
	                    expect(question.score()).toBe(0);
	                });

	                it('should set isCorrectAnswered to false', function () {
	                    question.isCorrectAnswered = true;
	                    question.submitAnswer(answersIds);
	                    expect(question.isCorrectAnswered).toBe(false);
	                });

	            });

	            it('should call event data builder buildSingleSelectTextQuestionSubmittedEventData', function () {
	                question.submitAnswer(answersIds);
	                expect(questionEventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData).toHaveBeenCalled();
	            });

	            it('should call event manager answersSubmitted', function () {
	                question.submitAnswer(answersIds);
	                expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
	            });

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
	                expect(question.answers[0] instanceof CheckableAnswer).toBeTruthy();
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

	            it('text:', function () {
	                expect(question.answers[0].text).toBe(spec.answers[0].text);
	                expect(question.answers[1].text).toBe(spec.answers[1].text);
	                expect(question.answers[2].text).toBe(spec.answers[2].text);
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