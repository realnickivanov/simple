define(['treeOfContent/treeNodes/TreeNode', 'plugins/router'], function (TreeNode, router) {

    return function (id, title, isInformationContent, url) {
        TreeNode.call(this, id, title);
        var self = this;
        this.url = url;
        this.isActive = ko.observable(false);
        this.isInformationContent = isInformationContent;
        this.canNavigate = ko.computed(function () {
            return !self.isActive() && !router.isNavigationLocked();
        });
    };
});