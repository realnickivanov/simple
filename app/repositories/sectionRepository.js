define(['guard', 'context'], function (guard, context) {

    return {
        get: get,
        getSectionByQuestionId: getSectionByQuestionId
    };

    function get(sectionId) {
        guard.throwIfNotString(sectionId, 'section id is not a string');

        var section = _.find(context.course.sections, function (item) {
            return item.id == sectionId;
        });

        if (!section) {
            return null;
        }

        return section;
    }

    function getSectionByQuestionId(questionId) {
        guard.throwIfNotString(questionId, 'Question id is not a string');

        var foundSection;
        _.each(context.course.sections, function (section) {
            _.each(section.questions, function (item) {
                if (item.id === questionId) {
                    foundSection = section;
                }
            });
        });

        return foundSection;
    }
});