define(['plugins/router', 'constants', 'modules/questionsNavigation', 'viewmodels/questions/questionsViewModelFactory'],
	function (router, constants, navigationModule, questionViewModelFactory) {
	    "use strict";

	    var viewModel = {
	        objectiveId: null,
	        question: null,
	        
	        title: '',
	        isAnswered: ko.observable(false),
	        isCorrect: ko.observable(false),
	        isExpanded: ko.observable(true),

	        learningContents: [],
	        correctFeedback: ko.observable(null),
	        incorrectFeedback: ko.observable(null),
	        feedbackView: '',
            submitViewModel: '',

	        navigationContext: null,

	        activeQuestionViewModel: null,

	        toggleExpand: toggleExpand,
	        submit: submit,
	        tryAnswerAgain: tryAnswerAgain,

	        navigateNext: navigateNext,

	        activate: activate,
	        deactivate: deactivate,
	        isNavigationLocked: router.isNavigationLocked
	    };

	    viewModel.isCorrectAnswered = ko.computed(function () {
	        return viewModel.isAnswered() && viewModel.isCorrect();
	    });

	    viewModel.isWrongAnswered = ko.computed(function () {
	        return viewModel.isAnswered() && !viewModel.isCorrect();
	    });

	    return viewModel;

	    function navigateNext() {
	        if (router.isNavigationLocked()) {
	            return;
	        }

	        var nextUrl = !_.isNullOrUndefined(viewModel.navigationContext.nextQuestionUrl) ? viewModel.navigationContext.nextQuestionUrl : 'objectives';
	        router.navigate(nextUrl);
	    }
	    
	    function toggleExpand() {
	        return viewModel.isExpanded(!viewModel.isExpanded());
	    }

	    function submit() {
	        return viewModel.activeQuestionViewModel.submit().then(function () {
	            viewModel.isAnswered(viewModel.question.isAnswered);
	            viewModel.isCorrect(viewModel.question.isCorrectAnswered);
	        });
	    }

	    function tryAnswerAgain() {
	        return viewModel.activeQuestionViewModel.tryAnswerAgain().then(function () {
	            viewModel.isAnswered(false);
	        });
	    }

	    function activate(objectiveId, question) {
	        viewModel.objectiveId = objectiveId;
	        viewModel.question = question;

	        viewModel.navigationContext = navigationModule.getNavigationContext(viewModel.objectiveId, viewModel.question.id);
	        viewModel.title = viewModel.question.title;
	        viewModel.isAnswered(viewModel.question.isAnswered);
	        viewModel.isCorrect(viewModel.question.isCorrectAnswered);

	        viewModel.learningContents = viewModel.question.learningContents;
	        viewModel.correctFeedback(viewModel.question.feedback.correct);
	        viewModel.incorrectFeedback(viewModel.question.feedback.incorrect);

	        viewModel.activeQuestionViewModel = questionViewModelFactory.getViewModel(viewModel.question.type);
	        viewModel.feedbackView = 'questions/feedback.html';

	        if (viewModel.activeQuestionViewModel.feedbackView) {
	            viewModel.feedbackView = viewModel.activeQuestionViewModel.feedbackView;
	        }

	        if (viewModel.activeQuestionViewModel.customSubmitViewModel) {
	            viewModel.submitViewModel = viewModel.activeQuestionViewModel.customSubmitViewModel;
	        }

	        return viewModel.activeQuestionViewModel.initialize(viewModel.question);
	    }

	    function deactivate() {
	        if (_.isFunction(viewModel.activeQuestionViewModel.deactivate)) {
	            viewModel.activeQuestionViewModel.deactivate();
	        }
	    }
	}
);