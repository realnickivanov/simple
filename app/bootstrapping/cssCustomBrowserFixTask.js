define(function () {
    "use strict";

    var task = {
        execute: execute
    };

    var mainFolder = 'css/';

    var browsers = {
        ie: {
            pattern: /MSIE|Trident\//i,
            css: 'ie.css'
        },
        edge: {
            pattern: /Edge/i,
            css: 'edge.css'
        },
    };

    return task;

    function execute() {
        for(var key in browsers) {
            var browser = browsers[key];

            if(browser.pattern.test(navigator.userAgent)) {
                addStyle(browser.css);
            }
        }
    }

    function addStyle(name) {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');

        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = mainFolder + name;
        link.media = 'all';

        head.appendChild(link);
    }

});