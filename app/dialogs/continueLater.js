define(['modules/progress/progressStorage/auth', 'context', 'userContext', 'templateSettings', 'includedModules/modulesInitializer'],
    function (auth, context, userContext, templateSettings, modulesInitializer) {

        var viewModel = {
            activate: activate,
            progressStorageActivated: false,
            email: '',
            sendSecretLink: sendSecretLink,
            isSecretLinkSent: ko.observable(false),
            keepMeLoggedIn: ko.observable(false),
            toggleKeepMeLoggedIn: toggleKeepMeLoggedIn
        };

        return viewModel;

        function sendSecretLink() {
            auth.sendSecreLink(userContext.user.email, context.course.title).then(function () {
                viewModel.isSecretLinkSent(true);
            });
        }
        
        function toggleKeepMeLoggedIn(){
            viewModel.keepMeLoggedIn(userContext.user.keepMeLoggedIn = !viewModel.keepMeLoggedIn())
            auth.shortTermAccess = !userContext.user.keepMeLoggedIn;
        }

        function activate(data) {
            if (data) {
                viewModel.close = data.close;
                viewModel.exit = function () {
                    if (!userContext.user.keepMeLoggedIn) {
                        auth.signout();
                    }
                    data.exit();
                };
                viewModel.progressStorageActivated = templateSettings.allowCrossDeviceSaving && !modulesInitializer.hasModule('lms');
                viewModel.email = userContext.user.email;
                viewModel.keepMeLoggedIn(userContext.user.keepMeLoggedIn);
            }
        }
    });