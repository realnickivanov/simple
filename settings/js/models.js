(function (app) {
    app.LogoModel = LogoModel;
    app.ThemesModel = ThemesModel;
    app.ThemeModel = ThemeModel;
    app.TrackingDataModel = TrackingDataModel;
    app.LrsOption = LrsOption;
    app.LanguagesModel = LanguagesModel;
    app.LanguageModel = LanguageModel;

    function LogoModel() {
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

        return that;

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

    function ThemesModel() {
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

        return that;

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
    }

    function ThemeModel(name, isSelected) {
        var that = this;

        that.name = name;
        that.isSelected = ko.observable(isSelected === true);

        return that;
    }

    function TrackingDataModel() {
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
            return that.enableXAPI() && that.selectedLrs() != that.lrsOptions[0].key;
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
        that.setxApiSettings = setxApiSettings;
        that.getData = getData;

        return that;

        function toggleAdvancedSettings () {
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
        s
        function setCustomLrsSettings(customLrsSettings) {
            that.lrsUrl(customLrsSettings.uri || '');
            that.authenticationRequired(customLrsSettings.authenticationRequired || false);
            that.lapLogin(customLrsSettings.credentials.username || '');
            that.lapPassword(customLrsSettings.credentials.password || '');
        }

        function setxApiSettings(xApiSettings) {
            if (xApiSettings.enabled) {
                that.enableXAPI(xApiSettings.enabled);
                if (xApiSettings.selectedLrs) {
                    that.selectLrsByName(xApiSettings.selectedLrs);
                }
            }

            if (xApiSettings.lrs) {
                that.setCustomLrsSettings(xApiSettings.lrs);
            }

            if (xApiSettings.allowedVerbs && xApiSettings.allowedVerbs.length > 0) {
                that.setStatements(xApiSettings.allowedVerbs);
            }
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

    function LanguagesModel() {
        var that = this;

        var customLanguage = 'xx';

        that.selected = ko.observable(null);
        that.languages = [new app.LanguageModel(customLanguage)];

        that.addLanguages = addLanguages;
        that.select = select;
        that.isCustomSelected = isCustomSelected;
        that.setCustomTranslations = setCustomTranslations;
        that.getCustomTranslations = getCustomTranslations;

        return that;

        function addLanguages(languages) {
            ko.utils.arrayForEach(languages, function (language) {
                that.languages.unshift(new app.LanguageModel(language.name, [], language.url));
            });
        }

        function select(name) {
            //TODO: check if selected existis
            that.selected(name);
        }

        function isCustomSelected() {
            return that.selected() === customLanguage;
        }

        function setCustomTranslations(translations) {
            getLanguage(customLanguage).updateTranslations(translations);
        }

        function getLanguage(name) {
            return ko.utils.arrayFirst(that.languages, function (language) {
                return language.name === name;
            });
        }

        function getCustomTranslations() {
            var custom = getLanguage(customLanguage);
            if (custom) {
                return custom.translations;
            }
            return [];
        }
    }

    function LanguageModel(name, translations, url) {
        var that = this;

        that.name = name;
        that.translations = translations || [];
        that.url = url || '';
        that.updateTranslations = updateTranslations;

        return that;

        function updateTranslations(newTranslations) {
            that.translations = newTranslations;
        }
    }

})(window.app = window.app || {});