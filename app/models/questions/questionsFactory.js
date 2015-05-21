define(['guard', 'constants', 'models/learningContent', 'models/questions/multipleSelectQuestion', 'models/questions/fillInTheBlankQuestion', 'models/questions/dragAndDropQuestion', 'models/questions/singleSelectImageQuestion', 'models/questions/textMatchingQuestion', 'models/questions/informationContent', 'models/questions/statementQuestion', 'models/questions/hotspot', 'models/questions/openQuestion'],
    function (guard, constants, LearningContent, MultipleSelectQuestion, FillInTheBlankQuestion, DragAndDropQuestion, SingleSelectImageQuestion, TextMatchingQuestion, InformationContent, StatementQuestion, Hotspot, OpenQuestion) {
        "use strict";

        var index = 0;

        return {
            createQuestion: createQuestion
        };

        function createQuestion(objectiveId, question) {
            guard.throwIfNotString(objectiveId, 'ObjectiveId is invalid');
            guard.throwIfNotAnObject(question, 'Question data is invalid');
            guard.throwIfNotString(question.type, 'Question type is invalid');
            var questionData = {
                id: question.id,
                shortId: index++,
                objectiveId: objectiveId,
                title: question.title,
                type: question.type,
                learningContents: _.map(question.learningContents, function (learningContent) {
                    return new LearningContent({ id: learningContent.id });
                }),
                score: 0,
                hasContent: question.hasContent,
                hasCorrectFeedback: question.hasCorrectFeedback,
                hasIncorrectFeedback: question.hasIncorrectFeedback
            };

            switch (question.type) {
                case constants.questionTypes.multipleSelect:
                case constants.questionTypes.singleSelectText:
                    questionData.answers = question.answers;
                    return new MultipleSelectQuestion(questionData);
                case constants.questionTypes.dragAndDrop:
                    questionData.background = question.background;
                    questionData.dropspots = question.dropspots;
                    return new DragAndDropQuestion(questionData);
                case constants.questionTypes.fillInTheBlank:
                    questionData.answerGroups = question.answerGroups;
                    return new FillInTheBlankQuestion(questionData);
                case constants.questionTypes.singleSelectImage:
                    questionData.correctAnswerId = question.correctAnswerId;
                    questionData.answers = question.answers;
                    return new SingleSelectImageQuestion(questionData);
                case constants.questionTypes.textMatching:
                    questionData.answers = question.answers;
                    return new TextMatchingQuestion(questionData);
                case constants.questionTypes.informationContent:
                    return new InformationContent(questionData);
                case constants.questionTypes.statement:
                    questionData.statements = question.answers;
                    return new StatementQuestion(questionData);
                case constants.questionTypes.hotspot:
                    questionData.spots = question.spots;
                    questionData.isMultiple = question.isMultiple;
                    questionData.background = question.background;
                    return new Hotspot(questionData);
                case constants.questionTypes.openQuestion:
                    return new OpenQuestion(questionData);
                default:
                    questionData.answers = question.answers;
                    return new MultipleSelectQuestion(questionData);
            }
        }

    });