define(['jquery', 'knockout', 'durandal/composition'], function ($, ko, composition) {
    'use strict';

    ko.bindingHandlers.reloadFrame = {
        update: function(element, valueAccessor) {
            var iFrame = element.getElementsByTagName('iframe')[0],
                tryAgain = ko.utils.unwrapObservable(valueAccessor());
            if (tryAgain) {
                iFrame.src = iFrame.src;
            }
        }
    };

    composition.addBindingHandler('reloadFrame');
});