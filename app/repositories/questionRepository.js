define(['context', 'guard'], function (context, guard) {

    return {
        get: get
    };

    function get(sectionId, questionId) {
        guard.throwIfNotString(sectionId, 'section id is not a string');
        guard.throwIfNotString(questionId, 'Question id is not a string');

        var section = _.find(context.course.sections, function (item) {
            return item.id == sectionId;
        });

        if (!section) {
            return null;
        }
        var question = _.find(section.questions, function (item) {
            return item.id == questionId;
        });
        
        if (!question) {
            return null;
        }

        return question;
    }

})