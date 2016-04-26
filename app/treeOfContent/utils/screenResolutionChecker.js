define([], function () {

    var checker = {
        isLowResolution: ko.observable()
    };

    checkResolution();

    var lazyWindowResizeHandler = _.debounce(checkResolution, 300);
    $(window).on('resize', lazyWindowResizeHandler);

    function checkResolution() {
        checker.isLowResolution($(window).width() < 820);
    }

    return checker;
});