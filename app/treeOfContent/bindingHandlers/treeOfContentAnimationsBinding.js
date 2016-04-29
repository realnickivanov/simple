define(['treeOfContent/utils/screenResolutionChecker', 'browserSupport'], function (screenResolutionChecker, browserSupport) {

    ko.bindingHandlers.treeOfContentAnimations = {
        init: function (element, valueAccessor) {
            var $html = $('html'),
                $body = $('body'),
                $element = $(element),
                resolutionChangeSubscription = screenResolutionChecker.isLowResolution.subscribe(onResolutionChanged),
                expandedChangeSubscription = valueAccessor().expanded.subscribe(onIsExpandedChanged);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                resolutionChangeSubscription.dispose();
                expandedChangeSubscription.dispose();
            });

            onResolutionChanged(screenResolutionChecker.isLowResolution());
            onIsExpandedChanged(ko.utils.unwrapObservable(valueAccessor().expanded));

            function onResolutionChanged(isLowResolution) {
                var isExpanded = ko.utils.unwrapObservable(valueAccessor().expanded);
                if (isLowResolution) {
                    setVisibilityWithoutAnimations(isExpanded ? 'visible' : 'hidden');
                } else {
                    $element.css({
                        visibility: 'visible',
                        webkitTtransition: 'left 0.2s ease-out',
                        transition: 'left 0.2s ease-out'
                    });
                }

                $body.css({
                    'max-height': isExpanded && isLowResolution ? '100vh' : 'none',
                    'overflow': isExpanded && isLowResolution ? 'hidden' : 'visible'
                });

                $html.css('overflow-y', isExpanded && isLowResolution ? 'hidden' : 'scroll');

                function setVisibilityWithoutAnimations(visibility) {
                    $element.css({
                        transition: 'transform 0s, opacity 0s, visibility 0s',
                        webkitTtransition: 'transform 0s, opacity 0s, visibility 0s'
                    });

                    $element.css({
                        visibility: visibility
                    });

                    $element.css({
                        webkitTtransition: 'transform 0.2s, opacity 0.2s, visibility 0.2s',
                        transition: 'transform 0.2s, opacity 0.2s, visibility 0.2s'
                    });
                }
            }

            function onIsExpandedChanged(isExpanded) {
                if (screenResolutionChecker.isLowResolution()) {
                    $html.css('overflow-y', isExpanded ? 'hidden' : 'scroll');

                    $body.css({
                        'max-height': isExpanded ? '100vh' : 'none',
                        'overflow': isExpanded ? 'hidden' : 'visible'
                    });

                    $element.css({
                        visibility: isExpanded ? 'visible' : 'hidden'
                    });
                }
            }
        }
    };
});