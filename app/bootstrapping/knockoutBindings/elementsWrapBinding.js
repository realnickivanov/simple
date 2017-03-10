define(['knockout', 'jquery', 'durandal/composition', 'modules/lessProcessor'], function (ko, $, composition, lessProcessor) {

    ko.bindingHandlers.elementsWrap = {
        init: function (element) {
            wrapElement(element);
        },

        update: function (element) {
            wrapElement(element);
        }
    };

    function wrapElement(element) {
        var $element = $(element),
                imageWrapper = '<figure class="image-wrapper"></figure>',
                tableWrapper = '<figure class="table-wrapper"></figure>';

        $('img', $element).each(function (index, image) {
            var $image = $(image),
                $wrapper = $(imageWrapper).css('float', $image[0].style.cssFloat);

            if ($image.closest('.cropped-image').length > 0) {
                return;
            }

            // moved to css, because of IE11 crash on Windows 10 => .image-wrapper img {height:auto!important;float:none!important;}
            //$image.height('auto');
            //$image.css('float', 'none');
            //
            $image.wrap($wrapper);
        });

        $('table', $element).each(function (index, table) {
            var $table = $(table),
                $wrapper = $(tableWrapper).css('float', $table.attr('align'));

            $table.attr('align', 'center');
            $table.wrap($wrapper);
        });

        $('.audio-editor iframe', $element).each(function (index, iframe) {
            var $iframe = $(iframe);

            var src = $iframe.attr('src');
            $iframe.attr('src', src + '&style_variables=' + encodeURIComponent(getStyles()));
        });
    }

    composition.addBindingHandler('elementsWrap');

    function getStyles() {
        return lessProcessor.vars ? JSON.stringify({ '@main-color': lessProcessor.vars['@main-color'], '@content-body-color': lessProcessor.vars['@content-body-color'], '@text-color': lessProcessor.vars['@text-color'] }) : undefined;
    }

});