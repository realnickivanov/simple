define(['knockout'], function (ko) {
    'use strict';

    ko.bindingHandlers.draggableText = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var allBindings = allBindingsAccessor();
            var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';
            var $element = $(element);

            $element.draggable({
                scope: scope,
                revert: 'invalid',
                appendTo: 'body',
                helper: 'clone',
                cursorAt: { left: 10, top: 15 },
                scroll: false,
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