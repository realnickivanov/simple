define(['durandal/app'], function (app) {

    var
        self = {
            storage: null,
            progress: {}
        },
        context = {
            save: save,
            get: get,


            use: use,
            ready: ready,

            isSavedToStorage: ko.observable(null) 
        }
    ;


    app.on('question:answered').then(function (question) {
        try {
            self.progress[question.id] = question.progress();
            context.isSavedToStorage(false);
        } catch (e) {
            console.error(e);
        }
    });

    return context;

    function save() {

        if (!self.storage) {
            return;
        }

        self.storage.saveProgress(self.progress);
        context.isSavedToStorage(true);
    }

    function get() {
        return self.progress;
    }

    function use(storage) {
        if (_.isFunction(storage.getProgress) && _.isFunction(storage.saveProgress)) {
            self.storage = storage;
            self.progress = storage.getProgress() || {};

            window.onbeforeunload = function() {
                if (context.isSavedToStorage() === false) {
                    return 'Progress has not been saved!';
                }
            }
        } else {
            throw 'Cannot use this storage';
        }
    }

    function ready() {
        return !!self.storage;
    }


});
