define([], function () {

    return [
        {
            route: ['', 'introduction'],
            moduleId: 'viewmodels/introduction',
            title: 'Introduction',
            rootLinkDisabled: true,
            exitButtonHidden: true
        },
        {
            route: 'objectives',
            moduleId: 'viewmodels/objectives',
            title: 'Objectives',
            rootLinkDisabled: true
        },
        {
            route: 'objective/:objectiveId/question/:questionId',
            moduleId: 'viewmodels/questions/content',
            title: 'Question'
        },
        {
            route: '404(/:url)',
            moduleId: 'viewmodels/404',
            title: 'Not found'
        }
    ];

});