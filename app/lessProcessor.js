define([], function () {
    var lessProcessor = {
        init: init,
        vars: {}
    }

    return lessProcessor;

    function init(colors) {
        _.each(colors, function (pair) {
            lessProcessor.vars[pair.key] = pair.value;
        })

        return less.modifyVars(lessProcessor.vars);
    };

});