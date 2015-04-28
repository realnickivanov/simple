define([], function () {

    var element = $('body');

    return {
        apply: apply
    }

    function apply(background) {
        if (_.isNullOrUndefined(background) || _.isNullOrUndefined(background.image)) {
            return;
        }

        var image = new Image(),
            src = background.image.src,
            position = '0 0',
            repeat = 'no-repeat',
            size = 'auto';


        if (background.image.type === 'repeat'){
            repeat = 'repeat';
        }

        if (background.image.type === 'fullscreen'){
            size = 'cover';
            position = 'center'
        }

        image.onload = function () {
            $(element)
                .css('background-image', 'url(' + src + ')')
                .css('background-position', position)
                .css('-webkit-background-size', size)
                .css('background-size', size)
                .css('background-repeat', repeat)
        }

        image.src = src;
    }

});
