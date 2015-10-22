define(['knockout'], function(ko) {
    'use strict';
    var instance = null;

    return {
        isFinished: isFinished,
        destroy: destroy,
        reset: reset,
        init: init,
        score: getScore
    };

    function isFinished() {
        if (!_.isNullOrUndefined(instance)) {
            return instance.isFinished;
        }

        return false;
    }

    function destroy() {
        if (!_.isNullOrUndefined(instance)) {
            instance.destroy();
        }
    }

    function reset() {
        if (!_.isNullOrUndefined(instance)) {
            instance.reset();
        }
    }

    function getScore() {
        if (!_.isNullOrUndefined(instance)) {
            return instance.score;
        }

        return 0;
    }

    function init(instanceId) {
        if (!_.isEmptyOrWhitespace(instanceId)) {
            instance = Branchtrack.create(instanceId);
        }
    }
});