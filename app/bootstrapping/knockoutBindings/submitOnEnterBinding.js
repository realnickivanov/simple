define(function () {

    ko.bindingHandlers.submitOnEnter = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var $element = $(element),
                callback = valueAccessor();
            
            $element.keydown(function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (typeof callback === 'function') {
                        callback.call(viewModel);
                    } else {
                        $element.click();
                    }
                }
            });
        }
    };
});