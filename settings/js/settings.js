(function (app) {

    var
        currentSettings = null,
        currentExtraData = null,
        baseURL = location.protocol + '//' + location.host;

    var viewModel = {
        trackingData: null,
        languages: null,
        logo: null,
        themes: null,

        masteryScore: ko.observable(100),
        userHasStarterPlan: ko.observable(false)
    };

    viewModel.getSettingsData = function () {
        return {
            logo: viewModel.logo.getData(),
            background: viewModel.background.getData(),
            xApi: viewModel.trackingData.getData(),
            theme: viewModel.themes.getData(),
            languages: viewModel.languages.getData(),
            masteryScore: {
                score: viewModel.masteryScore()
            }
        };
    };

    viewModel.getExtraData = function () {
        return {};
    };

    viewModel.saveChanges = function () {
        var settings = viewModel.getSettingsData(),
            extraData = viewModel.getExtraData(),
            newSettings = JSON.stringify(settings),
            newExtraData = JSON.stringify(extraData);

        if (JSON.stringify(currentSettings) === newSettings && JSON.stringify(currentExtraData) === newExtraData) {
            return;
        }

        window.egApi.saveSettings(newSettings, newExtraData, app.localize('changes are saved'), app.localize('changes are not saved'))
            .done(function () {
                currentSettings = settings;
                currentExtraData = extraData;
            });
    };

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().then(function () {
            var manifest = api.getManifest(),
                user = api.getUser(),
                settings = api.getSettings();

            if (user.accessType > 0) {
                viewModel.userHasStarterPlan(true);
            }

            if (settings.masteryScore && settings.masteryScore.score && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            }

            viewModel.trackingData = new app.TrackingDataModel(settings.xApi);
            viewModel.languages = new app.LanguagesModel(manifest.languages, settings.languages);
            viewModel.logo = new app.LogoModel(settings.logo);
            viewModel.themes = new app.ThemesModel(settings.theme);
            viewModel.background = new app.BackgroundModel(settings.background);

            currentSettings = viewModel.getSettingsData();
            currentExtraData = viewModel.getExtraData();

        }).fail(function () {
            api.sendNotificationToEditor(app.localize('settings are not initialize'), false);
        });
    };

    viewModel.init().done(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            $(window).on('blur', viewModel.saveChanges);
        });
    });

})(window.app = window.app || {});
