define(['models/questions/statementQuestion'], function(StatementQuestion) {
    "use strict";

    describe('model [StatementQuestion]', function() {

        it('should be a function', function() {
            expect(StatementQuestion).toBeFunction();
        });

        describe('statements:', function() {
            var spec = {
                statements: [
                    {
                        id: 'statement1',
                        text: 'statement1 text',
                        isCorrect: true
                    },
                    {
                        id: 'statement2',
                        text: 'statement2 text',
                        isCorrect: false
                    },
                    {
                        id: 'statement3',
                        text: 'statement3 text',
                        isCorrect: true
                    }
                ]
            },
            statementQuestion;

            beforeEach(function() {
                statementQuestion = new StatementQuestion(spec);
            });

            it('should be array', function() {
                expect(statementQuestion.statements).toBeArray();
            });
        });

    });
});