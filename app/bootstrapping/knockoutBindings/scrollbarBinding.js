define(['durandal/composition', 'perfectScrollbar', 'browserSupport'], function (composition, perfectScrollbar, browserSupport) {

    ko.bindingHandlers.scrollbar = {
        init: function (element, valueAccessors) {
            if (browserSupport.isMobileDevice) {
                $(element).css({
                    'overflow-y': 'auto',
                    '-webkit-overflow-scrolling': 'touch'
                });
                return;
            }

            var byClass = valueAccessors().byClass;
            var checkDOMChanges = valueAccessors().checkDOMChanges;
            var scrollToEndAfterDOMChanged = valueAccessors().scrollToEndAfterDOMChanged;
            var cssClasses = {
                scrollStarted: 'cs-scroll-started',
                scrollFinished: 'cs-scroll-finished',
                scrollEnabled: 'cs-scroll-enabled'
            };

            var customScrollbarContainer = byClass ? element.getElementsByClassName(byClass)[0] : element;

            perfectScrollbar.initialize(customScrollbarContainer, {
                suppressScrollX: true
            });

            if (checkDOMChanges) {
                refreshScrollAfterDomChanged();
            }

            document.addEventListener('ps-y-reach-start', function () {
                customScrollbarContainer.classList.remove(cssClasses.scrollStarted);
            });

            document.addEventListener('ps-y-reach-end', function () {
                customScrollbarContainer.classList.add(cssClasses.scrollFinished);
            });

            document.addEventListener('ps-scroll-up', function () {
                customScrollbarContainer.classList.remove(cssClasses.scrollFinished);
            });

            document.addEventListener('ps-scroll-down', function () {
                customScrollbarContainer.classList.add(cssClasses.scrollStarted);
            });

            scrollEnabled();

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                perfectScrollbar.destroy(customScrollbarContainer);
            });

            function refreshScrollAfterDomChanged() {
                var scrollHeight = customScrollbarContainer.clientHeight;
                var timeout = setTimeout(function () {
                    perfectScrollbar.update(customScrollbarContainer);
                    if (scrollToEndAfterDOMChanged && scrollHeight !== customScrollbarContainer.clientHeight) {
                        scrollHeight = customScrollbarContainer.clientHeight;
                        customScrollbarContainer.scrollTop = customScrollbarContainer.scrollHeight;
                    }
                    scrollEnabled();

                    refreshScrollAfterDomChanged();
                }, 500);

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () { clearTimeout(timeout); });
            }

            function scrollEnabled() {
                customScrollbarContainer.classList.toggle(cssClasses.scrollEnabled, customScrollbarContainer.scrollHeight > customScrollbarContainer.clientHeight);
            }
        }
    };

    composition.addBindingHandler('scrollbar');

});