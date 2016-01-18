define([], function () {
    var lessProcessor = {
        init: init,
        vars: {}
    }

    return lessProcessor;

    function init(colors) {

        clearLocalStorage();

        _.each(colors, function (pair) {
            lessProcessor.vars[pair.key] = pair.value;
        })

        return less.modifyVars(lessProcessor.vars);
    };

    function clearLocalStorage() {
        if (!window.localStorage || !less) {
            return;
        }
        var host = window.location.host;
        var protocol = window.location.protocol;
        var keyPrefix = protocol + '//' + host + '/css/colors.css';

        for (var key in window.localStorage) {
            if (key.indexOf(keyPrefix) === 0) {
                delete window.localStorage[key];
            }
        }
    }

});