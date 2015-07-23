define(['knockout'], function (ko) {
	"use strict";

	var viewModel = {
	    question: null,

	    content: null,
	    isAnswered: ko.observable(false),
	    inputValues: ko.observableArray([]),

	    submit: submit,
	    tryAnswerAgain: tryAnswerAgain,

	    initialize: initialize
	};

	return viewModel;

	function initialize(question) {
	    return Q.fcall(function () {
	        viewModel.question = question;

	        viewModel.isAnswered(question.isAnswered);
	        viewModel.inputValues(_.map(question.answerGroups, function (answerGroup) {
	            return {
	                id: answerGroup.id,
	                value: answerGroup.answeredText,
	                answers: answerGroup.answers
	            };
	        }));

	        viewModel.content = question.content;
	    });
	}

	function submit() {
	    return Q.fcall(function () {
	        viewModel.question.submitAnswer(viewModel.inputValues());
	        
	        viewModel.isAnswered(true);
	    });
	}

	function tryAnswerAgain() {
	    return Q.fcall(function () {
	        _.each(viewModel.inputValues(), function (blankValue) {
	            blankValue.value = '';
	        });
	        viewModel.isAnswered(false);
	    });
	}
});