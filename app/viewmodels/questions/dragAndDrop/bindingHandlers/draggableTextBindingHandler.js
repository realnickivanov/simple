define(['knockout'], function (ko) {
    'use strict';

    ko.bindingHandlers.draggableText = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var allBindings = allBindingsAccessor();
            var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';
            var $element = $(element);

            $element.draggable({
                appendTo: '.application-wrapper',
                containment: '.application-wrapper',
                scope: scope,
                revert: 'invalid',
                helper: 'clone',
                cursorAt: { left: 10, top: 15 },
                start: function () {
                    $element.css({ visibility: 'hidden' });
                },
                stop: function () {
                    $element.css({ visibility: 'visible' });
                }
            });
        }
    };
});