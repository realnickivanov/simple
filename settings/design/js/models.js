(function (app) {

    app.UserAccessModel = UserAccessModel;
    app.LogoModel = LogoModel;
    app.ThemesModel = ThemesModel;
    app.ThemeModel = ThemeModel;
    app.BackgroundModel = BackgroundModel;

    function UserAccessModel(userData) {
        this.hasStarterPlan = userData && userData.accessType > 0;
    }

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

        that.setUrl = setUrl;
        that.getData = getData;

        that.upload = upload;

        init(logoSettings);

        return that;

        function init(logoSettings) {
            if (!logoSettings) {
                return;
            }

            that.setUrl(logoSettings.url);
        }

        function upload() {
            if (that.isLoading()) {
                return;
            }

            app.upload(function () {
                setLoadingStatus();
            })
                .done(function (url) {
                    setUrl(url);
                    setDefaultStatus();
                })
                .fail(function (reason) {
                    setFailedStatus(reason.title, reason.description)
                });
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

    function BackgroundModel(settings) {
        settings = settings || {
            image: {
                src: null,
                type: 'default'
            }
        };

        var that = this;
        that.image = ko.observable(settings.image.src);
        that.image.isUploading = ko.observable(false);
        that.image.isEmpty = ko.computed(function () {
            return !(that.image() && that.image().length > 0);
        });

        that.type = ko.observable(settings.image.type);
        that.type.default = function () {
            that.type('default');
        };
        that.type.repeat = function () {
            that.type('repeat');
        };
        that.type.fullscreen = function () {
            that.type('fullscreen');
        };

        that.errorTitle = ko.observable();
        that.errorDescription = ko.observable();
        that.hasError = ko.observable(false);

        that.changeImage = function () {
            if (that.image.isUploading()) {
                return;
            }

            app.upload(function () {
                that.image.isUploading(true);

                that.hasError(false);
                that.errorTitle(undefined);
                that.errorDescription(undefined);
            }).done(function (url) {
                that.image(url);
            }).fail(function (reason) {
                that.image(undefined);
                that.hasError(true);
                that.errorTitle(reason.title);
                that.errorDescription(reason.description);
            }).always(function () {
                that.image.isUploading(false);
            });
        };

        that.clearImage = function () {
            that.image(null);
        };

        that.getData = function () {
            return {
                image: {
                    src: that.image(),
                    type: that.type()
                }
            };
        };

    }

})(window.app = window.app || {});
