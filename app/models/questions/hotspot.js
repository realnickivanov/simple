define(['models/questions/question', 'guard', 'eventManager', 'eventDataBuilders/questionEventDataBuilder'],
    function(Question, guard, eventManager, eventDataBuilder) {
        "use strict";

        function Hotspot(spec) {            
            Question.call(this, spec);

            this.background = spec.background;
            this.spots = spec.spots;
            this.singleAnswer = spec.singleAnswer;
            this.placedMarks = [];

            this.submitAnswer = function (marks) {
                guard.throwIfNotArray(marks, 'Marks is not array.');

                this.isAnswered = true;                
                this.placedMarks = _.map(marks, function(mark) { return { x: mark.x, y: mark.y }; });
                
                var scores = calculateScore(this.singleAnswer, this.spots, this.placedMarks);

	           	this.score(scores);
	           	this.isCorrectAnswered = scores == 100;

                eventManager.answersSubmitted(
                    eventDataBuilder.buildHotspotQuestionSubmittedEventData(this)
                );
	       	};            
        };

        return Hotspot;

        function calculateScore(singleAnswer, spots, placedMarks) {
            var answerCorrect;
            if (singleAnswer) {
                answerCorrect = _.some(spots, function (spot) {
                    return markIsInSpot(placedMarks[0], spot);
                });                
            } else {
                var markedSpotsCount = 0;                
                var markersInSpotsCount = 0;

                _.each(spots, function(spot){
                    var counter = 0;

                    _.each(placedMarks, function(mark){
                        if (markIsInSpot(mark, spot)){
                            counter++;
                        }
                    });

                    if (counter > 0){
                        markedSpotsCount++;
                        markersInSpotsCount += counter;
                    }

                });                
                answerCorrect = markedSpotsCount === spots.length && markersInSpotsCount === placedMarks.length;
            }

            return answerCorrect ? 100 : 0;
        }

        function markIsInSpot (mark, spot) {
            var x = mark.x, y = mark.y;
            
            var inside = false;
            for (var i = 0, j = spot.length - 1; i < spot.length; j = i++) {
                var xi = spot[i].x, yi = spot[i].y;
                var xj = spot[j].x, yj = spot[j].y;
                
                var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            
            return inside;
        };
});