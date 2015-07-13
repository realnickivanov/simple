(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'changes are saved': 'All changes are saved',
        'changes are not saved': 'Changes have NOT been saved. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',
        'settings are not initialize': 'Template settings are not initialized. Please reload the page and change the settings again. Contact support@easygenerator.com if problem persists.',

        //graphical customization tab
        'graphical customization': 'Graphical customization',
		
		'cartoon': 'Cartoon light',
        'grey': 'Grey scheme',
        'black': 'Black scheme',
        'flat': 'Flat scheme',
		
        'custom course logo': 'Custom course logo:',
        'or': 'or',
        'upload logo image': 'Upload logo image',
        'upgrade account hint': 'You have to <a target="_blank" href="/account/upgrade">upgrade your account</a> in order to set custom course logo',
        'recomend size': '- recommended size 300x50 px, allowed formats: jpeg, jpg, png, bmp, gif',

        'logo update': 'Change',
        'logo remove': 'Clear',

        'choose color scheme': 'Choose color scheme:',
        'scheme': 'Scheme:',

        //background
        'background change': 'Change background:',
        'background update': 'Change background',
        'background remove': 'Clear background',
        'background original': 'Original',
        'background repeat': 'Repeat',
        'background fullscreen': 'Fullscreen',
        'background upgrade account hint': 'You have to <a target="_blank" href="/account/upgrade">upgrade your account</a> in order to set custom course background'
    };

})(window.app = window.app || {});
