define(['treeOfContent/treeNodes/TreeNode', 'treeOfContent/treeNodes/QuestionTreeNode', 'repositories/sectionRepository'],
    function (TreeNode, QuestionTreeNode, sectionRepository) {

        return function (sectionId, title) {
            TreeNode.call(this, sectionId, title);
            this.children = [];

            this.isExpanded = ko.observable(false);
            this.toggleIsExpanded = toggleIsExpanded;
            this.activate = activate;
            this.activateQuestion = activateQuestion;
            this.hasActiveQuestion = ko.observable(false);
        };

        function activate() {
            var sectionId = this.id;
            this.children = _.chain(sectionRepository.get(sectionId).questions)
                .map(function (question) {
                    return new QuestionTreeNode(question.id, question.title, question.isInformationContent,
                        '#section/' + sectionId + '/question/' + question.id);
                })
                .value();

            this.hasChildren = this.children.length > 0;
        }

        function activateQuestion(url) {
            var self = this;
            self.hasActiveQuestion(false);
            this.children.forEach(function (question) {
                var isQuestionToActivate = question.url === url;
                question.isActive(isQuestionToActivate);
                if (isQuestionToActivate) {
                    self.isExpanded(true);
                    self.hasActiveQuestion(true);
                }
            });
            
            return self.hasActiveQuestion();
        }

        function toggleIsExpanded() {
            this.isExpanded(!this.isExpanded());
        }
    }
);