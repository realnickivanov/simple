define(['durandal/composition'], function (composition) {

    ko.bindingHandlers.imageWrap = {
        init: function (element) {
            var $element = $(element),
                wrapper = '<figure class="image-wrapper"></figure>';

            $('img', $element).wrap(wrapper);
        }
    };

    composition.addBindingHandler('imageWrap');

});