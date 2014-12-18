define(function () {
    var context = function(spec) {
        if (typeof spec == typeof undefined) {
            throw 'You should provide a specification to create Context';
        }
        
        var obj = {};
        
        if (_.isObject(spec.contextActivities)) {
            obj.contextActivities = spec.contextActivities;
        }

        if (_.isObject(spec.extensions)) {
            obj.extensions = spec.extensions;
        }

        return obj;
    };

    return context;
});