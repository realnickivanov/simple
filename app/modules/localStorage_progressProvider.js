define(['context', 'constants'], function (context, constants) {
    var pregressKey = constants.localStorageProgressKey + context.course.id + context.course.createdOn,
        resultKey = constants.localStorageResultKey + context.course.id + context.course.createdOn;

    var module = {
        initialize: initialize,

        progressProvider: {
            getProgress: getProgress,
            saveProgress: saveProgress
        }
    }

    return module;

    function initialize() {
    }

    function getProgress() {
        var progress = {};
        try {
            progress = JSON.parse(localStorage.getItem(pregressKey));
        } catch (e) {
            console.log('Unable to restore progress from localStorage');
        }
        return progress;
    }

    function saveProgress(progress) {
        var result = {
            score: context.course.score(),
            status: context.course.getStatus()
        };

        localStorage.setItem(resultKey, JSON.stringify(result));
        localStorage.setItem(pregressKey, JSON.stringify(progress));
        return true;
    }
});