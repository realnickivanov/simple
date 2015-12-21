define([], function () {
    var lessProcessor = {
        init: init,
        colors: {}
    }

    return lessProcessor;

    function init(colors) {
        _.each(colors, function (pair) {
            lessProcessor.colors[pair.key] = pair.value;
        })

        return less.modifyVars(lessProcessor.colors);
    };

});