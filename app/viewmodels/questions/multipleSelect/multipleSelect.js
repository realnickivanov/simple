define(function () {
	"use strict";

	var viewModel = {
	    question: null,

	    content: null,
	    isAnswered: ko.observable(false),
	    answers: null,

	    checkItem: checkItem,

	    submit: submit,
	    tryAnswerAgain: tryAnswerAgain,

	    initialize: initialize
	};

	return viewModel;

	function initialize(question) {
	    return Q.fcall(function () {
	        viewModel.question = question;

	        viewModel.content = question.content;
	        viewModel.isAnswered(question.isAnswered);

	        viewModel.answers = _.map(question.answers, function (answer) {
	            return {
	                id: answer.id,
	                text: answer.text,
	                isChecked: ko.observable(answer.isChecked)
	            };
	        });
	    });
	}

	function checkItem(item) {
	    if (viewModel.isAnswered()) {
	        return;
	    }

	    item.isChecked(!item.isChecked());
	}

	function submit() {
	    return Q.fcall(function () {
	        viewModel.question.submitAnswer(
				_.chain(viewModel.answers)
				.filter(function (item) {
				    return item.isChecked();
				})
				.map(function (item) {
				    return item.id;
				}).value());

	        viewModel.isAnswered(true);
	    });
	}

	function tryAnswerAgain() {
	    return Q.fcall(function() {
	        _.each(viewModel.answers, function (answer) {
	            answer.isChecked(false);
	        });

	        viewModel.isAnswered(false);
	    });
	}
});