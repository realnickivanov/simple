define(['durandal/app'],
    function (app) {

        var
            events = {
                courseStarted: "courseStarted",
                courseFinished: "courseFinished",
                courseFinalized: "courseFinalized",
                answersSubmitted: "answersSubmitted",
                learningContentExperienced: "learningContentExperienced"
            },

            turnAllEventsOff = function () {
                _.each(events, function (event) {
                    app.off(event);
                });
            },

            subscribeForEvent = function (event) {
                if (!events.hasOwnProperty(event)) {
                    throw 'Unsupported event';
                }

                return app.on(event);
            },

            unsubscribeForEvent = function(event, callback) {
                if (!events.hasOwnProperty(event)) {
                    throw 'Unsupported event';
                }

                return app.off(event, callback);
            },

            courseStarted = function (data) {
                app.trigger(events.courseStarted, data);
            },

            courseFinished = function (data, callback) {
                return executeAfterSubscribersDone(events.courseFinished, data, callback);
            },

            courseFinalized = function (callback) {
                return executeAfterSubscribersDone(events.courseFinalized, {}, callback);
            },

            answersSubmitted = function (data, sendParentProgress) {
                app.trigger(events.answersSubmitted, data, sendParentProgress);
            },
            
            learningContentExperienced = function (data, spentTime) {
                app.trigger(events.learningContentExperienced, data, spentTime);
            },
            
            executeAfterSubscribersDone = function (event, eventData, callback) {
                if (_.isNullOrUndefined(app.callbacks) || _.isNullOrUndefined(app.callbacks[event])) {
                    return Q.fcall(function () {
                        if (_.isFunction(callback)) {
                            callback();
                        }
                    });
                }

                var promises = [];
                _.each(app.callbacks[event], function (handler) {
                    if (_.isFunction(handler)) {
                        var promise = handler(eventData);

                        if (Q.isPromise(promise)) {
                            promises.push(promise);
                        }
                    }
                });

                return Q.all(promises).then(function () {
                    if (_.isFunction(callback)) {
                        callback();
                    }
                });
            };

        return {
            events: events,
            turnAllEventsOff: turnAllEventsOff,
            subscribeForEvent: subscribeForEvent,
            unsubscribeForEvent: unsubscribeForEvent,

            courseStarted: courseStarted,
            courseFinished: courseFinished,
            courseFinalized: courseFinalized,
            answersSubmitted: answersSubmitted,
            learningContentExperienced: learningContentExperienced
        };
    }
);