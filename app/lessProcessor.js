define([], function () {
    return {
        init: init
    }


    function init(colors) {
        var colorsObj = {};
        _.each(colors, function (pair) {
            colorsObj[pair.key] = pair.value
        })

        return less.modifyVars(colorsObj);
    }

});