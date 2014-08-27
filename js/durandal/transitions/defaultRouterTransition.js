define(['durandal/system', 'durandal/composition', 'jquery'], function (system, composition, $) {
    var defaultRouterTransition = function (context) {

        return system.defer(function (dfd) {
            if (context.bindingContext.$data && context.bindingContext.$data.isNavigatingToAnotherView && ko.isObservable(context.bindingContext.$data.isNavigatingToAnotherView)) {
                composition.current.complete(function () {
                    context.bindingContext.$data.isNavigatingToAnotherView(false);
                    if (!context.keepScrollPosition) {
                        $(window).scrollTop(0);
                    }

                });
            }
        
            context.triggerAttach();

            $(context.child).show();

            dfd.resolve();
        }).promise();

    };

    return defaultRouterTransition;
});
