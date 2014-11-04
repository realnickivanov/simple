define(['modulesInitializer'], function (modulesInitializer) {

    return {
        activate: function () {
            return modulesInitializer.init();
        }
    };
});