define(['viewmodels/questions/informationContent'], function (viewModel) {
    "use strict";

    var
        navigationModule = require('modules/questionsNavigation'),
        router = require('plugins/router');

    describe('viewmodel [informationContent]', function () {

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('title:', function() {

            it('should be defined', function() {
                expect(viewModel.title).toBeDefined();
            });

        });

        describe('learningContents:', function () {

            it('should be defined', function() {
                expect(viewModel.learningContents).toBeDefined();
            });

        });

        describe('navigateNext:', function () {

            it('should be function', function() {
                expect(viewModel.navigateNext).toBeFunction();
            });

            beforeEach(function() {
                spyOn(router, 'navigate');
            });

            describe('when viewModel.navigationContext.nextQuestionUrl is defined', function () {

                beforeEach(function() {
                    viewModel.navigationContext = { nextQuestionUrl: '123' };
                });

                it('should navigate to viewModel.navigationContext.nextQuestionUrl value', function () {
                    viewModel.navigateNext();
                    expect(router.navigate).toHaveBeenCalledWith(viewModel.navigationContext.nextQuestionUrl);
                });

            });

            describe('when viewModel.navigationContext.nextQuestionUrl is undefined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: undefined };
                });

                it('should navigate to \'objectives\'', function () {
                    viewModel.navigateNext();
                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

            });

        });

        describe('navigateNextText:', function() {

            it('should be function', function() {
                expect(viewModel.navigateNextText).toBeFunction();
            });

            describe('when viewModel.navigationContext.nextQuestionUrl is defined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: '123' };
                });

                it('should return \'Next\' text', function () {
                    expect(viewModel.navigateNextText()).toBe('Next');
                });

            });

            describe('when viewModel.navigationContext.nextQuestionUrl is undefined', function () {

                beforeEach(function () {
                    viewModel.navigationContext = { nextQuestionUrl: undefined };
                });

                it('should return \'Go to learning objectives\' text', function () {
                    expect(viewModel.navigateNextText()).toBe('Go to learning objectives');
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function() {
                expect(viewModel.activate()).toBePromise();
            });

            var question = { title: 'question title', id: '0', learningContents: [{ id: '0' }, { id: '1' }] };
            beforeEach(function() {
                spyOn(navigationModule, 'getNavigationContext').andReturn({});
            });

            it('should set title', function() {
                viewModel.title = null;

                var promise = viewModel.activate('0', question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.title).toBe(question.title);
                });
            });

            it('should set navigationContext', function () {
                viewModel.navigationContext = null;

                var promise = viewModel.activate('0', question);

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(viewModel.navigationContext).not.toBeNull();
                });
            });

            it('should set learningContents', function () {
                viewModel.learningContents = null;

                var promise = viewModel.activate('0', question);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.learningContents).toBe(question.learningContents);
                });
            });

        });

    });

});