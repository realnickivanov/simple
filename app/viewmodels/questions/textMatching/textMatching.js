define(['viewmodels/questions/textMatching/textMatchingSource', 'viewmodels/questions/textMatching/textMatchingTarget'], function (Source, Target) {

    var viewModel = {
        question: null,
        content: null,
        isAnswered: ko.observable(false),

        sources: ko.observableArray([]),
        targets: ko.observableArray([]),

        submit: submit,
        tryAnswerAgain: tryAnswerAgain,

        initialize: initialize
    };

    viewModel.acceptValue = function (value) {
        viewModel.targets.push(value);
    };


    viewModel.rejectValue = function (value) {
        viewModel.targets.remove(value);
    };

    return viewModel;

    function initialize(question) {

        return Q.fcall(function () {
            viewModel.question = question;

            viewModel.content = question.content;
            viewModel.isAnswered(question.isAnswered);


            var targets = [];

            _.each(question.answers, function (pair) {
                targets.push(new Target(pair.value));
            });

            var sources = [];
            _.each(question.answers, function (pair) {
                var source = new Source(pair.id, pair.key);
                var target = _.find(targets, function (target) {
                    return target.value() == pair.attemptedValue;
                });

                if (target) {
                    source.acceptValue(target.value());
                    target.rejectValue();
                } else {
                    source.value(null);
                }

                sources.push(source);
            });

            viewModel.targets(_.shuffle(targets));
            viewModel.sources(_.shuffle(sources));
        });
    }

    function submit() {
        return Q.fcall(function () {
            viewModel.question.submitAnswer(_.map(viewModel.sources(), function (source) {
                var value = source.value() ? source.value() : null;
                return { id: source.id, value: value };
            }));
            viewModel.isAnswered(true);
        });
    }

    function tryAnswerAgain() {
        return Q.fcall(function () {

            _.each(viewModel.sources(), function (pair, index) {
                if (pair.value()) {
                    viewModel.targets()[index].acceptValue(pair.value());
                    pair.rejectValue();
                }
            });

            viewModel.isAnswered(false);
        });
    }

});