define(['durandal/app', 'plugins/router'], function (app, router) {

    var
        self = {
            storage: null,
            progress: {
                url: '',
                answers: {},
                user: null
            }
        },
        context = {
            save: save,
            get: get,


            use: use,
            ready: ready
        }
    ;


    app.on('user:authenticated').then(function (user) {
        self.progress.user = user;
    });

    app.on('user:authentication-skipped').then(function () {
        self.progress.user = 0;
    });

    app.on('question:answered').then(function (question) {
        try {
            self.progress.answers[question.id] = question.progress();
        } catch (e) {
            console.error(e);
        }
    });

    router.on('router:navigation:composition-complete', function (obj, instruction) {
        self.progress.url = instruction.fragment;
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
            var progress = storage.getProgress();
            if (progress) {
                self.progress = progress;
            }
        } else {
            throw 'Cannot use this storage';
        }
    }

    function ready() {
        return !!self.storage;
    }


});
