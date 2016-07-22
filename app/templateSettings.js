define([], function () {

    var defaultTranslationsCode = 'en';

    var defaultThemeSettings = {
        "branding": {
            "logo": {
                "url": "//cdn.easygenerator.com/logo.png"
            },
            "colors": [
              {
                  "key": "@text-color",
                  "value": "#252728"
              },
              {
                  "key": "@main-color",
                  "value": "#43aaa3"
              },
              {
                  "key": "@secondary-color",
                  "value": "#2d9ec6"
              },
              {
                  "key": "@button-text-color",
                  "value": "#fff"
              },
              {
                  "key": "@content-body-color",
                  "value": "#fff"
              }
            ],
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
            }
        },
        "fonts": [
          {
              "key": "main-font",
              "fontFamily": "Roboto Slab"
          },
          {
              "key": "Heading1",
              "size": 26,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "700",
              "textDecoration": "none",
              "fontStyle": "normal",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "Heading2",
              "size": 24,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "700",
              "textDecoration": "none",
              "fontStyle": "normal",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "Heading3",
              "size": 20,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "700",
              "textDecoration": "none",
              "fontStyle": "normal",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "Normal",
              "size": 18,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "normal",
              "textDecoration": "none",
              "fontStyle": "normal",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "Quote",
              "size": 18,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "normal",
              "textDecoration": "none",
              "fontStyle": "italic",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "Highlighted",
              "size": 18,
              "fontFamily": "Roboto Slab",
              "color": "#252728",
              "fontWeight": "normal",
              "textDecoration": "none",
              "fontStyle": "normal",
              "textBackgroundColor": "#2d9ec6",
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          },
          {
              "key": "links",
              "size": 18,
              "fontFamily": "Roboto Slab",
              "color": "#2d9ec6",
              "fontWeight": "normal",
              "textDecoration": "underline",
              "fontStyle": "normal",
              "textBackgroundColor": null,
              "isGeneralSelected": true,
              "isGeneralColorSelected": true
          }
        ]
    }

    var defaultTemplateSetting = {
        "sectionsLayout": {
            "key": "Tiles"
        },
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
        "allowContentPagesScoring": false,
        "allowLoginViaSocialMedia": true
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

    function init(settings, themeSettings) {
        var that = this;
        var designSettings = _.defaults(themeSettings, defaultThemeSettings);
        var templateSettings = _.defaults(settings, defaultTemplateSetting);

        var fullSettings = deepExtend(templateSettings, designSettings);
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
            that.allowLoginViaSocialMedia = fullSettings.allowLoginViaSocialMedia;

            that.languages.selected = fullSettings.languages.selected;

        });
    }

    function deepExtend(destination, source) {
        if (_.isNullOrUndefined(destination)) {
            return source;
        }

        for (var property in source) {
            if (source[property] && source[property].constructor &&
             (source[property].constructor === Object || source[property].constructor === Array)) {
                if (destination[property]) {
                    deepExtend(destination[property], source[property]);
                } else {
                    destination[property] = source[property];
                }
            } else {
                destination[property] = destination[property] || source[property];
            }
        }
        return destination;
    };
});
