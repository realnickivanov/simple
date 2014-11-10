define(['durandal/composition'], function (composition) {

    ko.bindingHandlers.imageWrap = {
        update: function (element) {
            var $element = $(element),
                wrapper = '<figure class="image-wrapper"></figure>';

            $('img', $element).each(function (index, image) {
                var $image = $(image),
                    $wrapper = $(wrapper).css('float', $image.css('float'));

                $image.wrap($wrapper);
            });
        }
    };

    composition.addBindingHandler('imageWrap');

});