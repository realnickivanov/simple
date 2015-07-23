define(['durandal/composition', 'translation'], function (composition, translation) {

    ko.bindingHandlers.circleProgress = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                lineWidth = valueAccessor().lineWidth || 4,
                masteryScore = valueAccessor().masteryScore,
                centerX = element.width / 2,
                centerY = element.height / 2,
                radius = valueAccessor().radius || (centerX < centerY ? centerX : centerY - lineWidth / 2 - 1);

            if (masteryScore) {
                var $toolTip = $('<div />')
                    .addClass('mastered-score-tooltip').appendTo('body');

                var $tootlTipText = $('<span />')
                    .addClass('mastered-score-tooltip-text')
                    .text(masteryScore + '% ' + translation.getTextByKey('[to complete]'))
                    .appendTo($toolTip);

                var $canvasParent = $element.parent();
                $canvasParent.hover(showTooltip, hideTooltip);
                $toolTip.hover(showTooltip, hideTooltip);

                updateTooltipPosition();

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $toolTip.remove();
                });

                ko.utils.domData.set(element, 'ko_tooltip', $toolTip);

                $(window).on('resize', updateTooltipPosition);
            }

            function showTooltip() {
                $tootlTipText.stop().animate({
                    'opacity': 1,
                    'margin-bottom': '10px'
                }, 200);
            }

            function hideTooltip(event) {
                var e = event.toElement || event.relatedTarget;
                if (e && (e == $canvasParent[0] || e.parentNode == $canvasParent[0] || e == $toolTip[0] || e.parentNode == $toolTip[0])) {
                    return;
                }
                $tootlTipText.stop().animate({
                    'opacity': 0,
                    'margin-bottom': '15px'
                }, 200);
            }

            function updateTooltipPosition() {
                var masteryScoreAngle = 2 * Math.PI * (masteryScore / 100) - 0.5 * Math.PI,
                    masteryScoreX = centerX + (Math.cos(masteryScoreAngle) * (radius)),
                    masteryScoreY = centerY + (Math.sin(masteryScoreAngle) * (radius)),
                    elementPositionX = $element.offset().left,
                    elementPositionY = $element.offset().top,
                    tooltipPosX = elementPositionX + masteryScoreX - 6,
                    toolTipPosY = $('body').height() - (elementPositionY + masteryScoreY) - 6;

                $toolTip.css({
                    'left': tooltipPosX,
                    'bottom': toolTipPosY
                });
            }
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                score = valueAccessor().progress || 0,
                lineWidth = valueAccessor().lineWidth || 4,
                basicColor = $element.css('color') || 'rgb(211,212,216)',
                progressColor = $element.css('border-top-color') || 'rgb(87,157,193)',
                centerX = element.width / 2,
                centerY = element.height / 2,
                radius = valueAccessor().radius || (centerX < centerY ? centerX : centerY - lineWidth / 2 - 1),
                progress = score / 100,
                cnxt = element.getContext('2d'),
                masteryScore = valueAccessor().masteryScore,
                $toolTip = ko.utils.domData.get(element, 'ko_tooltip');

            cnxt.beginPath();
            cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            cnxt.strokeStyle = basicColor;
            cnxt.lineWidth = lineWidth;
            cnxt.closePath();
            cnxt.stroke();

            if (progress > 0) {
                cnxt.beginPath();
                cnxt.strokeStyle = progressColor;
                cnxt.lineWidth = lineWidth;

                if (progress == 1) {
                    cnxt.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                } else {
                    cnxt.arc(centerX, centerY, radius, 1.5 * Math.PI, (progress * 2 - 0.5) * Math.PI);
                }

                cnxt.stroke();
            }

            if (score >= masteryScore) {
                $toolTip.addClass('mastered');
            }
        }
    };

    composition.addBindingHandler('circleProgress');

});