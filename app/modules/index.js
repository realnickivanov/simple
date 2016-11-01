define(['./lessProcessor', './webFontLoaderProvider'], function(lessProcessor, webFontLoader){
    'use strict';

    return {
        init: init
    };

    function init(templateSettings, manifest, publishSettings){
        var promises = [];

        promises.push(webFontLoader.init(templateSettings.fonts, manifest));
        promises.push(lessProcessor.init(templateSettings.colors, templateSettings.fonts))

        return Q.all(promises);
    }
});