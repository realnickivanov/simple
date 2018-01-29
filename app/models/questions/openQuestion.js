define(['models/questions/question', 'guard'], function (Question, guard) {
    "use strict";

    function OpenQuestion(spec) {
        Question.call(this, spec, {
            getProgress: getProgress,
            restoreProgress: restoreProgress,

            submit: submitAnswer
        });

        this.answeredText = '';
        this.refreshLearningContext = refreshLearningContext;
    }

    return OpenQuestion;

    function getProgress() {
        return this.isAnswered ? this.answeredText : 0;
    }

    function restoreProgress(progress) {
        if (progress === 0) {
            return;
        }

        this.answeredText = progress;
        this.score(progress ? 100 : 0);
    }

    function submitAnswer(answeredText) {
        guard.throwIfNotString(answeredText);
        this.answeredText = answeredText;
        return answeredText ? 100 : 0;
    }

    function refreshLearningContext(context) {
        if (_.isArray(this.learningContents)) {
            for (var i = 0, len = this.learningContents.length; i < len; i++) {
                var learningContent = this.learningContents[i];
                if (learningContent && learningContent.content)
                {
                    var content = $(learningContent.content);
                    var firstQuestionHtml = content.find(".linked-question-title");
                    var firstAnswerHtml = content.find(".response-to-be-revised");
                    if (firstQuestionHtml.length && firstAnswerHtml.length) {
                        var firstQuestion = findQuestion(context, 'title', $(firstQuestionHtml[0]).text().trim() , this.type);
                        if (firstQuestion) {
                            firstAnswerHtml.text(firstQuestion.answeredText);
                        }
                        else {
                            firstAnswerHtml.html('<br>');
                        }
                        learningContent.content = content.prop('outerHTML');
                        return;
                    }
                }
            }
        }
    }

    function findQuestion(context, searchProperty, searchPropertyValue, questionType) {
        if (_.isArray(context.course.sections)) {
            for (var i = 0, len = context.course.sections.length; i < len; i++) {
                var section = context.course.sections[i];
                if (_.isArray(section.questions)) {
                    for (var j = 0, len2 = section.questions.length; j < len2; j++) {
                        var question = section.questions[j];
                        if (question &&
                            question.type &&
                            question.type === questionType &&
                            question[searchProperty] &&
                            question[searchProperty] === searchPropertyValue)
                        {
                            return question;
                        }
                    }
                }
            }
        }
        return null;
    }
});