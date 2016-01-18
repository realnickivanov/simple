define(['modules/webFontLoaderProvider'], function (webFontLoaderProvider) {
    return {
        execute: function () {
            webFontLoaderProvider.init();
        }
    };
});