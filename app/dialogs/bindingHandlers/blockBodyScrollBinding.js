define(['knockout'], function (ko) {
    'use strict';
    
    ko.bindingHandlers.blockBodyScroll = {
        update: function (element, valueAccessor) {
            var isBlocked = ko.utils.unwrapObservable(valueAccessor()),
                $body = $('body');
            
            $body.css({
                'max-height': isBlocked ? '100vh' : 'none',
                'overflow': isBlocked ? 'hidden' : 'visible'
            });
        }
    };
})