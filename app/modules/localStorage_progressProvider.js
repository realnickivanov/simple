define(['context', 'constants', 'translation'], function (context, constants, translation) {
    var key = constants.localStorageProgressKey + context.course.id + context.course.createdOn;

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
            progress = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.log('Unable to restore progress from localStorage');
        }
        return progress;
    }

    function saveProgress(progress) {
        var string = JSON.stringify(progress);
        try {
            localStorage.setItem(key, string);
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