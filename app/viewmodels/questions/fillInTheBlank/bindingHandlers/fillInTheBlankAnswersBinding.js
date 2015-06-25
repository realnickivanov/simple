define(['durandal/composition', 'translation'], function (composition, translation) {

    var blankInputSelector = '.blankInput,.blankSelect';

    ko.bindingHandlers.fillInTheBlankAnswers = {
        init: function (element, valueAccessor) {
            var
                $element = $(element),
                htmlContent = valueAccessor().content,
                blankValues = valueAccessor().inputValues(),
                disabled = valueAccessor().disabled();
            $element.html(htmlContent);
            $(blankInputSelector, $element).each(function (index, blankItem) {
                var
                    $blankItem = $(blankItem),
                    blankId = $blankItem.data('group-id'),
                    blankValue = _.find(blankValues, function (blank) {
                        return blank.id == blankId;
                    });

                if ($blankItem.is('input')) {
                    $(this).on('change', function () {
                        blankValue.value=$(this).val()
                    })
                } else if ($blankItem.is('select')) {
                    var self = this,
                        
                options = []; 
                var option = $('<option selected />').text(translation.getTextByKey('[fill in the blank choose answer]')).prependTo(self);

                    _.each(_.rest(self.options, 1), function (option) {
                        options.push(option);
                    });
                    $(self).wrap('<div class="select-wrapper"></div>');
                    var $selectWrapper = $(self).parent('.select-wrapper');
                  
                    var valueWrapper = $('<div class="value"></div>').text($(self).val()).appendTo($selectWrapper);
                    $selectWrapper.on('click', function () {
                        show($selectWrapper, options, function (newValue) {
                            $(self).val(newValue);
                            $(valueWrapper).text(newValue);
                            blankValue.value = newValue;
                        });
                    });
                }
            });
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