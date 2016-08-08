define(['knockout', 'jquery', 'durandal/composition'], function (ko, $) {

    ko.bindingHandlers.tabFocus = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                keyboardClass = valueAccessor() || 'keyboard-navigation';

            $element.keydown(function (e) {
                if (e.which == 9 && !$element.hasClass(keyboardClass)) {
                    $element.addClass(keyboardClass);
                }
            });

            $element.click(function() {
                if ($element.hasClass(keyboardClass)) {
                    $element.removeClass(keyboardClass);
                }
            });
        }
    };
});