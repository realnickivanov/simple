define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultTemplateSetting = {
        "branding": {
            "logo": {
                "url": ""
            },
            "background": {
                "header": {
                    "expanded": false,
                    "brightness": 0,
                    "color": null,
                    "image": {
                        "url": "//cdn.easygenerator.com/images/2.jpg",
                        "option": "repeat"
                    }
                },
                "body": {
                    "brightness": 0,
                    "color": "#ececed",
                    "texture": null
                }
            },
            "colors": []
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
            if (fullSettings.branding.logo && fullSettings.branding.logo.url && fullSettings.branding.logo.url.length) {
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
