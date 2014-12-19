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
        self.progress[question.id] = question.progress();
    });

    //eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(function (data) {
    //    var question = data.question;
    //    if (question.score === 100) {
    //        self.progress[question.id] = 100;
    //    } else {
    //        switch (data.type) {
    //            case 'choice':
    //                self.progress[question.id] = question.selectedAnswersIds;
    //                break;
    //            case 'fill-in':

    //                break;
    //            case "dragAndDrop":

    //                break;
    //            case "hotspot":

    //                break;
    //            case "matching":
    //                self.progress[question.id] = _.chain(question.answers)
    //                    .filter(function (answer) {
    //                        return !!answer.attemptedValue;
    //                    })
    //                    .map(function (answer) {
    //                        return {
    //                            id: answer.id,
    //                            attemptedValue: answer.attemptedValue
    //                        }
    //                    }).value();

    //                break;
    //        }
    //    }
    //});


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
            self.progress = storage.getProgress();
        } else {
            throw 'Cannot use this storage';
        }
    }

    function ready() {
        return !!self.storage;
    }


});
