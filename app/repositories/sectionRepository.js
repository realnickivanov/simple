define(['guard'], function (guard) {

    return {
        get: get
    };

    function get(sectionId) {
        var context = require('context');
        guard.throwIfNotString(sectionId, 'section id is not a string');

        var section = _.find(context.course.sections, function (item) {
            return item.id == sectionId;
        });

        if (!section) {
            return null;
        }

        return section;
    }

});