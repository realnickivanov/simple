define(['lessProcessor'], function (lessProcessor) {
    ko.bindingHandlers.mediaPlayer = {
        init: function (element, valueAccessor) {
            
            var
                $element = $(element),
                args = valueAccessor(),
                embedCode = ko.utils.unwrapObservable(args.embedCode),
                mainColor = getMainInterfaceColor();
            
            $element.html(getMediaEmbedCode());
            
            function getMediaEmbedCode() {

                if (!embedCode)
                    return embedCode;

                var srcAttrName = 'src',
                    $container = $('<div/>').html(embedCode),
                    $iframe = $container.find('iframe'),
                    src = $iframe.attr(srcAttrName)

                

                src += '&color=' + mainColor;
                $iframe.attr(srcAttrName, src);
                return $container.html();
            }
        }
    };

    function getMainInterfaceColor() {
        var color = lessProcessor.colors['@main-color'];

        return color.substring(1, color.length)
    }
})