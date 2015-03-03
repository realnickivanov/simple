(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'cartoon': 'Cartoon light',
        'grey': 'Grey scheme',
        'black': 'Black scheme',
        'flat': 'Flat scheme',
        'default': 'easygenerator (recommended)',
        'custom': 'Custom LRS',

        'xx': 'Custom',
        'cn': 'Chinese',
        'de': 'German',
        'en': 'English',
        'fr': 'French',
        'it': 'Italian',
        'nl': 'Dutch',
        'tr': 'Turkish',
        'ua': 'Ukrainian'

    };

})(window.app = window.app || {});
