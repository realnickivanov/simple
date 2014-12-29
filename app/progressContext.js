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
            ready: ready,

            isDirty: null 
        }
    ;

    app.on('user:authenticated').then(function (user) {
        self.progress.user = user;
        setProgressDirty(true);
    });

    app.on('user:authentication-skipped').then(function () {
        self.progress.user = 0;
        setProgressDirty(true);
    });

    app.on('question:answered').then(function (question) {
        try {
            self.progress.answers[question.id] = question.progress();
            setProgressDirty(true);
        } catch (e) {
            console.error(e);
        }
    });

    router.on('router:navigation:composition-complete', function (obj, instruction) {
        self.progress.url = instruction.fragment;
        setProgressDirty(true);
    });

    return context;

    function setProgressDirty(isDirty) {
        context.isDirty = isDirty;
        app.trigger('progressContext:dirty:changed', isDirty);
    }

    function save() {

        if (!self.storage) {
            return;
        }

        self.storage.saveProgress(self.progress);
        setProgressDirty(false);
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
            
            window.onbeforeunload = function() {
                if (context.isDirty === true) {
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
