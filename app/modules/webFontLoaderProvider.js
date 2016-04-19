define(['WebFont'], function (fontLoader) {


    return {
        init: init
    }

    function init(fonts) {
        var defer = Q.defer();

        var familiesToLoad = _.chain(fonts)
            .map(function (font) {
                return font.fontFamily
            })
            .uniq()
            .without('Arial', 'Times new roman', 'Verdana') //filter font families that are available in all supported browsers
            .value();

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