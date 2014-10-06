define(['eventDataBuilders/questionEventDataBuilder'], function(eventDataBuilder) {

    var objectiveRepository = require('repositories/objectiveRepository');

    describe('[questionEventDataBuilder]', function() {

        var answers = [{
            id: '0',
            isCorrect: true,
            isChecked: true,
            text: 'a0',
            answeredText: 'text0'
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false,
            text: 'a1',
            answeredText: 'text1'
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false,
            text: 'a2',
            answeredText: 'text2'
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: true,
            text: 'a3',
            answeredText: 'text3'
        }];

        var answerGroups = [
            {
                id: 'answerGroupId1',
                type: 'input',
                answeredText: 'text1',
                getCorrectText: function() {
                    return 'boo';
                },
                answers: [
                    {
                        id: '3',
                        isCorrect: false,
                        isChecked: true,
                        text: 'a3',
                        answeredText: 'text3'
                    }
                ]
            },
            {
                id: 'answerGroupId2',
                type: 'dropdown',
                answeredText: 'text2',
                getCorrectText: function() {
                    return 'boo2';
                },
                answers: [
                    {
                        id: '1',
                        isCorrect: false,
                        isChecked: false,
                        text: 'a1',
                        answeredText: 'text1'
                    }, {
                        id: '2',
                        isCorrect: true,
                        isChecked: false,
                        text: 'a2',
                        answeredText: 'text2'
                    }
                ]
            }
        ];

        var singleImageAnswers = [{
            id: '0',
            isChecked: true,
            image: 'a0'
        },
        {
            id: '1',
            isChecked: false,
            image: 'a1'
        }, {
            id: '2',
            isChecked: false,
            image: 'a2'
        },
        {
            id: '3',
            isChecked: false,
            image: 'a3'
        }];

        var dragAndDropAnswers = [{
            id: '0',
            isCorrect: true,
            isChecked: true,
            text: 'a0',
            currentPosition: { x: 0, y: 0 },
            correctPosition: { x: 0, y: 0 }
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false,
            text: 'a1',
            currentPosition: { x: 1, y: 1 },
            correctPosition: { x: 0, y: 0 }
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false,
            text: 'a2',
            currentPosition: { x: 1, y: 1 },
            correctPosition: { x: 1, y: 1 }
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: true,
            text: 'a3',
            currentPosition: { x: 2, y: 2 },
            correctPosition: { x: 2, y: 2 }
        }];


        var question = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: ko.observable(100),
            answers: answers,
            learningContents: []
        };

        var singleSelectImageQuestion = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: ko.observable(100),
            correctAnswerId: '0',
            answers: singleImageAnswers,
            learningContents: []
        };


        var objective = {
            id: 'id',
            title: 'title'
        };

        describe('buildSingleSelectTextQuestionSubmittedEventData:', function() {
            it('should be function', function() {
                expect(eventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {
                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function() {

                describe('when objective is not found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function() {
                        var f = function() {
                            eventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });
                });

                describe('when objective is found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(objective);
                    });

                    it('should return object', function() {
                        var data = eventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData(question);

                        expect(data.type).toBe("choice");
                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.answers.length).toBe(4);
                        expect(data.question.answers[0].id).toBe(answers[0].id);
                        expect(data.question.answers[0].text).toBe(answers[0].text);
                        expect(data.question.answers[1].id).toBe(answers[1].id);
                        expect(data.question.answers[1].text).toBe(answers[1].text);
                        expect(data.question.answers[2].id).toBe(answers[2].id);
                        expect(data.question.answers[2].text).toBe(answers[2].text);
                        expect(data.question.answers[3].id).toBe(answers[3].id);
                        expect(data.question.answers[3].text).toBe(answers[3].text);

                        expect(data.question.score).toBe(question.score());
                        expect(data.question.selectedAnswersIds[0]).toBe('0');
                        expect(data.question.selectedAnswersIds[1]).toBe('3');
                        expect(data.question.correctAnswersIds[0]).toBe('0');
                        expect(data.question.correctAnswersIds[1]).toBe('2');
                    });
                });

            });
        });

        describe('buildFillInQuestionSubmittedEventData:', function() {

            it('should be function', function() {
                expect(eventDataBuilder.buildFillInQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {
                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildFillInQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function() {

                describe('when objective is not found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function() {
                        var f = function() {
                            eventDataBuilder.buildFillInQuestionSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });
                });

                describe('when objective is found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(objective);
                        question.answerGroups = answerGroups;
                    });

                    it('should return object', function() {
                        var data = eventDataBuilder.buildFillInQuestionSubmittedEventData(question);

                        expect(data.type).toBe("fill-in");
                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.score).toBe(question.score());

                        expect(data.question.enteredAnswersTexts[0]).toBe('text1');
                        expect(data.question.enteredAnswersTexts[1]).toBe('text2');
                        expect(data.question.correctAnswersTexts[0]).toBe('boo');
                        expect(data.question.correctAnswersTexts[1]).toBe('boo2');
                    });
                });

            });

        });

        describe('buildDragAndDropTextQuestionSubmittedEventData:', function() {

            it('should be function', function() {
                expect(eventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {
                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function() {

                describe('when objective is not found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function() {
                        var f = function() {
                            eventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });
                });

                describe('when objective is found', function() {
                    beforeEach(function() {
                        question.answers = dragAndDropAnswers;

                        spyOn(objectiveRepository, 'get').andReturn(objective);
                    });

                    it('should return object', function() {
                        var data = eventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData(question);

                        expect(data.type).toBe("other");
                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.score).toBe(question.score());

                        expect(data.question.enteredAnswersTexts[0]).toBe('(0,0)');
                        expect(data.question.enteredAnswersTexts[1]).toBe('(1,1)');
                        expect(data.question.enteredAnswersTexts[2]).toBe('(1,1)');
                        expect(data.question.enteredAnswersTexts[3]).toBe('(2,2)');
                        expect(data.question.correctAnswersTexts[0]).toBe('(0,0)');
                        expect(data.question.correctAnswersTexts[1]).toBe('(0,0)');
                        expect(data.question.correctAnswersTexts[2]).toBe('(1,1)');
                        expect(data.question.correctAnswersTexts[3]).toBe('(2,2)');
                    });
                });

            });

        });

        describe('buildSingleSelectImageQuestionSubmittedEventData:', function() {
            it('should be function', function() {
                expect(eventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {
                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function() {

                describe('when objective is not found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function() {
                        var f = function() {
                            eventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });
                });

                describe('when objective is found', function() {
                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(objective);
                    });

                    it('should return object', function() {
                        var data = eventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData(question);

                        expect(data.type).toBe("choice");
                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.answers.length).toBe(4);
                        expect(data.question.answers[0].id).toBe(answers[0].id);
                        expect(data.question.answers[0].text).toBe(answers[0].image);
                        expect(data.question.answers[1].id).toBe(answers[1].id);
                        expect(data.question.answers[1].text).toBe(answers[1].image);
                        expect(data.question.answers[2].id).toBe(answers[2].id);
                        expect(data.question.answers[2].text).toBe(answers[2].image);
                        expect(data.question.answers[3].id).toBe(answers[3].id);
                        expect(data.question.answers[3].text).toBe(answers[3].image);

                        expect(data.question.score).toBe(question.score());
                        expect(data.question.selectedAnswersIds[0]).toBe('0');
                        expect(data.question.correctAnswersIds[0]).toBe(question.correctAnswerId);
                    });
                });

            });
        });

        describe('buildTextMatchingQuestionSubmittedEventData:', function() {

            it('should be function', function() {
                expect(eventDataBuilder.buildTextMatchingQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {

                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildTextMatchingQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });

            });

            describe('when question is an object', function() {

                describe('when objective is not found', function() {

                    beforeEach(function() {
                        spyOn(objectiveRepository, 'get').andReturn(null);
                    });

                    it('should throw exception with \'Objective is not found\'', function() {
                        var f = function() {
                            eventDataBuilder.buildTextMatchingQuestionSubmittedEventData(question);
                        };
                        expect(f).toThrow('Objective is not found');
                    });

                });

                describe('when objective is found', function() {

                    beforeEach(function() {
                        question.answers = [{}, {}];

                        spyOn(objectiveRepository, 'get').andReturn(objective);
                    });

                    it('should return object', function() {
                        var data = eventDataBuilder.buildTextMatchingQuestionSubmittedEventData(question);

                        expect(data.type).toBe("matching");
                        expect(data.objective.id).toBe(objective.id);
                        expect(data.objective.title).toBe(objective.title);

                        expect(data.question.id).toBe(question.id);
                        expect(data.question.title).toBe(question.title);
                        expect(data.question.answers).toBe(question.answers);
                        expect(data.question.score).toBe(question.score());
                    });
                });

            });

        });

        describe('buildLearningContentExperiencedEventData:', function() {
            it('should be function', function() {
                expect(eventDataBuilder.buildLearningContentExperiencedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {
                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildLearningContentExperiencedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });
            });

            describe('when question is an object', function() {

                describe('when spentTime is not a number', function() {
                    it('should throw exception with \'SpentTime is not a number\'', function() {
                        var f = function() {
                            eventDataBuilder.buildLearningContentExperiencedEventData({}, null);
                        };
                        expect(f).toThrow('SpentTime is not a number');
                    });
                });

                describe('when spentTime is an number', function() {

                    describe('when objective is not found', function() {
                        beforeEach(function() {
                            spyOn(objectiveRepository, 'get').andReturn(null);
                        });

                        it('should throw exception with \'Objective is not found\'', function() {
                            var f = function() {
                                eventDataBuilder.buildLearningContentExperiencedEventData(question, 100);
                            };
                            expect(f).toThrow('Objective is not found');
                        });
                    });

                    describe('when objective is found', function() {
                        beforeEach(function() {
                            spyOn(objectiveRepository, 'get').andReturn(objective);
                        });

                        it('should return object', function() {
                            var data = eventDataBuilder.buildLearningContentExperiencedEventData(question, 100);

                            expect(data.objective.id).toBe(objective.id);
                            expect(data.objective.title).toBe(objective.title);
                            expect(data.question.id).toBe(question.id);
                            expect(data.question.title).toBe(question.title);
                            expect(data.spentTime).toBe(100);
                        });
                    });

                });

            });
        });

        describe('buildStatementQuestionSubmittedEventData', function() {

            it('should be a function', function() {
                expect(eventDataBuilder.buildStatementQuestionSubmittedEventData).toBeFunction();
            });

            describe('when question is not an object', function() {

                it('should throw exception with \'Question is not an object\'', function() {
                    var f = function() {
                        eventDataBuilder.buildStatementQuestionSubmittedEventData(null);
                    };
                    expect(f).toThrow('Question is not an object');
                });

            });

            describe('when objective is not found', function() {

                it('should throw exception with \'Objective is not found\'', function() {
                    spyOn(objectiveRepository, 'get').andReturn(null);

                    var f = function() {
                        eventDataBuilder.buildStatementQuestionSubmittedEventData(question);
                    };

                    expect(f).toThrow('Objective is not found');
                });

            });

            it('should return statementEventData object', function() {
                var statementQuestion = {
                    id: 'id',
                    objectiveId: 'objId',
                    title: 'title',
                    score: ko.observable(100),
                    statements: [
                        { id: '1', text: 'text1', studentAnswer: true, isCorrect: true },
                        { id: '2', text: 'text2', studentAnswer: false, isCorrect: false },
                        { id: '3', text: 'text3', studentAnswer: null, isCorrect: true }
                    ],
                };
                spyOn(objectiveRepository, 'get').andReturn(objective);

                var data = eventDataBuilder.buildStatementQuestionSubmittedEventData(statementQuestion);

                expect(data.type).toBe("choice");
                expect(data.objective.id).toBe(objective.id);
                expect(data.objective.title).toBe(objective.title);

                expect(data.question.id).toBe(statementQuestion.id);
                expect(data.question.title).toBe(statementQuestion.title);
                expect(data.question.answers).toEqual([{ id: '1', text: 'text1' }, { id: '2', text: 'text2' }, { id: '3', text: 'text3' }]);
                expect(data.question.selectedAnswersIds).toEqual(['1[.]true', '2[.]false']);
                expect(data.question.correctAnswersIds).toEqual(['1[.]true', '2[.]false', '3[.]true']);
                expect(data.question.score).toBe(question.score());
            });

        });

    });
});