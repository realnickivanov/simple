define([], function () {

    var KEY = "LOCALSTORAGE_PROGRESS";

    var module = {
        initialize: initialize,

        progressProvider: {
            getProgress: getProgress,
            saveProgress: saveProgress
        }
    }

    return module;

    function initialize() {
        console.log('LocalStorage progress provider initialized');
    }

    function getProgress() {
        var progress = {};
        try {
            progress = JSON.parse(localStorage.getItem(KEY));
        } catch (e) {
            console.log('Unable to restore progress from localStorage');
        }
        return progress;
    }

    function saveProgress(progress) {

        localStorage.setItem(KEY, JSON.stringify(progress));
        console.log('Progress was saved:');
        console.dir(progress);
    }

});