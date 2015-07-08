define(['durandal/composition', 'translation', 'customSelect'], function (composition, translation, customSelect) {
    ko.bindingHandlers.fillInTheBlankAnswers = {
        init: function (element, valueAccessor) {
            
            var $element = $(element),
                    value = valueAccessor().inputValues(),
                    content = valueAccessor().content;
                    $element.html(content);
                    customSelect.apply();
            $(".blankSelect").each(function () {
                var option = $('<option />').text(translation.getTextByKey('[fill in the blank choose answer]')).val('').prependTo(this);
                $(this).val(option).trigger('change');
            });
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
        },
        update: function () {
             

        }

    };

    composition.addBindingHandler('fillInTheBlankAnswers');

});