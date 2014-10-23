define(['browserSupport'], function (browserSupport) {
    ko.bindingHandlers.area = {
        init: function (element, valueAccessor) {
            var
                value = valueAccessor(),
                click = value ? value.click : undefined,
                offset, x, y
            ;

            $(element).on('click', handler);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).off('click', handler);
            });

            function handler(e) {
                offset = $(element).offset();
                x = e.pageX - offset.left;
                y = e.pageY - offset.top;

                // workaround for specific version of Chrome with next bug:
                // https://code.google.com/p/chromium/issues/detail?id=423802
                if (browserSupport.isChromeWithPageCoordsBug) {
                    x -= window.scrollX;
                    y -= window.scrollY;
                }

                if (typeof (click) == "function") {
                    click({ x: x, y: y });
                }
            }

        }
    };
})