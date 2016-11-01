define(function () {
    'use strict';

    return {
        init: function(settings){
            for (var key in settings){
                this[key] = settings[key]; 
            }
        }
    };
});
