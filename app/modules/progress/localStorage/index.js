define(['context', 'translation', '../constants'], function (context, translation, constants) {
    'use strict';
    
    function LocalStorageProgressProvider(courseId, templateId) {
        this.courseId = courseId;
        this.templateId = templateId;

        this.progressKey = constants.progressKey +this.courseId+this.templateId;
        this.resultKey = constants.resultKey +this.courseId+this.templateId;
        
        this.getProgress = function () {
            var progress = {};
            try {
                progress = JSON.parse(localStorage.getItem(this.progressKey));
            } catch (e) {
                console.log('Unable to restore progress from localStorage');
            }
            return progress;
        };
        
        this.saveProgress = function(progress){
            try {
                localStorage.setItem(this.progressKey, JSON.stringify(progress));
            } catch (e) {
                return false;
            }
            return true;
        };
        
        this.saveResults = function () {
            var result = {
                score: context.course.score(),
                status: context.course.getStatus()
            };

            try {
                localStorage.setItem(this.resultKey, JSON.stringify(result));
            } catch (e) {
                alert(translation.getTextByKey('[not enough memory to save progress]'));
            }
            return true;
        };
        
        this.removeProgress = function () {
            try {
                localStorage.removeItem(this.progressKey);
            } catch (e) {
                console.log('Unable to remove progress from localStorage');
            }
            return true;
        };
    }
    
    return LocalStorageProgressProvider;
});