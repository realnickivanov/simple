define(['WebFont', 'manifestReader'], function(fontLoader, manifestReader) {


    return {
        init: init
    }

    function init(fonts) {
        var defer = Q.defer();

        manifestReader.readManifest().then(function(manifest) {
            var familiesToLoad = _.chain(fonts)
                .map(function(font) {
                    return font.fontFamily
                })
                .uniq()
                .without('Arial', 'Times new roman', 'Verdana') //filter font families that are available in all supported browsers
                .value();

            if (!familiesToLoad || !familiesToLoad.length) {
                familiesToLoad = ['Roboto Slab'];
            }

            familiesToLoad = familiesToLoad.map(function(font) {
                return { "fontFamily": font, "variants": ["400"] };
            });

            _.each(_.filter(manifest.fonts, function(font) { return !font.local; }), function(font) {
                var fontToLoad = _.find(familiesToLoad, function(fontToLoad) { return font.fontFamily === fontToLoad.fontFamily });
                if (fontToLoad) {
                    fontToLoad.variants = _.union(fontToLoad.variants, font.variants);
                } else {
                    familiesToLoad.push({ "fontFamily": font.fontFamily, "variants": font.variants })
                }
            });

            fontLoader.load({
                google: {
                    families: familiesToLoad.map(mapFontName)
                },
                custom: {
                    families: _.filter(manifest.fonts, function(font) { return font.local; }).map(mapFontName),
                    urls: ['./css/fonts.css']
                },
                active: function() {
                    defer.resolve()
                },
                inactive: function() {
                    //added to make possible ofline template loading
                    defer.resolve()
                }
            });
        });
        return defer.promise;
    }

    function mapFontName(fontToLoad) {
        return fontToLoad.fontFamily + ':' + fontToLoad.variants.join(',');
    }
});