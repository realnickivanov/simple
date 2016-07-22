define([], function () {
    var lessProcessor = {
        init: init,
        vars: {}
    }

    return lessProcessor;

    function init(colors, fonts) {
        clearLocalStorage();

        _.each(colors, function(pair) {
            if (!pair || !pair.value) {
                return;
            }
            lessProcessor.vars[pair.key] = pair.value;
        });

        _.each(fonts, function (obj) {
            var props = _.keys(obj);
            _.each(props, function (prop) {
                if (prop === 'key' || prop === 'isGeneralSelected') {
                    return;
                }

                if (prop === 'size') {
                    lessProcessor.vars['@' + obj.key + '-' + prop] = obj[prop] + 'px';
                }else{
                    lessProcessor.vars['@' + obj.key + '-' + prop] = obj[prop];
                }
            });
        });
        return less.modifyVars(lessProcessor.vars);
    };

    function clearLocalStorage() {
        if (!window.localStorage || !less) {
            return;
        }
        var host = window.location.host;
        var protocol = window.location.protocol;
        var keyPrefix = protocol + '//' + host + '/css/colors.css';

        for(var key in window.localStorage) {
            if (!window.localStorage.hasOwnProperty(key)) {
                continue;
            }
            if (key.indexOf(keyPrefix) === 0) {
               delete window.localStorage[key];
            }
        }
    }

});