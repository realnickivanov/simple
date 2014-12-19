define(['viewmodels/questions/dragAndDrop/dragableText', 'viewmodels/questions/dragAndDrop/dropspot'], function (DragableText, Dropspot) {
    "use strict";

    var viewModel = {
        question: null,

        content: ko.observable(null),
        isAnswered: ko.observable(false),
        stockDropspot: null,
        dropspots: ko.observableArray([]),

        submit: submit,
        tryAnswerAgain: tryAnswerAgain,

        initialize: initialize
    };

    return viewModel;

    function initialize(question) {
        return Q.fcall(function () {
            viewModel.question = question;

            viewModel.content(question.content);
            viewModel.isAnswered(question.isAnswered);
            viewModel.stockDropspot = new Dropspot({
                position: { x: -1, y: -1 },
                limit: 0,
                items: ko.observableArray([])
            });

            viewModel.dropspots(_.map(question.answers, function (answer) {
                return new Dropspot({
                    position: answer.correctPosition,
                    limit: 1,
                    items: ko.observableArray([])
                });
            }));

            _.each(question.answers, function (answer) {

                var dragableText = new DragableText({
                    id: answer.id,
                    text: answer.text,
                    position: answer.currentPosition
                });

                var selectedDropspot = _.find(viewModel.dropspots(), function (dropspot) {
                    return dropspot.position.x == answer.currentPosition.x
                        && dropspot.position.y == answer.currentPosition.y;
                });

                if (selectedDropspot) {
                    selectedDropspot.items.push(dragableText);
                } else {
                    viewModel.stockDropspot.items.push(dragableText);
                }
            });
        });
    }

    function submit() {
        return Q.fcall(function () {
            var dragableTexts = viewModel.stockDropspot.items();
            _.each(viewModel.dropspots(), function (dropspot) {
                dragableTexts = dragableTexts.concat(dropspot.items());
            });
            viewModel.question.submitAnswer(dragableTexts);

            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {
            _.each(viewModel.dropspots(), function (dropspot) {
                _.each(dropspot.items(), function (item) {
                    viewModel.stockDropspot.items.push(item);
                    viewModel.stockDropspot.updateItemPosition(item);
                });
                dropspot.items([]);
            });
            viewModel.isAnswered(false);
        });
    }
});