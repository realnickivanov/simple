define(['durandal/app', 'plugins/router', 'translation', 'context'], function (app, router, translation, dataContext) {

    var
        self = {
            storage: null,
            progress: {
                _v: 1,
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
            self.progress.answers[question.shortId] = question.progress();
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

        if (self.storage.saveProgress(self.progress)) {
            setProgressDirty(false);
        } else {
            alert(translation.getTextByKey('[course progress cannot be saved]'));
        }
    }

    function get() {
        return self.progress;
    }

    function use(storage) {
        if (_.isFunction(storage.getProgress) && _.isFunction(storage.saveProgress)) {

            self.storage = storage;
            self.progress._v = dataContext.course.createdOn.getTime();

            var progress = self.storage.getProgress();
            if (!_.isEmpty(progress) && progress._v === self.progress._v) {
                self.progress = progress;
            }

            window.onbeforeunload = function () {
                if (context.isDirty === true) {
                    return translation.getTextByKey('[progress not saved]');
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
