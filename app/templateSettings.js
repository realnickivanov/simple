define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultTemplateSetting = {
        "branding": {
            "logo": {
                "url": ""
            },
            "background": null
        },
        "objectivesLayout": {
            "key": "Tiles"
        },
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
        },
        "pdfExport": {
            "enabled": false
        }
    };


    return {
        init: init,

        masteryScore: {
            score: 100
        },

        logoUrl: '',
        
        objectivesLayout: {
            key: ''
        },
        xApi: {},
        pdfExport: {}
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
            if (!_.isEmptyOrWhitespace(fullSettings.branding.logo.url)) {
                that.logoUrl = fullSettings.branding.logo.url;
            }

            //objectives layout initialization
            if (!_.isEmptyOrWhitespace(fullSettings.objectivesLayout.key)) {
                that.objectivesLayout = fullSettings.objectivesLayout.key;
            }


            that.colors = fullSettings.branding.colors;

            that.background = fullSettings.branding.background;
            that.xApi = fullSettings.xApi;
            that.pdfExport = fullSettings.pdfExport;

        });
    }

});
