define(['knockout', 'translation'], function (ko, translation) {
    ko.bindingHandlers.localize = {
        update: function (element, valueAccessor) {
            localizeValue(element, valueAccessor);
        }
    };

    function localizeValue(element, valueAccessor) {
        var value = valueAccessor();

        if (_.isEmpty(value)) {
            return;
        }

        if (!_.isUndefined(value['text'])) {
            $(element).text(getLocalizedText(value['text']));
        }
        if (!_.isUndefined(value['placeholder'])) {
            $(element).attr('placeholder', getLocalizedText(value['placeholder']));
        }
        if (!_.isUndefined(value['value'])) {
            $(element).prop('value', getLocalizedText(value['value']));
        }
        if (!_.isUndefined(value['title'])) {
            $(element).prop('title', getLocalizedText(value['title']));
        }
        if (!_.isUndefined(value['html'])) {
            $(element).html(getLocalizedText(value['html']));
        }
        if (!_.isUndefined(value['data-text'])) {
            $(element).attr('data-text', getLocalizedText(value['data-text']));
        }
    }

    function getLocalizedText(value) {
        if (_.isString(value)) {
            return translation.getTextByKey(value);
        } else if (_.isObject(value)) {
            var text = translation.getTextByKey(value.key);

            for (var replacement in value.replace) {
                text = text.replace('{' + replacement + '}', value.replace[replacement]);
            }

            return text;
        }
    }
});