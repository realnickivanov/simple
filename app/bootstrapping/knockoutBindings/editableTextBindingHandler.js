ko.bindingHandlers.editableText = {
    init: function(element, valueAccessor) {
        var $element = $(element);
        var text = valueAccessor().text;
        var onEnterKeyPress = valueAccessor().onEnterKeyPress;
        var updateValue = function() {
            if (ko.utils.unwrapObservable(text) !== $element.text()) {
                text($element.text());
            }
        };

        $element.text(ko.utils.unwrapObservable(text)).on('focus', function() {
            $element.on('DOMSubtreeModified', updateValue);
        }).on('blur', function() {
            $element.scrollLeft(0);
            $element.off('DOMSubtreeModified', updateValue);
        }).on('keypress', function(event) {
            if (event.keyCode !== 13) {
                return;
            }

            $element.blur();
            if (onEnterKeyPress) {
                onEnterKeyPress();
            }

            event.preventDefault();
            event.stopPropagation();
        }).on('drop dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    },
    update: function(element, valueAccessor) {
        var text = ko.utils.unwrapObservable(valueAccessor().text);
        var $element = $(element);

        if (text !== $element.text()) {
            $element.text(text);
        }

        if ($element.text().length === 0) {
            $element.text('');
        }
    }
};