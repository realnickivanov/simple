(function (app) {

    app.LogoModel = LogoModel;
    app.ThemesModel = ThemesModel;
    app.ThemeModel = ThemeModel;

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
    }

    function ThemesModel() {
        var that = this;

        that.list = [
            new app.ThemeModel('cartoon', true),
            new app.ThemeModel('grey'),
            new app.ThemeModel('black'),
            new app.ThemeModel('flat')
        ];

        that.selected = ko.computed(function () {
            var selectedName = '';
            ko.utils.arrayForEach(that.list, function (theme) { //foreach because of we need to track selecting of all themes
                if (theme.isSelected()) {
                    selectedName = theme.name;
                }
            });
            return selectedName;
        }, that);

        that.setSelected = setSelected;
        that.openDemo = openDemo;

        return that;

        function setSelected(name) {
            ko.utils.arrayForEach(that.list, function (theme) {
                theme.isSelected(theme.name === name);
            });
        }

        function openDemo() {
            var index = location.toString().indexOf('/settings/settings');
            var templateUrl = location.toString().substring(0, index);

            var params = [
                'v=' + new Date().getTime(),
                'theme=' + that.selected()
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

})(window.app || {});