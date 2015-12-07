define([], function () {
    return {
        init: init
    }

    function init(colors) {
        less.modifyVars(colors);
    }

});