define(function () {
    var buttonStatuses = {
        default: 'default',
        proggress: 'proggress',
        error: 'error'
    };

    var serviceUrl = has('release')
        ? '//pdf.easygenerator.com'
        : '//localhost:999';

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
                title = (valueAccessor().title || $element.attr('title')) + ' ' + getDateTimeString(),
                version = valueAccessor().version;

            var convertionUrl = new Url(serviceUrl + '/convert/')
                .addQueryStringParam('url', location.href.replace(location.hash, '') + 'pdf/')
                .addQueryStringParam('filename', title)
                .addQueryStringParam('version', version);

            var timeoutId;

            $element.click(function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                
                setStatus($element, buttonStatuses.proggress);

                $.fileDownload(convertionUrl.value)
                    .done(function (url) {
                        setStatus($element, buttonStatuses.default);
                    })
                    .fail(function (responseHtml, url) {
                        setStatus($element, buttonStatuses.error);
                        timeoutId = setTimeout(function () {
                            setStatus($element, buttonStatuses.default);
                        }, 5000);
                    });
                return false;
            });
        }
    };

    function setStatus($element, status) {
        $element
            .toggleClass(buttonStatuses.default, status === buttonStatuses.default)
            .toggleClass(buttonStatuses.proggress, status === buttonStatuses.proggress)
            .toggleClass(buttonStatuses.error, status === buttonStatuses.error);
    }

    function getDateTimeString() {
        var now = new Date();
        return now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    }
})