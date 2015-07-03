define(['durandal/composition', 'translation'], function (composition, translation) {

    var blankInputSelector = '.blankInput,.blankSelect';

    ko.bindingHandlers.fillInTheBlankAnswers = {
        init: function (element, valueAccessor) {
            debugger
            var $element = $(element),
                
                    value = valueAccessor().inputValues(),
                    content = valueAccessor().content;
                    $element.html(content);
           debugger
            _.each(value, function (blank) {
                
                var source = $('[data-group-id=' + blank.id + ']', $element),
                    handler = function () {
                        
                        blank.value = source.val().trim();

                    };
                source.val(undefined)
                    .on('blur change', handler);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    source.off('blur change', handler);
                });

                handler();
            });
            var selects = $('.blankSelect');
            //selects.each(function () {
            ////    var option = $('<option />').text(translation.getTextByKey('[fill in the blank choose answer]')).val('').prependTo(this);
            //    $(this).val(option).trigger('change');
            //});
            //selects.each(function () {
            //    var self = this,
            //    options = [];

            //    _.each(_.rest(self.options, 1), function (option) {
            //        options.push(option);
            //    });
            //    $(self).wrap('<div class="select-wrapper"></div>');
            //    var $selectWrapper = $(self).parent('.select-wrapper');
            ////    var valueWrapper = $('<div class="value"></div>').text(translation.getTextByKey("[fill in the blank choose answer]")).appendTo($selectWrapper);

            //    $selectWrapper.on('click', function () {
            //        show($selectWrapper, options, function (newValue) {
            //            $(self).val(newValue).trigger('change');
            //            $(valueWrapper).text(newValue);
            //        });
            //    });
            //})


        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                value = valueAccessor().inputValues;
            
                
        }
    }

    var show = function ($element, options, callback) {
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
    composition.addBindingHandler('fillInTheBlankAnswers');

});