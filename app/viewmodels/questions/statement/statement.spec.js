define(['viewmodels/questions/statement/statement'], function(viewModel) {
    "use strict";

    describe('viewModel [statement]', function() {

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        describe('question:', function() {
            it('should be defined', function() {
                expect(viewModel.question).toBeDefined();
            });
        });

        describe('content:', function() {
            it('should be defined', function() {
                expect(viewModel.content).toBeDefined();
            });
        });

        describe('statements:', function() {
            it('should be defined', function() {
                expect(viewModel.statements).toBeDefined();
            });
        });

        describe('initialize:', function() {
            it('should be a function', function() {
                expect(viewModel.initialize).toBeFunction();
            });
        });
    });
});