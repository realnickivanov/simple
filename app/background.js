define([], function () {

    var element = $('<div />')


    return {
        apply: apply
    }

    function apply(background) {
        if (_.isNullOrUndefined(background) || _.isNullOrUndefined(background.image)) {
            return;
        }

        element.prependTo('body');

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
            position = 'center'
        }

        image.onload = function () {
            $(element)
                .css({
                    'position': 'fixed',
                    'top': '0',
                    'bottom': '0',
                    'width': '100%',
                    'height': '100%',

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
