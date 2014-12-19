define(['eventManager', 'constants'], function (eventManager, constants) {

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


    eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(function (data) {
        var question = data.question;
        if (question.score === 100) {
            self.progress[question.id] = 100;
        } else {
            switch (data.type) {
                case 'choice':
                    self.progress[question.id] = question.selectedAnswersIds;
                    break;
                case 'fill-in':

                    break;
                case "dragAndDrop":

                    break;
                case "hotspot":

                    break;
                case "matching":
                    self.progress[question.id] = _.chain(question.answers)
                        .filter(function (answer) {
                            return !!answer.attemptedValue;
                        })
                        .map(function (answer) {
                            return {
                                id: answer.id,
                                attemptedValue: answer.attemptedValue
                            }
                        }).value();

                    break;
            }
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

        if (!self.storage) {
            return;
        }

        return self.storage.getProgress();
    }

    function use(storage) {
        if (_.isFunction(storage.getProgress) && _.isFunction(storage.saveProgress)) {
            self.storage = storage;
        } else {
            throw 'Cannot use this storage';
        }
    }

    function ready() {
        return !!self.storage;
    }


});
