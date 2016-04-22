define(['modules/progress/index', 'userContext'], function (progressProvider, userContext) {

    var viewModel = {
        activate: activate,
        stayLoggedIn: ko.observable(userContext.keepMeLoggedIn),
        toggleStayLoggedIn: toggleStayLoggedIn
    };

    return viewModel;
    
    function toggleStayLoggedIn(){
        viewModel.stayLoggedIn(!viewModel.stayLoggedIn());
        userContext.keepMeLoggedIn = viewModel.stayLoggedIn();
    }

    function activate(data) {
        if (data) {
            viewModel.close = data.close;
            viewModel.finish = function (){
                if (!viewModel.stayLoggedIn()) {
                    data.finish(progressProvider.logOut);
                }
                data.finish();
            };
            viewModel.stayLoggedIn(userContext.keepMeLoggedIn);
        }
    }
});