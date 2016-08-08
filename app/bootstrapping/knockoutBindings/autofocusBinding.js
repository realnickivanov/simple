define(['knockout', 'jquery', 'durandal/composition'], function (ko, $, composition) {

    ko.bindingHandlers.autofocus = {
        init: function (element) {
            var $element = $(element);
            $element.find('.autofocus').first().focus();
        }
    };

    composition.addBindingHandler('autofocus');

});