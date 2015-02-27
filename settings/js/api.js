(function (api) {
    var apiData = {
        isInited: false
    };

    window.egApi = {
        apiinit: init,
        getManifest: getManifest,
        getUser: getUser,
        getSettings: getSettings
    }

    function init() {
        var manifestPromise = $.Deferred().resolve({});
        var userDataPromise = $.Deferred().resolve({ subscription: { accessType: 1 } });
        var settingsPromise = $.Deferred().resolve({
            logo: {},
            xApi: {
                enabled: true,
                selectedLrs: 'default',
                lrs: {
                    credentials: {}
                }
            },
            masteryScore: {}
        });

        //var userDataPromise = $.ajax({
        //    url: baseURL + '/api/identify',
        //    cache: false,
        //    type: 'POST',
        //    contentType: 'application/json',
        //    dataType: 'json'    
        //    }
        //});

        //var settingsPromise = $.ajax({
        //    cache: false,
        //    url: settingsURL,
        //    dataType: 'json'
        //    contentType: 'application/json',
        //});


        //var manifestPromise = $.ajax({
        //    cache: false,
        //    url: baseURL + '/manifest.json',
        //    dataType: 'json',
        //    contentType: 'application/json',
        //});

        return $.when(manifestPromise, userDataPromise, settingsPromise).done(function (manifestResponse, userDataResponse, settingsResponse) {
            apiData.manifest = manifestResponse;
            apiData.user = getUserModel(userDataResponse);
            apiData.settings = getSettingsModel(settingsResponse);
            apiData.isInited = true;
        });
    }

    function isInitedGuard() {
        if (!apiData.isInited) {
            throw "Sorry, but you've tried to use api before it was initialized";
        }
    }

    function getManifest() {
        isInitedGuard();
        return apiData.manifest;
    }

    function getUser() {
        isInitedGuard();
        return apiData.user;
    }

    function getSettings() {
        isInitedGuard();
        return apiData.settings;
    }

    function getUserModel(userData) {
        var user = { accessType: 0 };
        var starterAccessType = 1;
        if (userData.subscription &&
            userData.subscription.accessType &&
            userData.subscription.accessType >= starterAccessType &&
            new Date(userData.subscription.expirationDate) >= new Date()
           ) {
            user.accessType = userData.subscription.accessType;
        }
        return user;
    }

    function getSettingsModel(settingsData) {
        var settings;
        if (settingsData.settings && settingsData.settings.length > 0) {
            settings = JSON.parse(settingsData.settings);
        } else {
            settings = {
                logo: {},
                xApi: {
                    enabled: true,
                    selectedLrs: 'default',
                    lrs: {
                        credentials: {}
                    }
                },
                masteryScore: {}
            };
        }
        return settings;
    }

})();