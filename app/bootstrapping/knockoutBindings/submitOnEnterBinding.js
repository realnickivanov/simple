define(function () {

    ko.bindingHandlers.submitOnEnter = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var $element = $(element),
                callback = valueAccessor();
            
            $element.keypress(function(e){
                if(e.which == 13){
                    e.preventDefault();
                    if(typeof callback === 'function'){
                        callback.call(viewModel)
                    }
                }
            });
        }
    };
});