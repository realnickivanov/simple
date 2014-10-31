define(['durandal/binder', 'localization'], function (binder, localization) {


    return {
        execute: function () {
            binder.bindingComplete = function (obj, view) {
                localization.localize(view);
            }
        }
    };


})