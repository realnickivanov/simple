define(['models/questions/question'],
    function (Question) {
        "use strict";

        function RankingTextQuestion(spec) {
            Question.call(this, spec, {
                getProgress: getProgress,
                restoreProgress: restoreProgress,

                submit: submit
            });

            this.correctOrder = _.map(spec.rankingItems, function (item) {
                return {
                    text: item.text
                };
            });

            this.rankingItems = _.shuffle(this.correctOrder);
        }

        return RankingTextQuestion;

        function submit(items) {
            var pattern = _.pluck(this.correctOrder, 'text'),
                answered = _.pluck(items, 'text');

            return _.isEqual(pattern, answered) ? 100 : 0;
        }

        function getProgress() {
            if (this.isCorrectAnswered) {
                return 100;
            } else {
                return _.pluck(this.rankingItems, 'text');
            }
        }

        function restoreProgress(progress) {
            if (progress === 100) {
                this.rankingItems = this.correctOrder;
                this.score(100);
            } else {
                var pattern = _.pluck(this.correctOrder, 'text');
                if (_.isEmpty(_.difference(pattern, progress))) {
                    this.rankingItems = _.map(progress, function(item) {
                        return {
                            text: item
                        };
                    });
                }
                this.score(0);
            }
        }
    });