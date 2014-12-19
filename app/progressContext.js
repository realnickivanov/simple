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
            ready: ready
        }
    ;


    app.on('question:answered').then(function (question) {
        try {
            self.progress[question.id] = question.progress();
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
    }

    function get() {
        return self.progress;
    }

    function use(storage) {
        if (_.isFunction(storage.getProgress) && _.isFunction(storage.saveProgress)) {
            self.storage = storage;
            self.progress = storage.getProgress() || {};
        } else {
            throw 'Cannot use this storage';
        }
    }

    function ready() {
        return !!self.storage;
    }


});
