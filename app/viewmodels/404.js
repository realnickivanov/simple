define([], function () {
    var viewModel = {
        homeUrl: '#sections',
        activate: activate
    };

    return viewModel;

    function activate(homeUrl) {
        if (homeUrl) {
            viewModel.homeUrl = homeUrl;
        }
    }
});