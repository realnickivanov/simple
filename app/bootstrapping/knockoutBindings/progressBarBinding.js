define(['translation'], function (translation) {
    ko.bindingHandlers.progressBar = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                score = valueAccessor().score,
                masteryScore = valueAccessor().masteryScore,
                $progressBar = $element.children('.progressbar'),
                $value = $progressBar.children('.progressbar-value'),
                progressbarBackgroundColor = $element.css('color'),
                filledProgressBarBackgroundColor = $element.css('border-color'),
                $toolTip = $progressBar.children('.mastered-score-tooltip');
            $progressBar.css('background-color', progressbarBackgroundColor);
            $value.css({
                'width': score+'%',
                'background-color': filledProgressBarBackgroundColor
            });
            var $tootlTipText = $('<span />')
                    .addClass('mastered-score-tooltip-text')
                    .text(masteryScore + '% ' + translation.getTextByKey('[to complete]'))
                    .appendTo($toolTip);
            $element.hover(showTooltip, hideTooltip);
            $toolTip.hover(showTooltip, hideTooltip);

            function showTooltip() {
                $tootlTipText.stop().animate({
                    'opacity': 1,
                    'margin-bottom': '10px'
                }, 200);
            }
            function hideTooltip(event) {
                var e = event.toElement || event.relatedTarget;
                if (e && (e == $element[0] || e.parentNode == $element[0] || e == $toolTip[0] || e.parentNode == $toolTip[0])) {
                    return;
                }
                $tootlTipText.stop().animate({
                    'opacity': 0,
                    'margin-bottom': '15px'
                }, 200);
            }
        }
    };
})