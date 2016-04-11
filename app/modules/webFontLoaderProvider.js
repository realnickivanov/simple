define(['WebFont'], function (fontLoader) {


    return {
        init: init
    }

    function init(fonts) {
        var defer = Q.defer();

        var familiesToLoad = _.map(fonts, function (font) {
            return font.fontFamily
        });

        fontLoader.load({
            google: {
                families: familiesToLoad && familiesToLoad.length ? familiesToLoad : ['Roboto Slab']
            },
            custom: {
                families: ['Material Icons'],
                urls: ['./css/fonts.css']
            },
            active: function () {
                defer.resolve()
            },
            inactive: function () {
                //added to make possible ofline template loading
                defer.resolve()
            }
        })
        return defer.promise;
    }
});