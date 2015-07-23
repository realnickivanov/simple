define(['knockout'], function (ko) {
    'use strict';

    ko.bindingHandlers.draggableTextContainer = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var allBindings = allBindingsAccessor();
            var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';

            $(element).parent()
                .on('dragstart', '.drag-and-drop-text-draggable', function () {
                    $(element).addClass('active');
                })
                .on('dragstop', '.drag-and-drop-text-draggable', function () {
                    $(element).removeClass('active');
                    if ($(element).children('.drag-and-drop-text-draggable').length) {
                        $(element).children('.drag-and-drop-text-draggable-container-message').hide();
                    } else {
                        $(element).children('.drag-and-drop-text-draggable-container-message').show();
                    }
                });

            $(element).droppable({
                accept: '.drag-and-drop-text-draggable',
                scope: scope,
                drop: function (e, ui) {
                    ui.draggable.css('left', '').css('top', '').appendTo(this);
                    var text = ko.dataFor(ui.draggable.get(0));
                    if (text.dropSpot) {
                        text.dropSpot.text(undefined);
                    }
                }
            });
        }
    };
});