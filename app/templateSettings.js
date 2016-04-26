define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultTemplateSetting = {
        "branding": {
            "logo": {
                "url": ""
            },
            "background": {
                "header": {
                    "brightness": 0,
                    "color": null,
                    "image": {
                        "url": "//cdn.easygenerator.com/images/2.jpg",
                        "option": "repeat"
                    }
                },
                "body": {
                    "enabled": true,
                    "brightness": 0,
                    "color": "#ececed",
                    "texture": null
                }
            },
            "colors": []
        },
        "sectionsLayout": {
            "key": "Tiles"
        },

        "fonts": [],
        "treeOfContent":{
            "enabled": true
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
            "selected": "en",
            "customTranslations": {}
        },
        "pdfExport": {
            "enabled": false
        },
        "showConfirmationPopup": true,
        "allowContentPagesScoring": false
    };


    return {
        init: init,

        masteryScore: {
            score: 100
        },

        logoUrl: '',

        sectionsLayout: {
            key: ''
        },
        xApi: {},
        pdfExport: {},
        languages: {}
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

            //sections layout initialization
            if (!_.isEmptyOrWhitespace(fullSettings.sectionsLayout.key)) {
                that.sectionsLayout = fullSettings.sectionsLayout.key;
            }

            that.treeOfContent = fullSettings.treeOfContent;
            that.colors = fullSettings.branding.colors;
            that.fonts = fullSettings.fonts;

            that.background = fullSettings.branding.background;
            that.xApi = fullSettings.xApi;
            that.pdfExport = fullSettings.pdfExport;
            that.showConfirmationPopup = fullSettings.showConfirmationPopup;
            that.allowContentPagesScoring = fullSettings.allowContentPagesScoring;

            that.languages.selected = fullSettings.languages.selected;

        });
    }

});
