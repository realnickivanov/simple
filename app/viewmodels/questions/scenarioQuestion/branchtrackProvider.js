define(function() {
    'use strict';

    var constants = {
        supportedEvents: {
            init: 'branchtrack:player:init',        //first time init
            start: 'branchtrack:player:start',      //start of playing, t.i. before first scene appear, including on restart
            scene: 'branchtrack:player:scene',      //new scene shown
            choice: 'branchtrack:player:choice',    //user hit the choice
            finish: 'branchtrack:player:finish'     //user reached last scene
        },
        maxWidth: 800
    };


    var BranchtrackProvider = function (options) {

    };

    function subscribe() {
        window.addEventListener('message', branchtrackEventListener);
    }

    function unsubscribe() {
        window.removeEventListener('message', branchtrackEventListener);
    }

    function branchtrackEventListener(event) {
        var data = JSON.parse(event.data),
            messageType = data.type;

    }
});