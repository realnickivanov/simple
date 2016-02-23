define(['durandal/composition', 'plugins/router'], function (composition, router) {

    ko.bindingHandlers.reviewable = {
        init: function (element, valueAccessor) {
            if (!router.getQueryStringValue('reviewApiUrl'))
                return;

            var $element = $(element),
                context = valueAccessor();

            $element.addClass('reviewable');
            $element.data('review-context', context);
        }
    };

    composition.addBindingHandler('reviewable');

});