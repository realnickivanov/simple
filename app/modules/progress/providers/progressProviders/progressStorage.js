define(['./progressProviderBase', '../../commands/progress'], function(ProgressProviderBase, progressCommand) {
    'use strict';

    function ProgressStorageProvider(courseId, templateId) {
        ProgressProviderBase.call(this, courseId, templateId);

        this.getProgress = function() {
            return progressCommand.get(this.courseId, this.templateId);
        };

        this.saveProgress = function(progress) {
            return progressCommand.set(this.courseId, this.templateId, progress);
        };

        this.saveResults = function(getScore, getStatus, errorMessage) {
            //TODO: implement this method if you need to save result about course in progress storage
        };

        this.removeProgress = function() {
            return progressCommand.set(this.courseId, this.templateId, null);
        };
    }

    return ProgressStorageProvider;
});