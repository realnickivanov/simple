define(['themesInjector'], function (themesInjector) {
    "use strict";

    describe('[themesInjector]', function () {

        it('should be defined', function () {
            expect(themesInjector).toBeDefined();
        });

        describe('init:', function () {

            it('should be function', function () {
                expect(themesInjector.init).toBeFunction();
            });

        });

    });

});