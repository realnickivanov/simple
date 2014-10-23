define(function () {
    "use strict";

    var viewModel = {};

    viewModel.initialize = function(question) {
        return Q.fcall(function (){
            viewModel.content = question.content;
            viewModel.background = question.background;
            viewModel.isAnswered = ko.observable(question.isAnswered);
            viewModel.isMultiple = question.isMultiple;
            viewModel.question = question;

                viewModel.submit = function () {         
                return Q.fcall(function () {
                        question.submitAnswer(viewModel.marks());             
                        viewModel.isAnswered(true);
                });
                };
         
                viewModel.marks = ko.observableArray(question.placedMarks ? _.map(question.placedMarks, function (mark) { return { x: mark.x, y: mark.y }; }) : []);

            viewModel.addMark = function (mark) {
                if (!viewModel.isMultiple) {
                    viewModel.marks.removeAll();
                }
                viewModel.marks.push(mark);
            };

            viewModel.removeMark = function (mark) {
                viewModel.marks.remove(mark);
            };

            viewModel.tryAnswerAgain = function () {
                return Q.fcall(function () {
                    viewModel.isAnswered(false);
                    viewModel.marks.removeAll();
                });
            };

        });
    }

    return viewModel;
});