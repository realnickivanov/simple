define(['knockout', 'viewmodels/questions/scenarioQuestion/components/branchtrackProvider'], function (ko, branchtrackProvider) {
    'use strict';

    var submitCallback = function() {};

    var viewmodel = {
        submit: submit,
        canBeSubmitted: ko.observable(false),
        activate: activate
    };

    return viewmodel;

    function activate(activationData) {
        if (_.isFunction(activationData.submit)) {
            submitCallback = activationData.submit;
            viewmodel.canBeSubmitted(branchtrackProvider.isFinished());
        }
    }

    function submit() {
        viewmodel.canBeSubmitted(branchtrackProvider.isFinished());
        if (viewmodel.canBeSubmitted()) {
            submitCallback();
        }
    }
});