define(function () {
    'use strict';

    return {
        questionTypes: {
            multipleSelect: 'multipleSelect',
            fillInTheBlank: 'fillInTheBlank',
            dragAndDrop: 'dragAndDropText',
            singleSelectText: 'singleSelectText',
            singleSelectImage: 'singleSelectImage',
            textMatching: 'textMatching',
            hotspot: 'hotspot',
            statement: 'statement',
            informationContent: 'informationContent',
            openQuestion: 'openQuestion',
            scenario: 'scenario',
            rankingText: 'rankingText'
        },
        defaultImageUrl: 'css/img/single-select-image-anwer.png',
        events: {
            appClosed: 'appClosed',
            onError: 'onError',
            appInitialized: 'appInitialized'
        },
        localStorageProgressKey: 'course_progress',
        localStorageResultKey: 'course_result',
        course: {
            statuses: {
                completed: 'completed',
                failed: 'failed',
                inProgress: 'inProgress'
            }
        },
        progressContext: {
            statuses: {
                undefined: 'undefined',
                saved: 'saved',
                error: 'error',
                ignored: 'ignored'
            }
        }
    };

});