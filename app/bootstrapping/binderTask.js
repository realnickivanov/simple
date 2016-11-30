define(['durandal/binder', './binders/background'], function (binder, background) {

    return {
        execute: function () {
            binder.binding = function (obj, view) {
                TranslationPlugin.localize(view);
                background.apply();
            }
        }
    };

})