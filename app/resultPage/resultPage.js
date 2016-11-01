define([
    'repositories/courseRepository', 'templateSettings', 'plugins/router', 'progressContext', 
    'userContext', 'xApi/xApiInitializer', 'includedModules/modulesInitializer', 
    'windowOperations', 'constants', 'modules/progress/progressStorage/auth'
], function(courseRepository, templateSettings, router, progressContext, userContext, 
    xApiInitializer, modulesInitializer, windowOperations, constants, auth) {
    "use strict";

    var course = courseRepository.get();

    var progressStatuses = constants.progressContext.statuses;

    var statuses = {
        readyToFinish: 'readyToFinish',
        sendingRequests: 'sendingRequests',
        finished: 'finished'
    };
	
    var viewModel = {
        score: course.score,
        title: course.title,
        sections: [],
        masteryScore: templateSettings.masteryScore.score,
        status: ko.observable(statuses.readyToFinish),
        activate: activate,
        close: close,
        finish: finish,
        
        //properties
        crossDeviceEnabled: false,
        xAPIEnabled: false,
        scormEnabled: false,
        stayLoggedIn: ko.observable(false),

        //methods
        toggleStayLoggedIn: toggleStayLoggedIn
    };

    return viewModel;
	
	function activate() {
        viewModel.crossDeviceEnabled = templateSettings.allowCrossDeviceSaving;
        viewModel.xAPIEnabled = xApiInitializer.isActivated();
        viewModel.scormEnabled = modulesInitializer.hasModule('lms');

        viewModel.stayLoggedIn(userContext.user.keepMeLoggedIn);
        viewModel.sections = _.map(course.sections, mapSection);
	}

    function close() {        
        router.navigate("#sections");
    } 

    function finish() {
        if (router.isNavigationLocked() || viewModel.status() !== statuses.readyToFinish) {
            return;
        }
        viewModel.status(statuses.sendingRequests);
        progressContext.remove(function(){
            course.finish(onCourseFinishedCallback.bind(viewModel, !viewModel.stayLoggedIn() ? auth.signout : function() {}));
        });
    }

    function onCourseFinishedCallback(logOutCallback) {
        viewModel.status(statuses.finished);

        progressContext.status(progressStatuses.ignored);
        logOutCallback();
        windowOperations.close();
    }

    function toggleStayLoggedIn() {
        viewModel.stayLoggedIn(userContext.user.keepMeLoggedIn = !viewModel.stayLoggedIn());
        auth.shortTermAccess = !userContext.user.keepMeLoggedIn;
    }

    function mapSection(entity){
        var section = {};
        
        section.id = entity.id;
        section.title = entity.title;
        section.score = entity.score();       

        section.readedContents = _.filter(entity.questions, function(question) {
                return !isQuestion(question) && question.isAnswered;
            })
            .length;

        section.questions = _.filter(entity.questions, function(question){
            return isQuestion(question);
        });

        section.amountQuestions = _.filter(section.questions, function(question) {
                return !question.isSurvey;
            })
            .length;

        section.correctQuestions = _.filter(section.questions, function(question) {
                return question.isAnswered && question.isCorrectAnswered && !question.isSurvey;
            })
            .length;

        section.amountContents = entity.questions.length - section.questions.length;
        section.affectProgress = entity.affectProgress;
        section.title = entity.title;

        return section;
    }

    function isQuestion(question) {
        return question.type !== constants.questionTypes.informationContent;
    }
});