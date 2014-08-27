define(['models/answers/answerGroup'], function (AnswerGroup) {
    "use strict";

    describe('model [AnswerGroups]', function () {

        it('should be defined', function () {
            expect(AnswerGroup).toBeDefined();
        });

        var answerGroups;
        var spec = {
            id: 'foo',
            type: 'type',
            answers: [
            {
                id: 'answerId1',
                isCorrect: true,
                text: 'answerText1'
            }, {
                id: 'answerId2',
                isCorrect: false,
                text: 'answerText2'
            }, {
                id: 'answerId3',
                isCorrect: true,
                text: 'answerText3'
            }]
        };

        beforeEach(function () {
            answerGroups = new AnswerGroup(spec);
        });

        describe('id:', function() {

            it('should be defined', function() {
                expect(answerGroups.id).toBeDefined();
            });

            it('should be equal \'foo\'', function() {
                expect(answerGroups.id).toBe('foo');
            });

        });

        describe('answers:', function () {

            it('should be defined', function () {
                expect(answerGroups.answers).toBeDefined();
            });

            it('should be array', function () {
                expect(answerGroups.answers).toBeArray();
            });

        });

        describe('getCorrectText:', function () {

            it('should be function', function () {
                expect(answerGroups.getCorrectText).toBeFunction();
            });

            it('should return all correct text', function () {
                expect(answerGroups.getCorrectText()).toEqual(['answerText1', 'answerText3']);
            });

        });

        describe('checkIsCorrect:', function() {

            it('should be function', function () {
                expect(answerGroups.checkIsCorrect).toBeFunction();
            });

            describe('when argument is correct answer', function() {

                it('should return true', function() {
                    var answerGroupValue = {
                        id: 'foo',
                        value: 'answerText1'
                    };
                    expect(answerGroups.checkIsCorrect(answerGroupValue)).toBeTruthy();
                });

            });

            describe('when argument is not correct answer', function () {

                it('should return false', function () {
                    var answerGroupValue = {
                        id: 'foo',
                        value: 'answerText2'
                    };
                    expect(answerGroups.checkIsCorrect(answerGroupValue)).toBeFalsy();
                });

            });

        });

    });

});