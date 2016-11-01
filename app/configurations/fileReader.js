define(['q', 'jquery'], function (Q, $) {
    'use strict';

    var ticks = new Date().getTime();

    function readJSON(filename) {
        var defer = Q.defer();
        $.getJSON(filename + '?_=' + ticks)
            .then(function (json) {
                defer.resolve(json)
            }).fail(function () {
                defer.resolve({});
            });
        return defer.promise;
    }

    return {
        readJSON: readJSON
    };
});