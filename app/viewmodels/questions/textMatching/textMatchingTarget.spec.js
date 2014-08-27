define(['viewmodels/questions/textMatching/textMatchingTarget'], function (Target) {
    "use strict";

    describe('viewModel [textMatchingTarget]', function () {

        it('should be function', function () {
            expect(Target).toBeFunction();
        });

        describe('value:', function () {

            it('should be defined', function () {
                var target = new Target('value');
                expect(target.value).toEqual('value');
            });

        });

    });

})