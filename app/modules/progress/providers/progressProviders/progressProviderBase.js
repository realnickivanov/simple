define(['../../constants'], function(constants) {
    'use strict';

    function ProgressProviderBase(courseId, templateId) {
        this.courseId = courseId;
        this.templateId = templateId;
        
        Object.defineProperty(this, 'progressKey', {
            get: function () {
                return constants.progressKey + this.courseId + this.templateId;
            }
        });
        
        Object.defineProperty(this, 'resultKey', {
            get: function () {
                return constants.resultKey + courseId + templateId;
            }
        });
        
        this.getProgress = function (){
            throw 'Child class (' + this.constructor.name + ') must implement method -> getProgress';
        };
        
        this.saveProgress = function (){
            throw 'Child class (' + this.constructor.name + ') must implement method -> saveProgress';
        };
        
        this.saveResults = function (){
            throw 'Child class (' + this.constructor.name + ') must implement method -> saveResults';
        };
        
        this.removeProgress = function (){
            throw 'Child class (' + this.constructor.name + ') must implement method -> removeProgress';
        };
    }
    
    return ProgressProviderBase;
});