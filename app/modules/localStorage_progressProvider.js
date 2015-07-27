define(['context', 'constants', 'translation'], function (context, constants, translation) {
    var pregressKey = constants.localStorageProgressKey + context.course.id + context.course.createdOn,
        resultKey = constants.localStorageResultKey + context.course.id + context.course.createdOn;

    var module = {
        initialize: initialize,

        progressProvider: {
            getProgress: getProgress,
            saveProgress: saveProgress,
            removeProgress: removeProgress
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
        try {
            localStorage.setItem(resultKey, JSON.stringify(result));
            localStorage.setItem(pregressKey, JSON.stringify(progress));
        } catch (e) {
            alert(translation.getTextByKey('[not enough memory to save progress]'));
        }

        return true;
    }

    function removeProgress() {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.log('Unable to remove progress from localStorage');
        }
        return true;
    }
});