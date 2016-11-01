define(['jquery'], function ($) {
    'use strict';

    return {
        get: get,
        post: post
    };

    function get(url, query, headers) {
        return $.ajax(url, {
            data: query,
            headers: headers,
            cache: false
        });
    }

    function post(url, data, headers) {
        return $.ajax(url, {
            method: 'POST',
            data: data,
            headers: headers,
            cache: false
        });
    }

});