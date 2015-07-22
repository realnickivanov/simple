define(function () {
    "use strict";

    return {
        questionTypes: {
            multipleSelect: "multipleSelect",
            fillInTheBlank: "fillInTheBlank",
            dragAndDrop: "dragAndDropText",
            singleSelectText: "singleSelectText",
            singleSelectImage: "singleSelectImage",
            textMatching: "textMatching",
            hotspot: "hotspot",
            statement: "statement",
            informationContent: "informationContent",
            openQuestion: "openQuestion"
        },
        defaultImageUrl: 'css/img/singleSelectImageAnwer.png',
        events: {
            appClosed: 'appClosed'
        },
        localStorageProgressKey: 'course_progress'
    };

});