(function (app) {
    app.LogoModel = LogoModel;
    app.ThemesModel = ThemesModel;
    app.ThemeModel = ThemeModel;
    app.TrackingDataModel = TrackingDataModel;
    app.LrsOption = LrsOption;
    app.LanguagesModel = LanguagesModel;
    app.LanguageModel = LanguageModel;

    function LogoModel(logoSettings) {
        var that = this;

        that.url = ko.observable('');
        that.hasLogo = ko.computed(function () {
            return that.url() !== '';
        });
        that.clear = function () {
            that.url('');
        };
        that.isError = ko.observable(false);
        that.errorText = ko.observable('');
        that.errorDescription = ko.observable('');
        that.isLoading = ko.observable(false);

        that.setDefaultStatus = setDefaultStatus;
        that.setFailedStatus = setFailedStatus;
        that.setLoadingStatus = setLoadingStatus;
        that.setUrl = setUrl;
        that.getData = getData;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }

            that.setUrl(logoSettings.url);
        }

        function setDefaultStatus() {
            that.isLoading(false);
            that.isError(false);
        }

        function setFailedStatus(reasonTitle, reasonDescription) {
            that.clear();
            that.isLoading(false);
            that.errorText(reasonTitle);
            that.errorDescription(reasonDescription);
            that.isError(true);
        }

        function setLoadingStatus() {
            that.isLoading(true);
        }

        function setUrl(url) {
            that.url(url || '');
        }

        function getData() {
            return {
                url: that.url()
            };
        }
    }

    function ThemesModel(themesSettings) {
        var that = this;
        
        that.list = [
            new app.ThemeModel('cartoon', true),
            new app.ThemeModel('grey'),
            new app.ThemeModel('black'),
            new app.ThemeModel('flat')
        ];

        that.selectedThemeName = ko.computed(function () {
            var selectedName = '';
            ko.utils.arrayForEach(that.list, function (theme) { //foreach because of we need to track selecting of all themes
                if (theme.isSelected()) {
                    selectedName = theme.name;
                }
            });
            return selectedName;
        }, that);

        that.select = select;
        that.selectByName = selectByName;
        that.openDemo = openDemo;
        that.getData = getData;

        init(themesSettings);

        return that;

        function init(themesSettings) {
            if (!themesSettings) {
                return;
            }

            that.selectByName(themesSettings.key);
        }

        function select(item) {
            ko.utils.arrayForEach(that.list, function (theme) {
                theme.isSelected(false);
            });

            item.isSelected(true);
        }

        function selectByName(name) {
            ko.utils.arrayForEach(that.list, function (theme) {
                theme.isSelected(theme.name === name);
            });

        }

        function openDemo() {
            var index = location.toString().indexOf('/settings/settings');
            var templateUrl = location.toString().substring(0, index);

            var params = [
                'v=' + new Date().getTime(),
                'theme=' + that.selectedThemeName()
            ].join('&');

            window.open(templateUrl + '?' + params, '_blank');
        }

        function getData() {
            return {
                key: that.selectedThemeName()
            };
        }
    }

    function ThemeModel(name, isSelected) {
        var that = this;

        that.name = name;
        that.isSelected = ko.observable(isSelected === true);

        return that;
    }

    function TrackingDataModel(xApiSettings) {
        var that = this;

        that.advancedSettingsExpanded = ko.observable(false);

        that.enableXAPI = ko.observable(true);
        that.lrsOptions = [
            new app.LrsOption('default', true),
            new app.LrsOption('custom')
        ];

        that.selectedLrs = ko.computed(function () {
            var selectedName = '';
            ko.utils.arrayForEach(that.lrsOptions, function (lrsOption) { //foreach because of we need to track selecting of all themes
                if (lrsOption.isSelected()) {
                    selectedName = lrsOption.name;
                }
            });
            return selectedName;
        }, that);

        that.customLrsEnabled = ko.computed(function () {
            return that.enableXAPI() && that.selectedLrs() != that.lrsOptions[0].name;
        });

        that.lrsUrl = ko.observable('');
        that.authenticationRequired = ko.observable(false);
        that.lapLogin = ko.observable();
        that.lapPassword = ko.observable();

        that.credentialsEnabled = ko.computed(function () {
            return that.customLrsEnabled() && that.authenticationRequired();
        });

        that.statements = {
            started: ko.observable(true),
            stopped: ko.observable(true),
            experienced: ko.observable(true),
            mastered: ko.observable(true),
            answered: ko.observable(true),
            passed: ko.observable(true),
            failed: ko.observable(true)
        };

        that.toggleAdvancedSettings = toggleAdvancedSettings;
        that.selectLrs = selectLrs;
        that.selectLrsByName = selectLrsByName;
        that.setStatements = setStatements;
        that.setCustomLrsSettings = setCustomLrsSettings;
        that.getData = getData;

        init(xApiSettings);

        return that;

        function init(xApiSettings) {
            if (!xApiSettings) {
                return;
            }

            that.enableXAPI(xApiSettings.enabled);

            if (xApiSettings.selectedLrs) {
                that.selectLrsByName(xApiSettings.selectedLrs);
            }

            if (xApiSettings.lrs) {
                that.setCustomLrsSettings(xApiSettings.lrs);
            }

            if (xApiSettings.allowedVerbs && xApiSettings.allowedVerbs.length > 0) {
                that.setStatements(xApiSettings.allowedVerbs);
            }
        }

        function toggleAdvancedSettings() {
            that.advancedSettingsExpanded(!that.advancedSettingsExpanded());
        }

        function selectLrs(lrs) {
            ko.utils.arrayForEach(that.lrsOptions, function (lrsOptions) {
                lrsOptions.isSelected(false);
            });
            lrs.isSelected(true);
        }

        function selectLrsByName(name) {
            ko.utils.arrayForEach(that.lrsOptions, function (lrsOption) {
                lrsOption.isSelected(lrsOption.name === name);
            });
        }

        function setStatements(statements) {
            ko.utils.objectForEach(that.statements, function (key, value) {
                value(statements.indexOf(key) > -1);
            });
        }

        function setCustomLrsSettings(customLrsSettings) {
            that.lrsUrl(customLrsSettings.uri || '');
            that.authenticationRequired(customLrsSettings.authenticationRequired || false);
            that.lapLogin(customLrsSettings.credentials.username || '');
            that.lapPassword(customLrsSettings.credentials.password || '');
        }

        function getData() {
            return {
                enabled: that.enableXAPI(),
                selectedLrs: that.selectedLrs(),
                lrs: {
                    uri: that.lrsUrl(),
                    authenticationRequired: that.authenticationRequired(),
                    credentials: {
                        username: that.lapLogin(),
                        password: that.lapPassword()
                    }
                },
                allowedVerbs: ko.utils.objectForEach(that.statements, function (key, value) {
                    return value() ? key : undefined;
                })
            }
        }
    }

    function LrsOption(name, isSelected) {
        var that = this;

        that.name = name;
        that.isSelected = ko.observable(isSelected === true);

        return that;
    }

    function LanguagesModel(languages, languagesSettings) {
        var that = this;

        var customLanguageCode = 'xx';
        var defaultLanguageCode = 'en';

        that.languages = [];

        var _selectedLanguageCode = ko.observable(null);
        that.selectedLanguageCode = ko.pureComputed({
            read: function () {
                return _selectedLanguageCode();
            },
            write: function (value) {
                var language = getLanguage(value);

                if (!language) {
                    return;
                }

                if (language.isLoaded) {
                    _selectedLanguageCode(value);
                    return;
                }

                that.isLanguageLoading(true);
                language.load().done(function () {
                    _selectedLanguageCode(value);
                    that.isLanguageLoading(false);
                });
            }
        });
        that.selectedLanguageTranslations = ko.pureComputed(function () {
            var language = getLanguage(that.selectedLanguageCode());
            return language ? language.getTranslations() : null;
        });

        that.isLanguageLoading = ko.observable(false);

        that.isLanguageEditable = isLanguageEditable;
        that.getCustomTranslations = getCustomTranslations;

        that.getData = getData;

        init(languages, languagesSettings);

        return that;

        function init(languages, languagesSettings) {
            ko.utils.arrayForEach(languages, function (language) {
                addLanguage(new app.LanguageModel(language.code, app.localize(language.code), language.url));
            });

            var defaultLanguage = getLanguage(defaultLanguageCode);
            var customLanguage = new app.LanguageModel(customLanguageCode, app.localize(customLanguageCode), defaultLanguage ? defaultLanguage.resourcesUrl : null);

            if (languagesSettings && languagesSettings.customTranslations && !$.isEmptyObject(languagesSettings.customTranslations)) {
                customLanguage.isLoaded = true;
                customLanguage.setTranslations(languagesSettings.customTranslations);
            }
            addLanguage(customLanguage);

            var selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            that.selectedLanguageCode(selectedLanguageCode);
        }

        function isLanguageEditable() {
            return that.selectedLanguageCode() === customLanguageCode;
        }

        function getCustomTranslations() {
            var customLanguage = getLanguage(customLanguageCode);
            if (customLanguage) {
                return customLanguage.getNotMappedTranslations();
            }
            return [];
        }

        function addLanguage(language) {
            that.languages.push(language);
        }

        function getLanguage(code) {
            return ko.utils.arrayFirst(that.languages, function (language) {
                return language.code === code;
            });
        }

        function getData() {
            var settingsData = {};

            if (that.selectedLanguageCode()) {
                settingsData.selected = that.selectedLanguageCode();
            }

            var customTranslations = getCustomTranslations();
            if (customTranslations && !$.isEmptyObject(customTranslations)) {
                settingsData.customTranslations = customTranslations;
            }

            return settingsData;
        }
    }

    function LanguageModel(code, name, resourcesUrl) {
        var that = this;

        that.code = code;
        that.name = name;

        that.isLoaded = false;
        that.load = load;
        that.resourcesUrl = resourcesUrl;

        that.setTranslations = setTranslations;
        that.getTranslations = getTranslations;
        that.getNotMappedTranslations = getNotMappedTranslations;

        that._mappedTranslations = [];

        return that;

        function setTranslations(translations) {
            that._mappedTranslations = map(translations);
        }

        function getTranslations() {
            return that._mappedTranslations;
        }

        function getNotMappedTranslations() {
            return unmap(that._mappedTranslations);
        }

        function load() {
            return loadLanguageResources(that.resourcesUrl).then(function (resources) {
                that.setTranslations(resources);
                that.isLoaded = true;
            });
        }

        function loadLanguageResources(url) {
            return $.ajax({
                url: getAbsoluteUrl(url),
                dataType: 'json',
                contentType: 'application/json'
            });
        }

        function getAbsoluteUrl(relativeUrl) {
            var baseUrl = location.protocol + '//' + location.host;
            return baseUrl + location.pathname.replace('settings/settings.html', relativeUrl);
        }

        function map(translationsObject) {
            var arr = [];

            if (translationsObject) {
                Object.keys(translationsObject).forEach(function (key) {
                    arr.push({ key: key, value: translationsObject[key] });
                });
            }

            return arr;
        }

        function unmap(translationsArray) {
            var translationsObj = {};

            if (translationsArray) {
                translationsArray.forEach(function (translation) {
                    translationsObj[translation.key] = translation.value;
                });
            }

            return translationsObj;
        }
    }

})(window.app = window.app || {});