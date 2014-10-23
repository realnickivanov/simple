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
            informationContent: "informationContent"
        },
        defaultImageUrl: 'img/singleSelectImageAnwer.png',
        events: {
            appClosed: 'appClosed'
        }
    };

});