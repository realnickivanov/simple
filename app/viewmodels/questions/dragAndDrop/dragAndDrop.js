define(function () {
    "use strict";

    var viewModel = {
        question: null,
        dropspots: [],
        texts: [],
        isAnswered: ko.observable(false),
        submit: submit,
        tryAnswerAgain: tryAnswerAgain,
        initialize: initialize
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function() {
            viewModel.question = question;

            viewModel.dropspots = _.map(question.answers, function (answer) {
                return {
                    x: answer.correctPosition.x,
                    y: answer.correctPosition.y,
                    text: ko.observable('')
                };
            });

            viewModel.texts = _.map(question.answers, function (answer) {
                return {
                    id: answer.id,
                    text: answer.text
                };
            });
            
            _.each(question.answers, function (answer) {
                var selectedDropspot = _.find(viewModel.dropspots, function (dropspot) {
                    return dropspot.x == answer.currentPosition.x
                        && dropspot.y == answer.currentPosition.y;
                });

                if (selectedDropspot) {
                    var selectedText = _.find(viewModel.texts, function (item) {
                        return item.id == answer.id;
                    });
                    selectedDropspot.text(selectedText);
                }
            });
        });
    }

    function submit() {
        return Q.fcall(function () {
            var answer = [];

            _.each(viewModel.dropspots, function (dropspot) {
                var text = dropspot.text();
                if (text) {
                    answer.push({
                        id: text.id,
                        x: dropspot.x,
                        y: dropspot.y
                    });
                }
            });

            viewModel.question.submitAnswer(answer);
            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            viewModel.isAnswered(false);
            _.each(viewModel.dropspots, function (dropspot) {
                dropspot.text(undefined);
            });
        });
    }
});