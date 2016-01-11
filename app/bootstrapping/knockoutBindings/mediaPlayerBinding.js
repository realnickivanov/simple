define(['lessProcessor'], function (lessProcessor) {
    ko.bindingHandlers.mediaPlayer = {
        init: function (element, valueAccessor) {

            var
                $element = $(element),
                args = valueAccessor(),
                embedCode = ko.utils.unwrapObservable(args.embedCode);


            $element.html(getMediaEmbedCode());

            function getMediaEmbedCode() {

                if (!embedCode)
                    return embedCode;

                var srcAttrName = 'src',
                    $container = $('<div/>').html(embedCode),
                    $iframe = $container.find('iframe'),
                    src = $iframe.attr(srcAttrName),
                    variablesList = getVariablesList();

                src += '&style_variables=' + encodeURIComponent(variablesList);

                $iframe.attr(srcAttrName, src);
                return $container.html();
            }
        }
    };

    function getVariablesList() {
        return lessProcessor.vars ? JSON.stringify(essProcessor.vars) : undefined;
    }
})