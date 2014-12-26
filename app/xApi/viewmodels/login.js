define(['durandal/app', 'plugins/router', 'eventManager', '../configuration/viewConstants', 'xApi/xApiInitializer', 'context'],
    function (app, router, eventManager, viewConstants, xApiInitializer, context) {

        "use strict";

        var viewModel = {
            activate: activate,

            courseTitle: "\"" + context.course.title + "\"",

            usermail: usermail(),
            username: username(),

            skip: skip,
            login: login
        };

        return viewModel;

        function usermail() {
            var value = ko.observable('');
            value.trim = function () {
                value(ko.utils.unwrapObservable(value).trim());
            };
            value.isValid = ko.computed(function () {
                return !!value() && viewConstants.patterns.email.test(value().trim());
            });
            value.isModified = ko.observable(false);
            value.markAsModified = function () {
                value.isModified(true);
                return value;
            };
            return value;
        }

        function username() {
            var value = ko.observable('');
            value.trim = function () {
                value(ko.utils.unwrapObservable(value).trim());
            };
            value.isValid = ko.computed(function () {
                return !!value() && !!value().trim();
            });
            value.isModified = ko.observable(false);
            value.markAsModified = function () {
                value.isModified(true);
                return value;
            };
            return value;
        };

        function skip() {
            xApiInitializer.deactivate();
            startCourse();
        };

        function login() {
            if (viewModel.usermail.isValid() && viewModel.username.isValid()) {
                xApiInitializer.activate(viewModel.username(), viewModel.usermail()).then(function () {

                    app.trigger('user:authenticated', {
                        username: viewModel.username(),
                        email: viewModel.usermail()
                    });
                    startCourse();
                });
            }
            else {
                viewModel.usermail.markAsModified();
                viewModel.username.markAsModified();
            }
        };

        function startCourse() {
            eventManager.courseStarted();
            router.navigate('');
        };

        function activate() { };
    });