define(function () {
    ko.bindingHandlers.customFocus = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                value = valueAccessor(),
                focusClass = value.class || 'focused';

            $('html').bind('touchstart', removeFocusClass);
            $('html').bind('click', removeFocusClass);
            $(window).bind('blur', removeFocusClass);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $('html').unbind('touchstart', removeFocusClass);
                $('html').unbind('click', removeFocusClass);
                $(window).unbind('blur', removeFocusClass);
            });

            $element.on('touchstart', function (e) {
                e.stopPropagation();
            });

            $element.on('click', function (e) {
                $element.addClass(focusClass);
                e.stopPropagation();
            });

            function removeFocusClass() {
                $element.removeClass(focusClass);
            }

        }
    }
});