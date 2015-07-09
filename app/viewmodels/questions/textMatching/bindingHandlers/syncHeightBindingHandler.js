define(['knockout', 'durandal/composition'], function (ko, composition) {

    ko.bindingHandlers.syncHeight = {
        init: function (element) {
            var $element = $(element),
                handler = function () {
                    var height = 0;
                    $element.find('.text-matching-row').each(function () {
                        $(this).find('.text-matching-column').height('auto');
                        $(this).height('auto');

                        if ($(this).height() > height) {
                            height = $(this).height();
                        }
                    });
                    $element.find('.text-matching-row, .text-matching-column').each(function () {
                        $(this).height(height);
                    });

                },
                debounced = _.debounce(handler, 10);

            $(window).on('resize', debounced);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(window).off('resize', debounced);
            });

            handler();
        }
    };

    composition.addBindingHandler('syncHeight');

});