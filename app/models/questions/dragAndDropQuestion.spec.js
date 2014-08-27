define(['models/questions/dragAndDropQuestion'], function (DragAndDropQuestion) {
    "use strict";

    describe('model [dragAndDropQuestion]', function () {

        var
            eventManager = require('eventManager'),
            questionEventDataBuilder = require('eventDataBuilders/questionEventDataBuilder'),
            DraggableAnswer = require('models/answers/draggableAnswer');

        it('should be defined', function () {
            expect(DragAndDropQuestion).toBeDefined();
        });

        var spec = {
            background: 'test.jpg',
            dropspots: [
                {
                    id: '0',
                    isCorrect: true,
                    text: 'answer_0',
                    x: 0,
                    y: 0
                },
                {
                    id: '1',
                    isCorrect: true,
                    text: 'answer_1',
                    x: 1,
                    y: 1
                },
                {
                    id: '2',
                    isCorrect: true,
                    text: 'answer_2',
                    x: 2,
                    y: 2
                }
            ]
        };

        var question;
        beforeEach(function () {
            question = new DragAndDropQuestion(spec);
        });

        describe('submitAnswer:', function () {

            it('should be function', function () {
                expect(question.submitAnswer).toBeFunction();
            });

            var eventData = {};
            beforeEach(function () {
                spyOn(eventManager, 'answersSubmitted');
                spyOn(questionEventDataBuilder, 'buildDragAndDropTextQuestionSubmittedEventData').andReturn(eventData);
            });

            var dragableTexts;

            describe('when dragableTexts is not array', function () {

                beforeEach(function () {
                    dragableTexts = null;
                });

                it('should throw \'Dragable texts is not array.\' exception', function () {
                    var f = function () { question.submitAnswer(dragableTexts); };
                    expect(f).toThrow('Dragable texts is not array.');
                });

            });

            describe('when Dragable texts argument is array', function () {

                beforeEach(function () {
                    dragableTexts = [];
                });

                it('should save answers state', function () {
                    question.answers[0].currentPosition = { x: -1, y: -1 };
                    question.answers[1].currentPosition = { x: -1, y: -1 };
                    question.answers[2].currentPosition = { x: -1, y: -1 };

                    dragableTexts = [
                        {
                            id: '0',
                            position: { x: 0, y: 0 }
                        },
                        {
                            id: '1',
                            position: { x: 1, y: 1 }
                        },
                        {
                            id: '2',
                            position: { x: 2, y: 2 }
                        }
                    ];

                    question.submitAnswer(dragableTexts);

                    expect(question.answers[0].currentPosition.x).toBe(dragableTexts[0].position.x);
                    expect(question.answers[0].currentPosition.y).toBe(dragableTexts[0].position.y);

                    expect(question.answers[1].currentPosition.x).toBe(dragableTexts[1].position.x);
                    expect(question.answers[1].currentPosition.y).toBe(dragableTexts[1].position.y);

                    expect(question.answers[2].currentPosition.x).toBe(dragableTexts[2].position.x);
                    expect(question.answers[2].currentPosition.y).toBe(dragableTexts[2].position.y);
                });

                it('should set isAnswered to true', function () {
                    question.isAnswered = false;
                    question.submitAnswer(dragableTexts);
                    expect(question.isAnswered).toBeTruthy();
                });

                describe('when all Dragable texts placed correct', function () {

                    beforeEach(function () {
                        dragableTexts = [
                           {
                               id: '0',
                               position: { x: 0, y: 0 }
                           },
                           {
                               id: '1',
                               position: { x: 1, y: 1 }
                           },
                           {
                               id: '2',
                               position: { x: 2, y: 2 }
                           }
                        ];
                    });

                    it('should set score to 100', function () {
                        question.score(0);
                        question.submitAnswer(dragableTexts);
                        expect(question.score()).toBe(100);
                    });

                    it('should set isCorrectAnswered to true', function () {
                        question.isCorrectAnswered = false;
                        question.submitAnswer(dragableTexts);
                        expect(question.isCorrectAnswered).toBeTruthy();
                    });

                });

                describe('when all Dragable texts placed correct', function () {

                    beforeEach(function () {
                        dragableTexts = [
                            {
                                id: '0',
                                position: { x: 0, y: 0 }
                            },
                            {
                                id: '1',
                                position: { x: 3, y: 3 }
                            },
                            {
                                id: '2',
                                position: { x: 2, y: 2 }
                            }
                        ];
                    });

                    it('should set score to 0', function () {
                        question.score(100);
                        question.submitAnswer(dragableTexts);
                        expect(question.score()).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(dragableTexts);
                        expect(question.isCorrectAnswered).toBeFalsy();
                    });

                });

                describe('when all Dragable texts placed correct', function () {

                    beforeEach(function () {
                        dragableTexts = [
                            {
                                id: '0',
                                position: { x: 1, y: 1 }
                            },
                            {
                                id: '1',
                                position: { x: 2, y: 2 }
                            },
                            {
                                id: '2',
                                position: { x: 3, y: 3 }
                            }
                        ];
                    });

                    it('should set score to 0', function () {
                        question.score(100);
                        question.submitAnswer(dragableTexts);
                        expect(question.score()).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(dragableTexts);
                        expect(question.isCorrectAnswered).toBeFalsy();
                    });

                });

                it('should call event data builder buildFillInQuestionSubmittedEventData', function () {
                    question.submitAnswer(dragableTexts);
                    expect(questionEventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData).toHaveBeenCalled();
                });

                it('should call event manager answersSubmitted', function () {
                    question.submitAnswer(dragableTexts);
                    expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                });

            });

        });

        describe('background:', function () {

            it('should be defined', function () {
                expect(question.background).toBeDefined();
            });

            it('should be equal to spec background', function () {
                expect(question.background).toBe(spec.background);
            });
        });

        describe('answers:', function () {

            it('should be defined', function () {
                expect(question.answers).toBeDefined();
            });

            it('should map spec dropspots', function () {
                expect(question.answers.length).toBe(spec.dropspots.length);
            });

            describe('when answers mapped', function () {

                it('should be instance of answers/draggableAnswer', function () {
                    expect(question.answers[0] instanceof DraggableAnswer).toBeTruthy();
                });

                it('id:', function () {
                    expect(question.answers[0].id).toBe(spec.dropspots[0].id);
                    expect(question.answers[1].id).toBe(spec.dropspots[1].id);
                    expect(question.answers[2].id).toBe(spec.dropspots[2].id);
                });

                it('text:', function () {
                    expect(question.answers[0].text).toBe(spec.dropspots[0].text);
                    expect(question.answers[1].text).toBe(spec.dropspots[1].text);
                    expect(question.answers[2].text).toBe(spec.dropspots[2].text);
                });

                it('correctPosition.x:', function () {
                    expect(question.answers[0].correctPosition.x).toBe(spec.dropspots[0].x);
                    expect(question.answers[1].correctPosition.x).toBe(spec.dropspots[1].x);
                    expect(question.answers[2].correctPosition.x).toBe(spec.dropspots[2].x);
                });

                it('correctPosition.y:', function () {
                    expect(question.answers[0].correctPosition.y).toBe(spec.dropspots[0].y);
                    expect(question.answers[1].correctPosition.y).toBe(spec.dropspots[1].y);
                    expect(question.answers[2].correctPosition.y).toBe(spec.dropspots[2].y);
                });
            });

        });

    });

});