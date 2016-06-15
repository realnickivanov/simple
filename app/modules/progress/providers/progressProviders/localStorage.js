define(['./progressProviderBase'], function (ProgressProviderBase) {
    'use strict';
    
    function LocalStorageProgressProvider(courseId, templateId) {
        ProgressProviderBase.call(this, courseId, templateId);
        
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
        
        this.saveResults = function (getScore, getStatus, errorMessage) {
            var result = {
                score: getScore(),
                status: getStatus()
            };
            try {
                localStorage.setItem(this.resultKey, JSON.stringify(result));
            } catch (e) {
                if(typeof errorMessage === 'string'){
                    alert(errorMessage);
                } else{
                    alert('Not enough browser memory to save your progress');
                }
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