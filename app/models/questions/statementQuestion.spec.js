define(['models/questions/statementQuestion'], function(StatementQuestion) {
    "use strict";

    describe('model [StatementQuestion]', function() {

        var StatementAnswer = require('models/answers/statementAnswer'),
            eventManager = require('eventManager'),
            questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder');

        it('should be a function', function() {
            expect(StatementQuestion).toBeFunction();
        });

        describe('statements:', function() {
            var spec = {
                statements: [
                    {
                        id: 'statement1',
                        text: 'statement1 text',
                        isCorrect: true
                    },
                    {
                        id: 'statement2',
                        text: 'statement2 text',
                        isCorrect: false
                    },
                    {
                        id: 'statement3',
                        text: 'statement3 text',
                        isCorrect: true
                    }
                ]
            },

            statementQuestion;

            beforeEach(function() {
                statementQuestion = new StatementQuestion(spec);
            });

            it('should be defined', function() {
                expect(statementQuestion.statements).toBeDefined();
            });

            it('should contains mapped statements', function() {
                expect(statementQuestion.statements.length).toBe(spec.statements.length);
            });

            describe('statement:', function() {

                it('should be instance of StatementAnswer', function() {
                    expect(statementQuestion.statements[0] instanceof StatementAnswer).toBeTruthy();
                });

                describe('id:', function() {
                    it('should be mapped from spec', function() {
                        expect(statementQuestion.statements[0].id).toBe(spec.statements[0].id);
                    });
                });

                describe('text:', function() {
                    it('should be mapped from spec', function() {
                        expect(statementQuestion.statements[0].text).toBe(spec.statements[0].text);
                    });
                });

                describe('isCorrect:', function() {
                    it('should be mapped from spec', function() {
                        expect(statementQuestion.statements[0].isCorrect).toBe(spec.statements[0].isCorrect);
                    });
                });

            });

            describe('submitAnswer', function() {
                var eventData = {};
                beforeEach(function() {
                    spyOn(eventManager, 'answersSubmitted');
                    spyOn(questionEventDataBuilder, 'buildStatementQuestionSubmittedEventData').andReturn(eventData);
                });


                it('should be a function', function() {
                    expect(statementQuestion.submitAnswer).toBeFunction();
                });

                describe('when userAnswers is not an array', function() {

                    it('should throw exception with \'userAnswers is not an array\'', function() {
                        var f = function() {
                            statementQuestion.submitAnswer(null);
                        };
                        expect(f).toThrow('userAnswers is not an array');
                    });

                });

                it('should set isAnswered true', function() {
                    statementQuestion.isAnswered = false;

                    statementQuestion.submitAnswer([]);

                    expect(statementQuestion.isAnswered).toBeTruthy();
                });

                it('should call event data builder buildStatementQuestionSubmittedEventData', function() {
                    statementQuestion.submitAnswer([]);

                    expect(questionEventDataBuilder.buildStatementQuestionSubmittedEventData).toHaveBeenCalledWith(statementQuestion);
                });

                it('should call event manager answersSubmitted', function() {
                    statementQuestion.submitAnswer([]);

                    expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                });

                describe('when student answers are correct', function() {

                    var correctAnswers = [
                        {
                            id: 'statement1',
                            answer: true
                        },
                        {
                            id: 'statement2',
                            answer: false
                        },
                        {
                            id: 'statement3',
                            answer: true
                        }
                    ];

                    it('should set isCorrectAnswered in true', function() {
                        statementQuestion.isCorrectAnswered = null;

                        statementQuestion.submitAnswer(correctAnswers);

                        expect(statementQuestion.isCorrectAnswered).toBeTruthy();
                    });

                    it('should set score 100', function() {
                        statementQuestion.score(null);

                        statementQuestion.submitAnswer(correctAnswers);

                        expect(statementQuestion.score()).toBe(100);
                    });

                    it('should update userAnswers', function() {
                        statementQuestion.statements[0].userAnswer = null;
                        statementQuestion.statements[1].userAnswer = null;
                        statementQuestion.statements[2].userAnswer = null;

                        statementQuestion.submitAnswer(correctAnswers);

                        expect(statementQuestion.statements[0].userAnswer).toBeTruthy();
                        expect(statementQuestion.statements[1].userAnswer).toBeFalsy();
                        expect(statementQuestion.statements[2].userAnswer).toBeTruthy();
                    });
                });

                describe('when student answers are incorrect', function() {

                    var incorrectAnswers = [
                        {
                            id: 'statement1',
                            answer: true
                        },
                        {
                            id: 'statement2',
                            answer: true
                        },
                        {
                            id: 'statement3',
                            answer: true
                        }
                    ];

                    it('should set isCorrectAnswered in true', function() {
                        statementQuestion.isCorrectAnswered = null;

                        statementQuestion.submitAnswer(incorrectAnswers);

                        expect(statementQuestion.isCorrectAnswered).toBeFalsy();
                    });

                    it('should set score 0', function() {
                        statementQuestion.score(null);

                        statementQuestion.submitAnswer(incorrectAnswers);

                        expect(statementQuestion.score()).toBe(0);
                    });

                    it('should update userAnswers', function() {
                        statementQuestion.statements[0].userAnswer = null;
                        statementQuestion.statements[1].userAnswer = null;
                        statementQuestion.statements[2].userAnswer = null;

                        statementQuestion.submitAnswer(incorrectAnswers);

                        expect(statementQuestion.statements[0].userAnswer).toBeTruthy();
                        expect(statementQuestion.statements[1].userAnswer).toBeTruthy();
                        expect(statementQuestion.statements[2].userAnswer).toBeTruthy();
                    });
                });

                describe('when student answers are partially correct', function() {

                    var partiallyCorrectAnswers = [
                        {
                            id: 'statement1',
                            answer: true
                        },
                        {
                            id: 'statement2',
                            answer: false
                        }
                    ];

                    it('should set isCorrectAnswered in true', function() {
                        statementQuestion.isCorrectAnswered = null;

                        statementQuestion.submitAnswer(partiallyCorrectAnswers);

                        expect(statementQuestion.isCorrectAnswered).toBeFalsy();
                    });

                    it('should set score 0', function() {
                        statementQuestion.score(null);

                        statementQuestion.submitAnswer(partiallyCorrectAnswers);

                        expect(statementQuestion.score()).toBe(0);
                    });

                    it('should update userAnswers', function() {
                        statementQuestion.statements[0].userAnswer = null;
                        statementQuestion.statements[1].userAnswer = null;
                        statementQuestion.statements[2].userAnswer = null;

                        statementQuestion.submitAnswer(partiallyCorrectAnswers);

                        expect(statementQuestion.statements[0].userAnswer).toBeTruthy();
                        expect(statementQuestion.statements[1].userAnswer).toBeFalsy();
                        expect(statementQuestion.statements[2].userAnswer).toBeNull();
                    });
                });

            });

        });

    });
});