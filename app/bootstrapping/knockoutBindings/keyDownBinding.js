define(function () {

    ko.bindingHandlers.keyDown = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var value = valueAccessor();
            var handlers = value.handlers;

            $(element).bind('keydown', function (event) {
                if (_.isFunction(handlers[event.keyCode])) {
                    handlers[event.keyCode](viewModel);

                    event.preventDefault();
                    event.stopPropagation();
                }
            });
        }
    };
});