define(['knockout', 'jquery', 'durandal/composition'], function (ko, $, composition) {
    'use strict';
    ko.bindingHandlers.courseTitle = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                value = ko.utils.unwrapObservable(valueAccessor()),
                lenght = value.length;

            if (lenght > 100) {
                $element.css('font-size', '22px');
            }
        }
    };

    composition.addBindingHandler('courseTitle');
})