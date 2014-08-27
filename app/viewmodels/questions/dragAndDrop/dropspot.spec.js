define(['viewmodels/questions/dragAndDrop/dropspot'], function (Dropspot) {
    "use strict";

    describe('viewModel [Dropspot]', function () {

        it('should be defined', function () {
            expect(Dropspot).toBeDefined();
        });

        var dropspot;
        var spec = {
            position: { x: 0, y: 0 },
            limit: 1,
            items: [{}, {}]
        };

        beforeEach(function () {
            dropspot = new Dropspot(spec);
        });

        describe('position:', function () {

            it('should be defined', function () {
                expect(dropspot.position).toBeDefined();
            });

            it('should be equal to spec position', function () {
                expect(dropspot.position).toBe(spec.position);
            });

        });

        describe('limit:', function () {

            it('should be defined', function () {
                expect(dropspot.limit).toBeDefined();
            });

            it('should be equal to spec limit', function () {
                expect(dropspot.limit).toBe(spec.limit);
            });

        });

        describe('items:', function () {

            it('should be defined', function () {
                expect(dropspot.items).toBeDefined();
            });

            it('should be equal to spec limit', function () {
                expect(dropspot.items).toBe(spec.items);
            });

        });

        describe('allowDrop:', function () {

            it('should be a function', function () {
                expect(dropspot.allowDrop).toBeFunction();
            });

            describe('when items length less then limit', function () {

                var items = function (parameters) {
                    return [];
                }

                beforeEach(function () {
                    dropspot.limit = 1;
                });

                it('should return true', function () {

                    expect(dropspot.allowDrop(items)).toBeTruthy();
                });

            });

            describe('when items length greater then limit', function () {

                var items = function (parameters) {
                    return [{}, {}];
                }

                beforeEach(function () {
                    dropspot.limit = 1;
                });

                it('should return true', function () {

                    expect(dropspot.allowDrop(items)).toBeFalsy();
                });

            });

        });

        describe('afterMove:', function () {

            var args = {
                item: {
                    position: {
                        x: -1, y: -1
                    }
                }
            };

            beforeEach(function () {
                spyOn(dropspot, 'updateItemPosition');
            });


            it('should be defined', function () {
                expect(dropspot.afterMove).toBeDefined();
            });

            it('should call updateItemPosition', function () {
                dropspot.afterMove(args);
                expect(dropspot.updateItemPosition).toHaveBeenCalledWith(args.item);
            });

        });

        describe('updateItemPosition:', function () {

            var item = {
                position: {
                    x: -1, y: -1
                }
            };

            it('should be defined', function () {
                expect(dropspot.updateItemPosition).toBeDefined();
            });

            it('should set self position to item position', function () {
                dropspot.updateItemPosition(item);
                expect(item.position.x).toBe(dropspot.position.x);
                expect(item.position.x).toBe(dropspot.position.y);
            });

        });

    });
});