define(['knockout', 'underscore'], function (ko, _) {
    ko.bindingHandlers.changeClass = {
        update: function (element, valueAccessor) {
            var delay = valueAccessor().delay || 400,
                fromClass = valueAccessor().fromClass || 'hide',
                toClass = valueAccessor().toClass || 'show',
                value = ko.utils.unwrapObservable(valueAccessor().value) || false; 

            _.delay(function(){
                element.classList.toggle(toClass, value);
                element.classList.toggle(fromClass, !value);
            }, delay);
        }
    };
});