(function (app) {

    app.localize = function (key) {
        return translations[key];
    };

    var translations = {
        'cartoon': 'Cartoon light',
        'grey': 'Grey scheme',
        'black': 'Black scheme',
        'flat': 'Flat scheme'
    };

})(window.app || {});
