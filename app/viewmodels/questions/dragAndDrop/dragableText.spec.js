define(['viewmodels/questions/dragAndDrop/dragableText'], function (DragableText) {
    "use strict";

    describe('viewModel [DragableText]', function () {

        it('should be defined', function () {
            expect(DragableText).toBeDefined();
        });

        var dragableText;
        var spec = {
            id: '0',
            text: 'Test Text',
            position: {x: 0, y:0}
        };

        beforeEach(function () {
            dragableText = new DragableText(spec);
        });


        it('should be defined', function () {
            expect(dragableText).toBeDefined();
        });

        describe('id:', function () {

            it('should be defined', function () {
                expect(dragableText.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(dragableText.id).toBe(spec.id);
            });

        });

        describe('text:', function () {

            it('should be defined', function () {
                expect(dragableText.text).toBeDefined();
            });

            it('should be equal to spec text', function () {
                expect(dragableText.text).toBe(spec.text);
            });

        });

        describe('position:', function () {

            it('should be defined', function () {
                expect(dragableText.position).toBeDefined();
            });

            it('should be equal to spec position', function () {
                expect(dragableText.position).toBe(spec.position);
            });

        });

    });
});