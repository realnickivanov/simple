define(['windowOperations'], function (windowOperations) {
    "use strict";

    var exitCourseModel = {

        activate: activate,

        close: close,
        finish: finish,

        finishPopupVisibility: ko.observable(false),
        closeFinishPopup: closeFinishPopup
    };

    return exitCourseModel;

    function activate() {

    }

    function close() {
        windowOperations.close();
    }

    function finish() {
        exitCourseModel.finishPopupVisibility(true);
    }

    function closeFinishPopup() {
        exitCourseModel.finishPopupVisibility(false);
    }

});