define(['./models/actor', './models/statement', './models/activity', './models/activityDefinition', 'eventManager', './errorsHandler', './configuration/xApiSettings', './constants', './models/result', './models/score', './models/context', './models/contextActivities', './models/languageMap', './models/interactionDefinition', './utils/dateTimeConverter', './statementQueue', 'constants', 'guard', 'repositories/objectiveRepository', 'progressContext'],
    function (actorModel, statementModel, activityModel, activityDefinitionModel, eventManager, errorsHandler, xApiSettings, constants, resultModel, scoreModel, contextModel, contextActivitiesModel, languageMapModel, interactionDefinitionModel, dateTimeConverter, statementQueue, globalConstants, guard, objectiveRepository, progressContext) {

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
            },
            sessionId = null;

        return activityProvider;

        function init(courseId, actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                sessionId = progressContext.get().attemptId;

                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.activityUrl = activityUrl;
                activityProvider.rootCourseUrl = activityUrl !== undefined ? activityUrl.split("?")[0].split("#")[0] : '';
                activityProvider.courseId = courseId;

                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseStarted).then(enqueueCourseStarted));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseFinished).then(enqueueCourseFinished));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.learningContentExperienced).then(enqueueLearningContentExperienced));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(enqueueQuestionAnsweredStatement));
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
            guard.throwIfNotAnObject(course, 'Course is not an object');

            if (_.isArray(course.objectives)) {
                _.each(course.objectives, function (objective) {
                    if (_.isArray(objective.questions)) {
                        _.each(objective.questions, function (question) {
                            if (!question.isAnswered) {
                                enqueueQuestionAnsweredStatement(question);
                            }
                        });
                    }

                    var objectiveUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
                    var score = objective.affectProgress ? new scoreModel(objective.score() / 100) : undefined;
                    var statement = createStatement(constants.verbs.mastered, new resultModel({ score: score }), createActivity(objectiveUrl, objective.title));
                    pushStatementIfSupported(statement);
                });
            }

            var result = new resultModel({
                score: new scoreModel(course.result())
            });

            var resultVerb = course.isCompleted() ? xApiSettings.scoresDistribution.positiveVerb : constants.verbs.failed;
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

        function enqueueLearningContentExperienced(question, spentTime) {
            pushStatementIfSupported(getLearningContentExperiencedStatement(question, spentTime));
        }

        function enqueueQuestionAnsweredStatement(question) {

            try {
                guard.throwIfNotAnObject(question, 'Question is not an object');

                var objective = objectiveRepository.get(question.objectiveId);
                guard.throwIfNotAnObject(objective, 'Objective is not found');


                var parts = null;

                switch (question.type) {
                    case globalConstants.questionTypes.multipleSelect:
                    case globalConstants.questionTypes.singleSelectText:
                        parts = getSingleSelectTextQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.fillInTheBlank:
                        parts = getFillInQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.singleSelectImage:
                        parts = getSingleSelectImageQuestionAcitivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.statement:
                        parts = getStatementQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.dragAndDrop:
                        parts = getDragAndDropTextQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.textMatching:
                        parts = getMatchingQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.hotspot:
                        parts = getHotSpotQuestionActivityAndResult(question);
                        break;
                    case globalConstants.questionTypes.openQuestion:
                        parts = getOpenQuestionActivityAndResult(question);
                        break;
                }

                var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;

                var context = createContextModel({
                    contextActivities: new contextActivitiesModel({
                        parent: [createActivity(parentUrl, objective.title)]
                    })
                });

                if (parts) {
                    var statement = createStatement(constants.verbs.answered, parts.result, parts.object, context);;
                    if (statement) {
                        pushStatementIfSupported(statement);
                    }
                }

            } catch (e) {
                console.error(e);
            }
        }

        function getSingleSelectTextQuestionActivityAndResult(question) {
            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: getItemsIds(question.answers, function (item) {
                        return item.isChecked;
                    }).toString()
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.choice,
                        correctResponsesPattern: [
                            getItemsIds(question.answers, function (item) {
                                return item.isCorrect;
                            }).join("[,]")
                        ],
                        choices: _.map(question.answers, function (item) {
                            return {
                                id: item.id,
                                description: new languageMapModel(item.text)
                            };
                        })
                    })
                })
            };
        }

        function getStatementQuestionActivityAndResult(question) {
            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: _.chain(question.statements).filter(function (statement) {
                        return !_.isNullOrUndefined(statement.userAnswer);
                    }).map(function (statement) {
                        return statement.id + '[.]' + statement.userAnswer;
                    }).value().join("[,]")
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.choice,
                        correctResponsesPattern: [
                            _.map(question.statements, function (item) {
                                return item.id + '[.]' + item.isCorrect;
                            }).join("[,]")
                        ],
                        choices: _.map(question.statements, function (item) {
                            return {
                                id: item.id,
                                description: new languageMapModel(item.text)
                            };
                        })
                    })
                })
            };
        }

        function getSingleSelectImageQuestionAcitivityAndResult(question) {

            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: getItemsIds(question.answers, function (item) {
                        return item.isChecked;
                    }).toString()
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.choice,
                        correctResponsesPattern: [[question.correctAnswerId].join("[,]")],
                        choices: _.map(question.answers, function (item) {
                            return {
                                id: item.id,
                                description: new languageMapModel(item.image)
                            };
                        })
                    })
                })
            };

        }

        function getFillInQuestionActivityAndResult(question) {
            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: _.map(question.answerGroups, function (item) {
                        return item.answeredText;
                    }).toString()
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.fillIn,
                        correctResponsesPattern: [
                            _.flatten(_.map(question.answerGroups, function (item) {
                                return item.getCorrectText();
                            })).join("[,]")
                        ]
                    })
                })
            };
        }

        function getHotSpotQuestionActivityAndResult(question) {

            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: _.map(question.placedMarks, function (mark) {
                        return '(' + mark.x + ',' + mark.y + ')';
                    }).join("[,]")
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.other,
                        correctResponsesPattern: [_.map(question.spots, function (spot) {
                            var polygonCoordinates = _.map(spot, function (spotCoordinates) {
                                return '(' + spotCoordinates.x + ',' + spotCoordinates.y + ')';
                            });
                            return polygonCoordinates.join("[.]");
                        }).join("[,]")]
                    })
                })
            }
        }

        function getDragAndDropTextQuestionActivityAndResult(question) {
            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: _.map(question.answers, function (item) {
                        return '(' + item.currentPosition.x + ',' + item.currentPosition.y + ')';
                    }).join("[,]")
                }),

                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.other,
                        correctResponsesPattern: [_.map(question.answers, function (item) {
                            return '(' + item.correctPosition.x + ',' + item.correctPosition.y + ')';
                        }).join("[,]")]
                    })
                })
            }
        }

        function getMatchingQuestionActivityAndResult(question) {

            return {
                result: new resultModel({
                    score: new scoreModel(question.score() / 100),
                    response: _.map(question.answers, function (answer) {
                        return answer.key.toLowerCase() + "[.]" + (answer.attemptedValue ? answer.attemptedValue.toLowerCase() : "");
                    }).join("[,]")
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
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
                })
            };

        }

        function getOpenQuestionActivityAndResult(question) {
            return {
                result: new resultModel({
                    response: question.answeredText
                }),
                object: new activityModel({
                    id: activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id,
                    definition: new interactionDefinitionModel({
                        name: new languageMapModel(question.title),
                        interactionType: constants.interactionTypes.other
                    })
                })
            };
        }

        function getItemsIds(items, filter) {
            return _.chain(items)
               .filter(function (item) {
                   return filter(item);
               })
               .map(function (item) {
                   return item.id;
               }).value();
        }


        function getLearningContentExperiencedStatement(question, spentTime) {
            guard.throwIfNotAnObject(question, 'Question is not an object');
            guard.throwIfNotNumber(spentTime, 'SpentTime is not a number');

            var objective = objectiveRepository.get(question.objectiveId);
            guard.throwIfNotAnObject(objective, 'Objective is not found');

            var result = new resultModel({
                duration: dateTimeConverter.timeToISODurationString(spentTime)
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

            return createStatement(constants.verbs.experienced, result, object, context);
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
            contextSpec.registration = sessionId;

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