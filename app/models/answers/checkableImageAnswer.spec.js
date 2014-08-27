define(['models/answers/checkableImageAnswer'], function (CheckableImageAnswer) {
    "use strict";

    describe('model [checkableImageAnswer]', function () {

        it('should be defined', function() {
            expect(CheckableImageAnswer).toBeDefined();
        });

        var checkableImageAnswer;
        var spec = {
            id: 'id',
            text: 'title',
            isCorrect: false,
            isChecked: false,
            image : 'test.jpg'
        };

        beforeEach(function () {
            checkableImageAnswer = new CheckableImageAnswer(spec);
        });

        describe('image:', function () {
            it('should be defined', function () {
                expect(checkableImageAnswer.image).toBeDefined();
            });

            it('should be image', function () {
                expect(checkableImageAnswer.image).toBe(spec.image);
            });
        });


    });
    
});