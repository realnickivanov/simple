define(['models/answers/checkableAnswer'], function (CheckableAnswer) {
    "use strict";

    describe('model [checkableAnswer]', function () {

        it('should be defined', function() {
            expect(CheckableAnswer).toBeDefined();
        });

        var ckeckableAnswer;
        var spec = {
            id: 'id',
            text: 'title',
            isCorrect: false,
            isChecked: false
        };

        beforeEach(function () {
            ckeckableAnswer = new CheckableAnswer(spec);
        });

        describe('isChecked:', function () {
            it('should be defined', function () {
                expect(ckeckableAnswer.isChecked).toBeDefined();
            });

            it('should be false', function () {
                expect(ckeckableAnswer.isChecked).toBeFalsy();
            });
        });

    });
    
});