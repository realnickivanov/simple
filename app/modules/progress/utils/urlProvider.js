define([], function() {
    'use strict';

    function UrlProvider() {
        this.progressStorageUrl = (function(){
            var devProgressStorageUrl = '//progress-storage-staging.easygenerator.com/';
            var liveProgressStorageUrl = '//progress-storage.easygenerator.com/';
            
            if (useDevProgressService()){
                return devProgressStorageUrl;
            }
            
            return liveProgressStorageUrl;
            
            function useDevProgressService(){
                var host = window.location.host;
                var pathname = window.location.pathname;
                return host.indexOf('localhost') === 0 || host.indexOf('elearning-staging') === 0 || host.indexOf('elearning-branches') === 0;
            }            
        })();
        
        this.courseLink = (function(){
            return window.location.protocol+ '//' + window.location.host + window.location.pathname;
        })();
    }
    
    return new UrlProvider();
});