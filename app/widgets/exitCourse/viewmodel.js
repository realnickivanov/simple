define(['windowOperations'], function (windowOperations) {
    "use strict";

    var exitCourseModel = {

        activate: activate,

        close: close,
        finish: finish
    };

    return exitCourseModel;

    function activate() {

    }

    function close() {
        windowOperations.close();
    }

    function finish() {
        console.log("finish course");
        //windowOperations.close();
    }

});