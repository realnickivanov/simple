define(['knockout'], function(ko) {
    
    ko.bindingHandlers.draggable = {
        init: function (element) {
            $(element).draggable({
                containment: 'body',
                tolerance: 'pointer',
                revert: true,
                revertDuration: 0
            });
        }
    }

})