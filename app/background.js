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
            body: {
                element: "body",
                brightness: ".body-layout-wrapper"
            }
        }

        _.each(background, function (backgroundSetting, group) {
            var element = elementsClasses[group].element,
                brightness = elementsClasses[group].brightness;
            if (backgroundSetting.image && backgroundSetting.image.src) {
                var image = new Image(),
                    src = backgroundSetting.image.src,
                    position = '0 0',
                    repeat = 'no-repeat',
                    size = 'auto';
                if (backgroundSetting.image.type === 'repeat') {
                    repeat = 'repeat';
                }
                if (backgroundSetting.image.type === 'fullscreen') {
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
            if (backgroundSetting.color) {
                $(element).css({
                    "background-color": backgroundSetting.color
                })
            }
            if (backgroundSetting.brightness && backgroundSetting.brightness > 0) {
                $(brightness).css({
                    "background-color": "#fff",
                    "opacity": backgroundSetting.brightness
                })
            }
            if (backgroundSetting.brightness && backgroundSetting.brightness < 0){
                $(brightness).css({
                    "background-color": "#000",
                    "opacity": -backgroundSetting.brightness
                })
            }

        })
    }
});
