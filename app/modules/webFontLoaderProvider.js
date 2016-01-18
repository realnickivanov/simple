define(['WebFont'], function (fontLoader) {


    return {
        init: init
    }

    function init() {
        var defer = Q.defer();

        fontLoader.load({
            google: {
                families: ['Roboto Slab:300,400,700', 'Material Icons']
            },
            active: function () {
                defer.resolve()
            },
            inactive: function () {
                defer.reject('Browser does not support linked fonts or none of the fonts could be loaded!')
            }
        })
        return defer.promise;
    }
});