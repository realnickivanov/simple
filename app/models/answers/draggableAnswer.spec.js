define(['models/answers/draggableAnswer'], function (DraggableAnswer) {
    "use strict";

    describe('model [DraggableAnswer]', function () {

        it('should be defined', function() {
            expect(DraggableAnswer).toBeDefined();
        });

        var draggableAnswer;
        var spec = {
            id: 'id',
            text: 'title',
            isCorrect: false,
            x: 10,
            y: 20
        };

        beforeEach(function () {
            draggableAnswer = new DraggableAnswer(spec);
        });

        describe('correctPosition:', function () {
            it('should be defined', function () {
                expect(draggableAnswer.correctPosition).toBeDefined();
            });

            describe('correctPosition.x:', function () {
                it('should be defined', function () {
                    expect(draggableAnswer.correctPosition.x).toBeDefined();
                });


                it('should be equal to spec x', function () {
                    expect(draggableAnswer.correctPosition.x).toBe(spec.x);
                });
            });

            describe('correctPosition.y:', function () {
                it('should be defined', function () {
                    expect(draggableAnswer.correctPosition.y).toBeDefined();
                });


                it('should be equal to spec y', function () {
                    expect(draggableAnswer.correctPosition.y).toBe(spec.y);
                });
            });
        });

        describe('currentPosition:', function () {
            it('should be defined', function () {
                expect(draggableAnswer.currentPosition).toBeDefined();
            });

            describe('currentPosition.x:', function () {
                it('should be defined', function () {
                    expect(draggableAnswer.currentPosition.x).toBeDefined();
                });

                it('should be -1 by default', function () {
                    expect(draggableAnswer.currentPosition.x).toBe(-1);
                });
            });

            describe('currentPosition.y:', function () {
                it('should be defined', function () {
                    expect(draggableAnswer.currentPosition.y).toBeDefined();
                });

                it('should be -1 by default', function () {
                    expect(draggableAnswer.currentPosition.y).toBe(-1);
                });
            });
        });

    });
    
});