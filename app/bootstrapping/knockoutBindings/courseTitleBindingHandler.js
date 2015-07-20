define(['knockout', 'jquery', 'durandal/composition'], function (ko, $, composition) {
    'use strict';
    ko.bindingHandlers.courseTitle = {
        init: function (element) {
            var $element = $(element),
                lenght = element.innerHTML.length;

            if (lenght > 100) {
                $element.css('font-size', '22px');
            }
        }
    };

    composition.addBindingHandler('courseTitle');
})