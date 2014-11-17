define(['durandal/composition'], function (composition) {

    ko.bindingHandlers.elementsWrap = {
        update: function (element) {
            var $element = $(element),
                imageWrapper = '<figure class="image-wrapper"></figure>',
                tableWrapper = '<figure class="table-wrapper"></figure>';

            $('img', $element).each(function (index, image) {
                var $image = $(image),
                    $wrapper = $(imageWrapper).css('float', $image.css('float'));

                $image.wrap($wrapper);
            });

            $('table', $element).each(function (index, table) {
                var $table = $(table),
                    $wrapper = $(tableWrapper);

                $table.wrap($wrapper);
            });
        }
    };

    composition.addBindingHandler('elementsWrap');

});