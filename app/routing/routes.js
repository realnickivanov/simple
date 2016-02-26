define([], function () {

    return [
        {
            route: ['', 'introduction'],
            moduleId: 'viewmodels/introduction',
            title: 'Introduction',
            rootLinkDisabled: true,
            hideExitButton: true
        },
        {
            route: 'sections',
            moduleId: 'viewmodels/sections',
            title: 'Sections',
            rootLinkDisabled: true,
            hideExitButton: true
        },
        {
            route: 'section/:sectionId/question/:questionId',
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