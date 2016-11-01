define(['durandal/binder', './binders/localization', './binders/background'], function (binder, localization, background) {

    return {
        execute: function () {
            binder.binding = function (obj, view) {
                localization.localize(view);
                background.apply();
            }
        }
    };

})