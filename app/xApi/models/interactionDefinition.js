define(['./activityDefinition'], function (activityDefinition) {
    "use strict";

    var interactionDefinition = function (spec) {

        spec.type = "http://adlnet.gov/expapi/activities/cmi.interaction";

        return new activityDefinition(spec);
    };

    return interactionDefinition;

});