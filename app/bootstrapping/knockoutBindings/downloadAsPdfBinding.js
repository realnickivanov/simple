define(function () {
    ko.bindingHandlers.downloadAsPdf = {
        init: function (element, valueAccessor) {
            var Url = function (url) {
                var that = this;
                that.value = url || '',
                that.addQueryStringParam = function (key, value) {
                    that.value += that.value.substr(-1) === "/" ? '?' : '&';
                    that.value += key;
                    if (value) {
                        that.value += '=' + encodeURIComponent(value);
                    }

                    return that;
                }
            };

            var
                $element = $(element),
                args = valueAccessor(),
                url = ko.utils.unwrapObservable(args.url)
            ;

            var convertionUrl = new Url('//FreeHTMLtoPDF.com/')
                .addQueryStringParam('convert', location.href.replace(location.hash, '') + url)
                .addQueryStringParam('title', $element.attr('title'));

            $element.attr('href', convertionUrl.value);

            $('<script>', {
                src: '//FreeHTMLtoPDF.com/scripts/api.js'
            }).appendTo($element);

            if (location.href.indexOf('easygenerator.com/preview/') !== -1) {
                disableLink($element.parent());
            }
        }
    };

    function disableLink($link) {
        $link.css({
            'pointer-events': 'none',
            'opacity': '0.5'
        });
    }
})