(function () {
    var apiData = {
        isInited: false
    };

    var
        baseUrl = location.protocol + '//' + location.host,
        identifyUrl = baseUrl + '/api/identify',
        settingsUrl = baseUrl + '/api/course/' + getURLParameter('courseId') + '/template/' + getURLParameter('templateId'),
        manifestUrl = baseUrl + location.pathname.replace('settings/settings.html', 'manifest.json');

    window.egApi = {
        init: init,
        getManifest: getManifest,
        getUser: getUser,
        getSettings: getSettings,
        saveSettings: saveSettings,
        sendNotificationToEditor: sendNotificationToEditor
    };

    function init() {
        //Mock for debugging
        //var userDataPromise = $.Deferred().resolve({ subscription: { accessType: 1, expirationDate: new Date(2016, 1, 1) } });
        //var settingsPromise = $.Deferred().resolve({});
        //var manifestPromise = $.Deferred().resolve({});

        var userDataPromise = $.ajax({
            url: identifyUrl,
            cache: false,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });

        var settingsPromise = $.ajax({
            cache: false,
            url: settingsUrl,
            dataType: 'json',
            contentType: 'application/json'
        });

        var manifestPromise = $.ajax({
            cache: false,
            url: manifestUrl,
            dataType: 'json',
            contentType: 'application/json',
        });

        return $.when(manifestPromise, userDataPromise, settingsPromise).done(function (manifestResponse, userDataResponse, settingsResponse) {
            apiData.manifest = manifestResponse[0];
            apiData.settings = settingsResponse[0];
            apiData.user = getUserModel(userDataResponse);
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
        var defaultSettings = {
            logo: {},
            xApi: {
                enabled: true,
                selectedLrs: "default",
                lrs: {
                    credentials: {}
                }
            },
            masteryScore: {}
        };

        return apiData.settings || defaultSettings;
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

    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    function saveSettings(settings, extraSettings, successSaveMessage, failSaveMessage) {
        freezeEditor();

        return $.post(settingsUrl, { settings: settings, extraSettings: extraSettings })
            .done(function () {
                sendNotificationToEditor(successSaveMessage, true);
            })
            .fail(function () {
                sendNotificationToEditor(failSaveMessage, false);
            })
            .always(function () {
                unfreezeEditor();
            });
    }

    function freezeEditor() {
        postMessageToEditor({ type: 'freeze', data: { freezeEditor: true } });
    }

    function unfreezeEditor() {
        postMessageToEditor({ type: 'freeze', data: { freezeEditor: false } });
    }

    function postMessageToEditor(data) {
        var editorWindow = window.top;
        editorWindow.postMessage(data, editorWindow.location.href);
    }

    function sendNotificationToEditor(message, isSuccess) {
        postMessageToEditor({ type: 'notification', data: { success: isSuccess || true, message: message } });
    }

})();