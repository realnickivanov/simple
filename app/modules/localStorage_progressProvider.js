define(['context'], function (context) {

    var key = "course_progress" + context.course.id + context.course.createdOn;

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
            progress = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.log('Unable to restore progress from localStorage');
        }
        return progress;
    }

    function saveProgress(progress) {
        var string = JSON.stringify(progress);

        localStorage.setItem(key, string);
        console.log('Progress was saved (' + string.length + ' length):');
        console.dir(progress);
        return true;
    }

});