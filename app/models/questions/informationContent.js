define(['models/questions/question'],
    function(Question) {
        "use strict";

        function InformationContent(spec) {
            Question.call(this, spec);
        }

        return InformationContent;
});