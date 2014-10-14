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
            informationContent: "informationContent",
            statement: "statement"
        },
        defaultImageUrl: 'img/singleSelectImageAnwer.png',
        events: {
            appClosed: 'appClosed'
        }
    };

});