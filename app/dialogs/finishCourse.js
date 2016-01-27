define([], function () {

    var viewModel = {
        activate: activate
    };

    return viewModel;

    function activate(data) {
        if (data) {
            viewModel.close = data.close;
            viewModel.exit = data.exit;
            viewModel.cancel = data.cancel;

            viewModel.finish = function () {
                data.finish();
                data.close();
            }
        }
    }
});