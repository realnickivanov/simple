define(['knockout'], function (ko) {

    ko.bindingHandlers.overlay = {
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.utils.unwrapObservable(value)) {
                $(element).addClass('overlay-binding-wrapper');
                $('<div />').addClass('overlay-binding').appendTo(element);
            } else {
                $(element).removeClass('overlay-binding-wrapper');
                $(element).children('.overlay-binding').remove();
            }
        }
    };

});