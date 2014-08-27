define(['knockout'], function (ko) {

    ko.bindingHandlers.syncHeight = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            var height = $('.common-height-scope-' + ko.utils.unwrapObservable(value)).height();
            if (height) {
                $(element).css({ height: height });
            }
            $(element).attr('data-sync-height', '');
        }
    }

});