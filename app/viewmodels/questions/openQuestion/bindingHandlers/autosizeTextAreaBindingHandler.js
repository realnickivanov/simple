define(['jquery', 'knockout'], function($, ko) {
    ko.bindingHandlers.autosizeTextArea = {
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            autosize($(element), { setOverflowX: false, setOverflowY: false});
        },
        update: function (element, valueAccessor, allBindingsAccessor, data, context) {
            
        }
    };
});