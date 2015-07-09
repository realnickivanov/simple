define(['knockout'], function (ko) {

    ko.bindingHandlers.droppable = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var
                value = valueAccessor(),
                allBindings = allBindingsAccessor()
            ;

            $(element).droppable({
                accept: function (arg) {
                    if ($(element).find(arg).length) {
                        return true;
                    }

                    if (allBindings.accept) {
                        return allBindings.accept > $(element).find('.ui-draggable').length;
                    }

                    return $(arg).hasClass('ui-draggable');
                },
                activeClass: 'active',
                hoverClass: 'hover',
                tolerance: 'pointer',
                drop: function (event, ui) {
                    ui.draggable.trigger('dragstop');
                    $(ui.helper).remove();
                   
                    var draggable = ko.dataFor(ui.draggable.get(0));
                    var droppable = ko.dataFor(ui.draggable.closest('.ui-droppable').get(0));

                    if (droppable != value) {
                        if (_.isFunction(value.acceptValue)) {
                            value.acceptValue(draggable);
                        }

                        if (_.isFunction(droppable.rejectValue)) {
                            droppable.rejectValue(draggable);
                        }
                    }
                }
            });

        }
    }

})