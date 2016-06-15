define(['plugins/http', 'q', 'jquery'], function(http, Q, $) {
    'use strict';

    function HttpWrapper() {
        this.get = function(url, query, headers) {
            return $.ajax(url, {
                data: query,
                headers: headers,
                cache: false
            });
        };

        this.post = function(url, data, headers) {
            return $.ajax(url, {
                method: 'POST',
                data: data,
                headers: headers,
                cache: false
            });
        };
    }

    return new HttpWrapper();
});