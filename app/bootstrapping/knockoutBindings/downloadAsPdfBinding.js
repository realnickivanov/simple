﻿define(['download'], function (download) {
    var buttonStatuses = {
        default: 'default',
        proggress: 'proggress',
        error: 'error'
    };

    var serviceUrl, cookieDomain = null;
    if (has('release')) {
        serviceUrl = '//pdf-staging.easygenerator.com';
        cookieDomain = 'easygenerator.com';
    } else {
        serviceUrl = '//localhost:3035';
    }

    ko.bindingHandlers.downloadAsPdf = {
        init: function (element, valueAccessor) {

            var
                $element = $(element),
                title = (valueAccessor().title || $element.attr('title')) + ' ' + getDateTimeString(),
                version = valueAccessor().version;
            
            if (location.href.indexOf('/preview/') !== -1) {
                disableLink($element);
                return;
            }
            
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

            var convertionUrl = new Url(serviceUrl + '/convert/')
                .addQueryStringParam('url', getBaseUrl() + '/pdf/index.html')
                .addQueryStringParam('cookieDomain', cookieDomain)
                .addQueryStringParam('filename', title)
                .addQueryStringParam('version', version);

            var timeoutId;

            $element.click(function () {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                
                setStatus($element, buttonStatuses.proggress);
                fetch(convertionUrl.value)
                    .then(function(response) {
                        if(response.status !== 200) {
                            throw 'error';
                        }

                        return response.blob();
                    })
                    .then(function(blob) {
                        download(blob, getPdfTitle(title), blob.type);
                        setStatus($element, buttonStatuses.default);
                    })
                    .catch(function(error) {
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
    
    function disableLink($link) {
        $link.css({
            'pointer-events': 'none',
            'opacity': '0.5'
        });
        $link.parent().addClass('disabled');
    }
    
    function getBaseUrl() {
        var baseUrl = location.href.replace(location.hash, '');
        baseUrl = baseUrl.replace('#', '');

        if (location.pathname && location.pathname.length > 1) {
            var pageName = location.pathname.split("/").pop();
            baseUrl = baseUrl.replace(pageName, '');
        }

        if (location.search && location.search.length > 1) {
            baseUrl = baseUrl.replace(location.search, '');
        }

        return baseUrl;
    }

    /* Fix for IE11 and Edge (files can`t saved without extension) */
    function getPdfTitle(title) {
        return title + '.pdf';
    }
})