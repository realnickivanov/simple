define(['../guard'],
    function (guard) {

        var activityDefinition = function (spec) {

            if (typeof spec == typeof undefined) {
                throw 'You should provide a specification to create an ActivityDefinition';
            }

            var obj = {};

            guard.throwIfNotLanguageMap(spec.name, 'You should provide name for ActivityDefinition');

            if (typeof spec.name != typeof undefined) {
                obj.name = spec.name;
            }

            if (typeof spec.type != typeof undefined) {
                obj.type = spec.type;
            }

            if (typeof spec.interactionType != typeof undefined) {
                obj.interactionType = spec.interactionType;
            }

            if (typeof spec.correctResponsesPattern != typeof undefined) {
                obj.correctResponsesPattern = spec.correctResponsesPattern;
            }

            if (typeof spec.choices != typeof undefined) {
                obj.choices = spec.choices;
            }

            if (typeof spec.source != typeof undefined) {
                obj.source = spec.source;
            }

            if (typeof spec.target != typeof undefined) {
                obj.target = spec.target;
            }

            return obj;
        };

        return activityDefinition;
    }
);