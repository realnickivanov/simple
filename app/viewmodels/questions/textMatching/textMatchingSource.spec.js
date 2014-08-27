define(['viewmodels/questions/textMatching/textMatchingSource'], function (Source) {
    "use strict";

    describe('viewModel [textMatchingSource]', function () {

        it('should be function', function () {
            expect(Source).toBeFunction();
        });

        describe('id:', function () {

            it('should be defined', function () {
                var source = new Source('id', '');
                expect(source.id).toEqual('id');
            });

        });

        describe('key:', function () {

            it('should be defined', function () {
                var source = new Source('', 'key');
                expect(source.key).toEqual('key');
            });

        });

        describe('value:', function () {

            it('should be observable', function () {
                var source = new Source('', '');
                expect(source.value).toBeObservable();
            });

        });

        describe('acceptValue:', function () {

            it('should be function', function () {
                var source = new Source('', '');
                expect(source.acceptValue).toBeFunction();
            });

            it('should change value', function () {
                var source = new Source('', '');
                var target = {};

                source.acceptValue(target);

                expect(source.value()).toEqual(target);
            });

        });

        describe('rejectValue:', function () {

            it('should be function', function () {
                var source = new Source('', '');
                expect(source.rejectValue).toBeFunction();
            });

            it('should change value to null', function () {
                var source = new Source('', '');

                source.rejectValue();

                expect(source.value()).toBeNull();
            });

        });

    });

})