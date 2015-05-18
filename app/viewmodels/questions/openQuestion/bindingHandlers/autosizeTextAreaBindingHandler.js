define(['jquery', 'knockout'], function ($, ko) {
    ko.bindingHandlers.textArea = {
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            autosize($(element), { setOverflowX: false, setOverflowY: false });
            ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, data, context);
        },
        update: function (element, valueAccessor, allBindingsAccessor, data, context) {
            ko.bindingHandlers.value.update(element, valueAccessor, allBindingsAccessor, data, context);
            autosize.update($(element));
        }
    };
});