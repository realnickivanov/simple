(function($) {
    'use strict';

    var cssClasses = {
        container: 'select-container',
        wrapper: 'select-wrapper',
        value: 'value',
        active: 'active',
        current: 'current',
        default: 'default'
    };

    var Select = function (element, opt) {
        this.element = element;
        this.options = $.extend({}, opt);

        this.init();
    };

    Select.prototype = {
        init: function () {
            var that = this,
                $element = $(that.element),
                options = [];
            $.each($element[0].options, function(index, item) {
                options.push(item);
            });
            $element.wrap('<div class="' + cssClasses.wrapper + '"></div>');
            var $selectWrapper = $element.parent('.' + cssClasses.wrapper);
            var $valueWrapper = $('<div class="' + cssClasses.value + '"></div>')
                .text(that.options.defaultText)
                .appendTo($selectWrapper);

            $selectWrapper.on('click', function () {
                that.show($selectWrapper, options, function (newValue) {
                    $element.val(newValue).trigger('change');
                    $($valueWrapper).text(newValue);
                });
            });
        },
        show: function ($element, options, callback) {
            var $html = $('html');

            if ($element.hasClass(cssClasses.active)) {
                return;
            }
            $element.addClass(cssClasses.active);

            var container = $('<div />')
                .addClass(cssClasses.container)
                .css({
                    position: 'absolute',
                    left: ($element.offset().left - 5) + 'px',
                    top: ($element.offset().top + $element.height()) + 'px',
                    width: ($element.width() + 45) + 'px'
                })
                .append($('<ul/>')
                    .on('click', 'li', function () {
                        var text = $(this).text();
                        $element.find('.' + cssClasses.current)
                            .text(text)
                            .removeClass(cssClasses.default);

                        if (callback) {
                            callback(text);
                        }
                    })
                    .append(getOptionsMarkup()))
                    .appendTo('body');

            var handler = function () {
                container.remove();
                $element.removeClass(cssClasses.active);
                $html.off('click', handler);
                $(window).off('resize', handler);
            };

            setTimeout(function () {
                $html.on('click', handler);
                $(window).on('resize', handler);
            }, 0);

            function getOptionsMarkup() {
                var optionsMarkup = [];
                for (var i = 0; i < options.length; i++) {
                    if (options[i].text !== $element.find('.' + cssClasses.current).text()) {
                        optionsMarkup.push($('<li/>').text(options[i].text));
                    }
                }
                return optionsMarkup;
            }
        },
        refresh: function () {
            var $element = $(this.element);
            $element.val(this.options.defaultText);
            $('.' + cssClasses.value, $element.parent('.' + cssClasses.wrapper)).text(this.options.defaultText);
        },
        updateValue: function (selectedText) {
            if (typeof selectedText === 'string') {
                var $element = $(this.element);
                $element.val(selectedText);
                $('.' + cssClasses.value, $element.parent('.' + cssClasses.wrapper)).text(selectedText);
            }
        }
    };

    $.fn.select = function (options, args) {
        return this.each(function () {
            var $element = $(this),
                instance = $element.data('Select');

            if (!instance) {
                $element.data('Select', new Select(this, options));
            } else {
                if (typeof options === 'string') {
                    instance[options].call(instance, args);
                }
            }
        });
    };

})(jQuery);