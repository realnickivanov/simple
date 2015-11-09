define(['constants', 'viewmodels/questions/multipleSelect/multipleSelect', 'viewmodels/questions/singleSelectText/singleSelectText', 'viewmodels/questions/fillInTheBlank/fillInTheBlank',
    'viewmodels/questions/dragAndDrop/dragAndDrop', 'viewmodels/questions/singleSelectImage/singleSelectImage', 'viewmodels/questions/textMatching/textMatching',
    'viewmodels/questions/statement/statement', 'viewmodels/questions/hotspot/hotspot', 'viewmodels/questions/openQuestion/openQuestion',
    'viewmodels/questions/scenarioQuestion/scenarioQuestion'],
    function (constants, multipleSelect, singleSelectText, fillInTheBlank, dragAndDrop, singleSelectImage, textMatching, statement, hotspot, openQuestion, scenarioQuestion) {
        'use strict';

        return {
            getViewModel: getViewModel
        };

        function getViewModel(type) {
            switch (type) {
                case constants.questionTypes.multipleSelect:
                    return multipleSelect;
                case constants.questionTypes.dragAndDrop:
                    return dragAndDrop;
                case constants.questionTypes.singleSelectText:
                    return singleSelectText;
                case constants.questionTypes.fillInTheBlank:
                    return fillInTheBlank;
                case constants.questionTypes.singleSelectImage:
                    return singleSelectImage;
                case constants.questionTypes.textMatching:
                    return textMatching;
                case constants.questionTypes.statement:
                    return statement;
                case constants.questionTypes.hotspot:
                    return hotspot;
                case constants.questionTypes.openQuestion:
                    return openQuestion;
                case constants.questionTypes.scenario:
                    return scenarioQuestion;
                default:
                    return multipleSelect;
            }
        }

    });