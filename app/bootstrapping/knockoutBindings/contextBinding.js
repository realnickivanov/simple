define([], function () {

    ko.bindingHandlers.context = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            viewModel.__context__ = element.getContext('2d');
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var callback = ko.utils.unwrapObservable(allBindingsAccessor().contextCallback);
            callback.call(viewModel, viewModel.__context__);
        }
    };
});