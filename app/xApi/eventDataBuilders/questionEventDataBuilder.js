define(['guard', 'constants', 'repositories/objectiveRepository'], function (guard, constants, objectiveRepository) {
    "use strict";

    return {
        buildSingleSelectTextQuestionSubmittedEventData: buildSingleSelectTextQuestionSubmittedEventData,
        buildFillInQuestionSubmittedEventData: buildFillInQuestionSubmittedEventData,
        buildDragAndDropTextQuestionSubmittedEventData: buildDragAndDropTextQuestionSubmittedEventData,
        buildSingleSelectImageQuestionSubmittedEventData: buildSingleSelectImageQuestionSubmittedEventData,
        buildTextMatchingQuestionSubmittedEventData: buildTextMatchingQuestionSubmittedEventData,
        buildLearningContentExperiencedEventData: buildLearningContentExperiencedEventData,
        buildStatementQuestionSubmittedEventData: buildStatementQuestionSubmittedEventData,
        buildHotspotQuestionSubmittedEventData: buildHotspotQuestionSubmittedEventData
    };

    function buildSingleSelectTextQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "choice",
            question: {
                id: question.id,
                title: question.title,
                answers: _.map(question.answers, function (item) {
                    return {
                        id: item.id,
                        text: item.text
                    };
                }),
                score: question.score(),
                selectedAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isChecked;
                }),
                correctAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isCorrect;
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildFillInQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "fill-in",
            question: {
                id: question.id,
                title: question.title,
                score: question.score(),
                enteredAnswersTexts: _.map(question.answerGroups, function (item) {
                    return item.answeredText;
                }),
                correctAnswersTexts: _.flatten(_.map(question.answerGroups, function (item) {
                    return item.getCorrectText();
                }))
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildDragAndDropTextQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "dragAndDrop",
            question: {
                id: question.id,
                title: question.title,
                score: question.score(),
                enteredAnswersTexts: _.map(question.answers, function (item) {
                    return '(' + item.currentPosition.x + ',' + item.currentPosition.y + ')';
                }),
                correctAnswersTexts: _.map(question.answers, function (item) {
                    return '(' + item.correctPosition.x + ',' + item.correctPosition.y + ')';
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildHotspotQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "hotspot",
            question: {
                id: question.id,
                title: question.title,
                score: question.score(),
                spots: _.map(question.spots, function (spot) {
                    var polygonCoordinates = _.map(spot, function (spotCoordinates) {
                        return '(' + spotCoordinates.x + ',' + spotCoordinates.y + ')';
                    });
                    return polygonCoordinates.join("[.]");
                }),
                placedMarkers: _.map(question.placedMarks, function (mark) {
                    return '(' + mark.x + ',' + mark.y + ')';
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildSingleSelectImageQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "choice",
            question: {
                id: question.id,
                title: question.title,
                answers: _.map(question.answers, function (item) {
                    return {
                        id: item.id,
                        text: item.image
                    };
                }),
                score: question.score(),
                selectedAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isChecked;
                }),
                correctAnswersIds: [question.correctAnswerId]
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildStatementQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "choice",
            question: {
                id: question.id,
                title: question.title,
                answers: _.map(question.statements, function (item) {
                    return {
                        id: item.id,
                        text: item.text
                    };
                }),
                score: question.score(),
                selectedAnswersIds: _.chain(question.statements).filter(function (statement) {
                    return !_.isNullOrUndefined(statement.userAnswer);
                }).map(function (statement) {
                    return statement.id + '[.]' + statement.userAnswer;
                }).value(),
                correctAnswersIds: _.map(question.statements, function (item) {
                    return item.id + '[.]' + item.isCorrect;
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }


    function buildTextMatchingQuestionSubmittedEventData(question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            type: "matching",
            question: {
                id: question.id,
                title: question.title,
                answers: question.answers,
                score: question.score(),
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    }

    function buildLearningContentExperiencedEventData(question, spentTime) {
        guard.throwIfNotAnObject(question, 'Question is not an object');
        guard.throwIfNotNumber(spentTime, 'SpentTime is not a number');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            objective: {
                id: objective.id,
                title: objective.title
            },
            question: {
                id: question.id,
                title: question.title
            },
            spentTime: spentTime
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

});