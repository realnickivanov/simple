define(function () {

    ko.bindingHandlers.selectText = {
        init: function (element, valueAccessor) {
            var $element = $(element);
            
            $element.on('click', function(){
                this.select();
            });
        }
    };
});