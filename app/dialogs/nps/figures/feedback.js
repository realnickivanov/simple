define(['templateSettings'], function(templateSettings) {
    var viewModel = {
        score: 0,
        feedbackColor: '',
        textColor: templateSettings.getColorValue('@text-color'),
        activate: activate
    };

    function activate(score) {
        var colorName = score > 6 ? '@correct-color' : '@secondary-color';
        viewModel.feedbackColor = templateSettings.getColorValue(colorName);
        viewModel.score = score;
    }

    return viewModel;
});