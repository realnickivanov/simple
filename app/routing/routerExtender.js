define(['plugins/router'], function (router) {
    "use strict";

    function execute() {

        router.isNavigationLocked = ko.observable(false);

        router.activeInstruction.subscribe(function (instruction) {
            if (_.isObject(instruction)) {
                var lock = instruction.queryParams
                    && instruction.queryParams.lock
                    && instruction.queryParams.lock.toLowerCase() == "true";

                router.isNavigationLocked(lock);
            }
        });

    }

    return {
        execute: execute
    };
})