define([], function () {

    return {
        apply: apply
    };

    function apply(background) {

        var element = $('.header');

        if (!background || !background.image || !background.image.src) {
            element.addClass('default-background');
            return;
        }
 
        var image = new Image(),
            src = background.image.src,
            position = '0 0',
            repeat = 'no-repeat',
            size = 'auto';


        if (background.image.type === 'repeat') {
            repeat = 'repeat';
        }

        if (background.image.type === 'fullscreen') {
            size = 'cover';
            position = 'center';
        }

        image.onload = function () {
            $(element)
                .css({
                    'top': '0',
                    'bottom': '0',
                    'background-image': 'url(' + src + ')',
                    'background-position': position,
                    '-webkit-background-size': size,
                    'background-size': size,
                    'background-repeat': repeat
                });
        }

        image.src = src;
    }

});
