define(['knockout'], function (ko) {
    'use strict';

    ko.bindingHandlers.preventDefaultTouchEvent = {
        update: function (element, valueAccessor) {
            if(valueAccessor()) {
                element.addEventListener("touchmove", preventBehavior, false);
            }

            function preventBehavior(e) {
                e.preventDefault(); 
            };
        }
    };
});