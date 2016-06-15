define(['knockout'], function (ko) {
    'use strict';
    
    ko.bindingHandlers.heightAnimation = {
        update: function (element, valueAccessor) {
            var $element = $(element),
                isVisible = valueAccessor();
                
            if (isVisible()){
                $element.slideDown();
            } else {
                $element.slideUp();
            }
        }
    };
})