define(function () {
    ko.bindingHandlers.mediaPlayer = {
        init: function (element, valueAccessor) {
            var
                $element = $(element),
                args = valueAccessor(),
                embedCode = ko.utils.unwrapObservable(args.embedCode),
                theme = ko.utils.unwrapObservable(args.theme)
            ;

            $element.html(getMediaEmbedCode());

            function getMediaEmbedCode() {
                if (!embedCode || !theme)
                    return embedCode;

                var srcAttrName = 'src',
                    themeCssPath = 'css/player/',
                    $container = $('<div/>').html(embedCode),
                    $iframe = $container.find('iframe'),
                    src = $iframe.attr(srcAttrName),
                    url = location.href.split(/[?#]/)[0];

                if (!src || !url)
                    return embedCode;

                src += '&css=' + url.replace(/[^\/]+$/, '') + themeCssPath + theme + '.css';
                $iframe.attr(srcAttrName, src);
                return $container.html();
            }
        }
    };
})