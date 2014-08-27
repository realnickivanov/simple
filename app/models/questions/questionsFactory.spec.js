define(['models/questions/questionsFactory'],
    function (questionsFactory) {
        "use strict";


        var
            constants = require('constants'),
            MultipleSelectQuestion = require('models/questions/multipleSelectQuestion'),
            DragAndDropQuestion = require('models/questions/dragAndDropQuestion'),
            FillInTheBlankQuestion = require('models/questions/fillInTheBlankQuestion'),
            SingleSelectImageQuestion = require('models/questions/singleSelectImageQuestion'),
            TextMatchingQuestion = require('models/questions/textMatchingQuestion'),
            InformationContent = require('models/questions/informationContent');


        describe('[questionsFactory]', function() {

            it('should be defined', function() {
                expect(questionsFactory).toBeDefined();
            });

            describe('createQuestion:', function() {

                it('should be function', function() {
                    expect(questionsFactory.createQuestion).toBeFunction();
                });

                var objectiveId;
                var questionData;

                describe('when objectiveId argument is null', function () {

                    beforeEach(function() {
                        objectiveId = null;
                        questionData = null;
                    });

                    it('should throw exception', function () {
                        var f = function () {
                            questionsFactory.createQuestion(objectiveId, questionData);
                        };

                        expect(f).toThrow('ObjectiveId is invalid');
                    });

                });

                describe('when question argument is null', function () {

                    beforeEach(function () {
                        objectiveId = '0';
                        questionData = null;
                    });

                    it('should throw exception', function () {
                        var f = function () {
                            questionsFactory.createQuestion(objectiveId, questionData);
                        };

                        expect(f).toThrow('Question data is invalid');
                    });

                });

                describe('when question argument is not object', function () {

                    beforeEach(function () {
                        objectiveId = '0';
                        questionData = '';
                    });

                    it('should throw exception', function () {
                        var f = function () {
                            questionsFactory.createQuestion(objectiveId, questionData);
                        };

                        expect(f).toThrow('Question data is invalid');
                    });

                });

                describe('when question argument is object', function () {

                    beforeEach(function () {
                        objectiveId = '0';
                        questionData = {};
                    });

                    describe('when question.type is not defined', function () {

                        it('should throw exception', function () {
                            var f = function () {
                                questionsFactory.createQuestion(objectiveId, questionData);
                            };

                            expect(f).toThrow('Question type is invalid');
                        });

                    });

                    describe('when question.type is defined', function() {

                        describe('and when question.type = ' + constants.questionTypes.multipleSelect, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.multipleSelect;
                            });

                            it('should define \'multiple select\' question', function() {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof MultipleSelectQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.fillInTheBlank, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.fillInTheBlank;
                            });

                            it('should define \'fill in the blank\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof FillInTheBlankQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.dragAndDrop, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.dragAndDrop;
                            });

                            it('should define \'drag and drop\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof DragAndDropQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.singleSelectText, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.singleSelectText;
                            });

                            it('should define \'multiple select text\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof MultipleSelectQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.singleSelectImage, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.singleSelectImage;
                            });

                            it('should define \'single select image\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof SingleSelectImageQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.textMatching, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.textMatching;
                            });

                            it('should define \'textMatching\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof TextMatchingQuestion).toBeTruthy();
                            });

                        });

                        describe('and when question.type = ' + constants.questionTypes.informationContent, function () {

                            beforeEach(function () {
                                objectiveId = '0';
                                questionData.type = constants.questionTypes.informationContent;
                            });

                            it('should define \'informationContent\' question', function () {
                                var question = questionsFactory.createQuestion(objectiveId, questionData);

                                expect(question instanceof InformationContent).toBeTruthy();
                            });

                        });

                    });

                });

            });

        });

});