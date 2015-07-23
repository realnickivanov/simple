define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultTemplateSetting = {
        "logo": {
            "url": ""
        },
        "theme": {
            "key": ""
        },
        "background": null,
        "xApi": {
            "enabled": true,
            "selectedLrs": "default",
            "lrs": {
                "uri": "",
                "credentials": {
                    "username": "",
                    "password": ""
                },
                "authenticationRequired": false
            },
            "allowedVerbs": []
        },
        "languages": {
            "selected": "",
            "customTranslations": {}
        }
    };


    return {
        init: init,

        masteryScore: {
            score: 100
        },

        logoUrl: '',
        theme: {
            key: ''
        },
        xApi: {}
    };

    function init(settings) {
        var that = this;
        var fullSettings = _.defaults(settings, defaultTemplateSetting);
        return Q.fcall(function () {
            //Mastery score initialization
            if (fullSettings.masteryScore) {
                var score = Number(fullSettings.masteryScore.score);
                that.masteryScore.score = (_.isNumber(score) && score >= 0 && score <= 100) ? score : 100;
            }

            //Course logo initialization
            if (!_.isEmptyOrWhitespace(fullSettings.logo.url)) {
                that.logoUrl = fullSettings.logo.url;
            }
            //Theme initialization
            if (!_.isEmptyOrWhitespace(fullSettings.theme.key)) {
                that.theme.key = fullSettings.theme.key;
            }
            if (fullSettings.background && fullSettings.background.image && fullSettings.background.image.src) {
                that.background = fullSettings.background;
            }
            that.xApi = fullSettings.xApi;
        });
    }

});
