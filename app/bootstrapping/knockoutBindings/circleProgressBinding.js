define(['durandal/composition', 'templateSettings', 'less'], function(composition, templateSettings, less) {

    ko.bindingHandlers.circleProgress = {
        update: function(element, valueAccessor) {
            var $element = $(element);

            var width = getNumericStylePropValue($element, 'width');
            var height = getNumericStylePropValue($element, 'height');
            if (width) {
                element.width = width;
            }
            if (height) {
                element.height = height;
            }

            var centerX = element.width / 2;
            var centerY = element.height / 2;


            // configs
            var score = valueAccessor().progress || 0;
            var lineWidth = getNumericStylePropValue($element, 'border-width', true) || valueAccessor().lineWidth || 4;
            var radius = getNumericStylePropValue($element, 'border-radius', true) || valueAccessor().radius || (centerX < centerY ? centerX : centerY - lineWidth / 2 - 1);
            var isMastered = valueAccessor().isMastered;
            var basicColor = valueAccessor().basicColor || getDefaultBasicColor();
            var progressColor = valueAccessor().progressColor || templateSettings.getColorValue('@secondary-color');
            var masteredColor = valueAccessor().masteredColor || templateSettings.getColorValue('@correct-color');

            var cnxt = element.getContext('2d');
            if (isMastered) {
                $element.addClass('mastered');
            }

            cnxt.beginPath();
            cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            cnxt.strokeStyle = basicColor;
            cnxt.lineWidth = lineWidth;
            cnxt.closePath();
            cnxt.stroke();

            var progress = score / 100;
            if (progress > 0) {
                cnxt.beginPath();
                cnxt.strokeStyle = isMastered ? masteredColor : progressColor;
                cnxt.lineWidth = lineWidth;

                if (progress == 1) {
                    cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                } else {
                    cnxt.arc(centerX, centerY, radius, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
                }

                cnxt.stroke();
            }

        }
    };

    function getNumericStylePropValue($element, propName, clear) {
        var propValueStr = $element.css(propName);

        if (clear) {
            $element.css(propName, '0px');
        }

        return parseInt(propValueStr.substring(0, propValueStr.length - 2), 10);
    }

    function getDefaultBasicColor() {
        var c = new less.tree.Color(templateSettings.getColorValue('@text-color').slice(1));
        var dimension = new less.tree.Dimension('95');
        var func = less.functions.functionRegistry.get('tint');
        return func(c, dimension).toRGB();
    }

});