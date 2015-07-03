define([ 'translation'], function (translation) {

    return {
        apply: apply,
        refreshValues: refreshValues
    };

    function apply(view) {
        $(".blankSelect", view).each(
            function () {
                var self = this,
                    options = [];
                _.each(self.options, function (option) {
                    options.push(option);
                });
                $(self).wrap('<div class="select-wrapper"></div>');
                var $selectWrapper = $(self).parent('.select-wrapper');
                var valueWrapper = $('<div class="value"></div>').text(translation.getTextByKey("[fill in the blank choose answer]")).appendTo($selectWrapper);

                $selectWrapper.on('click', function () {
                    show($selectWrapper, options, function (newValue) {
                        $(self).val(newValue).trigger('change');
                        $(valueWrapper).text(newValue);
                    });
                });
            }
        )

    }

    function show($element, options, callback) {
        var $html = $('html');

        if ($element.hasClass('active')) {
            return;
        }
        $element.addClass('active');

        var container = $('<div />')
            .addClass('select-container')
            .css({
                position: 'absolute',
                left: ($element.offset().left - 5) + 'px',
                top: ($element.offset().top + $element.height()) + 'px',
                width: ($element.width() + 45) + 'px'
            })
            .append($('<ul/>')
                .addClass('unstyled')
                .on('click', 'li', function () {
                    var text = $(this).text();
                    $element.find('.current').text(text).removeClass('default');
                    if (callback) {
                        callback(text);
                    }
                })
                .append(_.chain(options)
                    .filter(function (option) {
                        return option.text !== $element.find('.current').text();
                    })
                    .map(function (option) {
                        return $('<li/>')
                            .text(option.text);
                    }).value())
        )
            .appendTo('body');

        var handler = function () {
            container.remove();
            $element.removeClass('active');
            $html.off('click', handler);
            $(window).off('resize', handler);
        };

        _.defer(function () {
            $html.on('click', handler);
            $(window).on('resize', handler);
        });
    };
    function refreshValues(view) {
        var blankInputSelector = '.blankInput,.blankSelect';
        $(blankInputSelector, view).each(function () {
                if ($(this).is('input')) {
                    $(this).val('');
                }
                else if ($(this).is('select')) {
                    $(this).val(translation.getTextByKey("[fill in the blank choose answer]"));
                    _.each($('.value'), function (wrapper) {
                        $(wrapper).text(translation.getTextByKey("[fill in the blank choose answer]"))

                    })
                }

            }
        )
    }
});