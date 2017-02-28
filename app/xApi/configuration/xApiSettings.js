define(['../constants'],
    function (constants) {

        var settings = {
            scoresDistribution: {
                positiveVerb: constants.verbs.passed
            },

            anonymousCredentials: {
                username: "",
                password: ""
            },

            xApi: {
                allowedVerbs: []
            },

            timeout: 120000,//2 minutes

            defaultLanguage: "en-US",
            xApiVersion: "1.0.0",


            init: init
        };

        var host = window.location.host;
        var lrsHost = (host.indexOf('localhost') === 0 || host.indexOf('elearning-staging') === 0 || host.indexOf('elearning-branches') === 0) ? 'reports-staging.easygenerator.com' : 'reports.easygenerator.com';

        var defaultXapi = {
            lrs: {
                uri: '//' + lrsHost + '/xApi/statements',
                authenticationRequired: false,
                credentials: {
                    username: '',
                    password: ''
                }
            },
            allowedVerbs: ['started', 'stopped', 'experienced', 'mastered', 'answered', 'passed', 'failed', 'progressed']
        };

        return settings;

        function init(templateSettings) {
            return Q.fcall(function () {
                $.extend(settings.xApi, templateSettings);

                if (templateSettings.selectedLrs == 'default') {
                    $.extend(settings.xApi, defaultXapi);
                }
            });
        }
    }
);