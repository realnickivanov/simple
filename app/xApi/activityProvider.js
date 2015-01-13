define(['./models/actor', './models/statement', './models/activity', './models/activityDefinition', 'eventManager', './errorsHandler', './configuration/xApiSettings', './constants', './models/result', './models/score', './models/context', './models/contextActivities', './models/languageMap', './models/interactionDefinition', './utils/dateTimeConverter', './statementQueue', './eventDataBuilders/courseEventDataBuilder', './eventDataBuilders/questionEventDataBuilder', 'constants'],
    function (actorModel, statementModel, activityModel, activityDefinitionModel, eventManager, errorsHandler, xApiSettings, constants, resultModel, scoreModel, contextModel, contextActivitiesModel, languageMapModel, interactionDefinitionModel, dateTimeConverter, statementQueue, courseEventDataBuilder, questionEventDataBuilder, globalConstants) {

        "use strict";

        var subscriptions = [],
            activityProvider = {
                actor: null,
                activityName: null,
                activityUrl: null,

                init: init,
                createActor: createActor,
                rootCourseUrl: null,
                turnOffSubscriptions: turnOffSubscriptions,
                courseId: null
            };

        return activityProvider;

        function init(courseId, actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.activityUrl = activityUrl;
                activityProvider.rootCourseUrl = activityUrl !== undefined ? activityUrl.split("?")[0].split("#")[0] : '';
                activityProvider.courseId = courseId;

                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseStarted).then(enqueueCourseStarted));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseFinished).then(enqueueCourseFinished));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.learningContentExperienced).then(learningContentExperienced));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(enqueueAnsweredQuestionsStatements));
            });
        }

        function turnOffSubscriptions() {
            _.each(subscriptions, function (subscription) {
                if (!_.isNullOrUndefined(subscription && subscription.off)) {
                    subscription.off();
                }
            });
        }

        function pushStatementIfSupported(statement) {
            if (_.contains(xApiSettings.xApi.allowedVerbs, statement.verb.display[xApiSettings.defaultLanguage])) {
                statementQueue.enqueue(statement);
            }
        }

        function enqueueCourseStarted() {
            pushStatementIfSupported(createStatement(constants.verbs.started));
        }

        function enqueueCourseFinished(course) {
            var finishedEventData = courseEventDataBuilder.buildCourseFinishedEventData(course);

            if (_.isUndefined(finishedEventData) || _.isUndefined(finishedEventData.result)) {
                throw errorsHandler.errors.notEnoughDataInSettings;
            }

            enqueueObjectivesFinishedStatement(finishedEventData);

            var result = new resultModel({
                score: new scoreModel(finishedEventData.result)
            });

            var resultVerb = finishedEventData.isCompleted ? xApiSettings.scoresDistribution.positiveVerb : constants.verbs.failed;
            pushStatementIfSupported(createStatement(resultVerb, result));
            pushStatementIfSupported(createStatement(constants.verbs.stopped));

            var dfd = Q.defer();

            statementQueue.statements.subscribe(function (newValue) {
                if (newValue.length === 0) {
                    dfd.resolve();
                }
            });

            // (^\ x_x /^)
            statementQueue.enqueue(undefined);

            return dfd.promise;
        }

        function enqueueObjectivesFinishedStatement(finishedEventData) {
            if (!_.isUndefined(finishedEventData.objectives) && _.isArray(finishedEventData.objectives) && finishedEventData.objectives.length > 0) {
                _.each(finishedEventData.objectives, function (objective) {
                    var objectiveUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
                    var statement = createStatement(constants.verbs.mastered, new resultModel({ score: new scoreModel(objective.score / 100) }), createActivity(objectiveUrl, objective.title));
                    pushStatementIfSupported(statement);
                });
            }
        }

        function learningContentExperienced(question, spentTime) {

            var eventData = questionEventDataBuilder.buildLearningContentExperiencedEventData(question, spentTime);

            var objective = eventData.objective;

            var result = new resultModel({
                duration: dateTimeConverter.timeToISODurationString(eventData.spentTime)
            });

            var learningContentUrl = activityProvider.rootCourseUrl + '#objective/' + objective.id + '/question/' + question.id + '?learningContents';
            var parentUrl = activityProvider.rootCourseUrl + '#objective/' + objective.id + '/question/' + question.id;
            var groupingUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var object = createActivity(learningContentUrl, question.title);

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, question.title)],
                    grouping: [createActivity(groupingUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.experienced, result, object, context));
        }

        function enqueueAnsweredQuestionsStatements(question) {

            var eventData = null;
            try {


                switch (question.type) {
                    case globalConstants.questionTypes.multipleSelect:
                    case globalConstants.questionTypes.singleSelectText:
                        eventData = questionEventDataBuilder.buildSingleSelectTextQuestionSubmittedEventData(question);
                        eventData.answers = question.answers;
                        break;
                    case globalConstants.questionTypes.dragAndDrop:

                        eventData = questionEventDataBuilder.buildDragAndDropTextQuestionSubmittedEventData(question);
                        eventData.background = question.background;
                        eventData.dropspots = question.dropspots;
                        break;
                    case globalConstants.questionTypes.fillInTheBlank:
                        eventData = questionEventDataBuilder.buildFillInQuestionSubmittedEventData(question);
                        eventData.answerGroups = question.answerGroups;
                        break;
                    case globalConstants.questionTypes.singleSelectImage:
                        eventData = questionEventDataBuilder.buildSingleSelectImageQuestionSubmittedEventData(question);
                        eventData.correctAnswerId = question.correctAnswerId;
                        eventData.answers = question.answers;
                        break;
                    case globalConstants.questionTypes.textMatching:
                        eventData = questionEventDataBuilder.buildTextMatchingQuestionSubmittedEventData(question);
                        eventData.answers = question.answers;
                        break;
                    case globalConstants.questionTypes.statement:
                        eventData = questionEventDataBuilder.buildStatementQuestionSubmittedEventData(question);
                        eventData.statements = question.answers;
                        break;
                    case globalConstants.questionTypes.hotspot:
                        eventData = questionEventDataBuilder.buildHotspotQuestionSubmittedEventData(question);
                        eventData.statements = question.answers;
                        eventData.spots = question.spots;
                        eventData.isMultiple = question.isMultiple;
                        eventData.background = question.background;
                        break;
                }

                if (eventData == null) {
                    return;
                }

                switch (eventData.type) {
                    case constants.interactionTypes.choice:
                        enqueueSingleSelectTextQuestionAnsweredStatement(eventData);
                        break;
                    case constants.interactionTypes.fillIn:
                        enqueueFillInQuestionAnsweredStatement(eventData);
                        break;
                    case constants.interactionTypes.dragAndDrop:
                        enqueueDragAndDropTextQuestionAnsweredStatement(eventData);
                        break;
                    case constants.interactionTypes.hotspot:
                        enqueueHotSpotQuestionAnsweredStatement(eventData);
                        break;
                    case constants.interactionTypes.matching:
                        enqueueMatchingQuestionAnsweredStatement(eventData);
                        break;
                }
            } catch (e) {
                debugger;
            }
        }

        function enqueueSingleSelectTextQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: question.selectedAnswersIds.toString()
            });

            var object = new activityModel({
                id: questionUrl,
                definition: new interactionDefinitionModel({
                    name: new languageMapModel(question.title),
                    interactionType: constants.interactionTypes.choice,
                    correctResponsesPattern: [question.correctAnswersIds.join("[,]")],
                    choices: _.map(question.answers, function (item) {
                        return {
                            id: item.id,
                            description: new languageMapModel(item.text)
                        };
                    })
                })
            });

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueFillInQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: question.enteredAnswersTexts.toString()
            });

            var object = new activityModel({
                id: questionUrl,
                definition: new interactionDefinitionModel({
                    name: new languageMapModel(question.title),
                    interactionType: constants.interactionTypes.fillIn,
                    correctResponsesPattern: [question.correctAnswersTexts.join("[,]")]
                })
            });

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueHotSpotQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: question.placedMarkers.join("[,]")
            });

            var object = new activityModel({
                id: questionUrl,
                definition: new interactionDefinitionModel({
                    name: new languageMapModel(question.title),
                    interactionType: constants.interactionTypes.other,
                    correctResponsesPattern: [question.spots.join("[,]")]
                })
            });

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });
            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueDragAndDropTextQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: question.enteredAnswersTexts.join("[,]")
            });

            var object = new activityModel({
                id: questionUrl,
                definition: new interactionDefinitionModel({
                    name: new languageMapModel(question.title),
                    interactionType: constants.interactionTypes.other,
                    correctResponsesPattern: [question.correctAnswersTexts.join("[,]")]
                })
            });

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueMatchingQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = new resultModel({
                score: new scoreModel(question.score / 100),
                response: _.map(question.answers, function (answer) {
                    return answer.key.toLowerCase() + "[.]" + (answer.attemptedValue ? answer.attemptedValue.toLowerCase() : "");
                }).join("[,]")
            });

            var object = new activityModel({
                id: questionUrl,
                definition: new interactionDefinitionModel({
                    name: new languageMapModel(question.title),
                    interactionType: constants.interactionTypes.matching,
                    correctResponsesPattern: [_.map(question.answers, function (answer) {
                        return answer.key.toLowerCase() + "[.]" + answer.value.toLowerCase();
                    }).join("[,]")],
                    source: _.map(question.answers, function (answer) {
                        return { id: answer.key.toLowerCase(), description: new languageMapModel(answer.key) }
                    }),
                    target: _.map(question.answers, function (answer) {
                        return { id: answer.value.toLowerCase(), description: new languageMapModel(answer.value) }
                    })
                })
            });

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

            var context = createContextModel({
                contextActivities: new contextActivitiesModel({
                    parent: [createActivity(parentUrl, objective.title)]
                })
            });

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function createActor(name, email) {
            var actor = {};

            try {
                actor = actorModel({
                    name: name,
                    mbox: 'mailto:' + email
                });
            } catch (e) {
                errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
            }

            return actor;
        }

        function createActivity(id, name) {
            return activityModel({
                id: id || activityProvider.activityUrl,
                definition: new activityDefinitionModel({
                    name: new languageMapModel(name)
                })
            });
        }

        function createContextModel(contextSpec) {
            contextSpec = contextSpec || {};
            var contextExtensions = contextSpec.extensions || {};
            contextExtensions[constants.extenstionKeys.courseId] = activityProvider.courseId;
            contextSpec.extensions = contextExtensions;

            return new contextModel(contextSpec);
        }

        function createStatement(verb, result, activity, context) {
            var activityData = activity || createActivity(null, activityProvider.activityName);
            context = context || createContextModel();

            return statementModel({
                actor: activityProvider.actor,
                verb: verb,
                object: activityData,
                result: result,
                context: context
            });
        }
    }
);