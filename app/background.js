define([], function () {

    return {
        apply: apply
    };


    function apply(background) {

        var elementsClasses = {
            header: {
                element: ".header",
                brightness: ".header-overlay"
            },
            fullscreenHeader: {
                element: ".fullscreen-header-overlay",
                brightness: ".fullscreen-header-brightness-holder"
            },
            body: {
                element: "body",
                brightness: ".body-layout-wrapper"
            }
        }

        if (background.body) {
            if (background.body.texture && background.body.texture.length) {
                applyImage(elementsClasses.body.element, background.body.texture, "repeat");
            };

            if (background.body.color && background.body.color.length) {
                applyColor(elementsClasses.body.element, background.body.color);
            };

            if (background.body.brightness) {
                applyBrightness(elementsClasses.body.brightness, background.body.brightness);
            };
        }

        if (background.header) {

            var headerClasses = elementsClasses.header;

            if (background.header.expanded) {
                headerClasses = elementsClasses.fullscreenHeader;
            }

            if (background.header.image && background.header.image.url && background.header.image.url.length) {
                applyImage(headerClasses.element, background.header.image.url, background.header.image.option);
            };
            if (background.header.color && background.header.color.length) {
                applyColor(headerClasses.element, background.header.color);
            };
            if (background.header.brightness) {
                applyBrightness(headerClasses.brightness, background.header.brightness);
            };
        }
    }

    function applyBrightness(element, brightness) {
        var $element = $(element);
        if (brightness > 0) {
            $element.css({
                "background-color": "#fff",
                "opacity": brightness
            });
        };
        if (brightness < 0) {
            $element.css({
                "background-color": "#000",
                "opacity": -brightness
            });
        };
    }

    function applyImage(element, url, type) {
        var $element = $(element),
            image = new Image(),
            position = '0 0',
            repeat = 'no-repeat',
            size = 'auto';

        if (type === 'repeat') {
            repeat = 'repeat';
        };

        if (type === 'fullscreen') {
            size = 'cover';
            position = 'center';
        };

        image.onload = function () {
            $element.css({
                'top': '0',
                'bottom': '0',
                'background-image': 'url(' + url + ')',
                'background-position': position,
                '-webkit-background-size': size,
                'background-size': size,
                'background-repeat': repeat
            })
        };
        image.src = url;
    }

    function applyColor(element, color) {
        var $element = $(element);
        $element.css({
            'background-color': color
        });
    }

});
