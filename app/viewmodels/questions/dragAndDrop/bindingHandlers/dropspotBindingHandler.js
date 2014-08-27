define(['knockout', 'browserSupport'], function (ko, browserSupport) {
    ko.bindingHandlers.dropspot = {
        init: function (element, valueAccessor, allBindingsAccessor, data, context) {
            var $currentDropspot = $(element),
                value = valueAccessor() || {},
                containerClass = value.containerClass || '',
                containerSelector = '.' + containerClass,
                connectClass = value.connectClass || 'ko_container',
                connectSelector = '.' + connectClass,
                dropspotClass = value.dropspotClass || '',
                dropspotSelector = '.' + dropspotClass,
                options = value.options || {},
                startActual = options.activate,
                stopActual = options.start;

            var start = function (event, ui) {
                var $textElement = ui.helper;

                var width = $textElement.outerWidth();
                var height = $textElement.outerHeight();
                var $placeholder = ui.placeholder;

                $(containerSelector).addClass('drag');

                $placeholder.outerWidth(width).outerHeight(height);

                $(dropspotSelector + connectSelector).innerWidth(width + 8).innerHeight(height + 4);

                if ($currentDropspot.hasClass(dropspotClass)) {
                    $currentDropspot.innerWidth(width + 8).innerHeight(height + 4);
                    $currentDropspot.addClass('current');
                }

                if (startActual) {
                    startActual.apply(this, arguments);
                }
            };

            var beforeStop = function (event, ui) {
                if ($currentDropspot.hasClass(dropspotClass)) {
                    $currentDropspot.removeClass('current');
                }
            }

            var stop = function () {
                $(containerSelector).removeClass('drag');

                $(dropspotSelector).width('auto').height('auto');

                if (stopActual) {
                    stopActual.apply(this, arguments);
                }
            }

            ko.utils.extend(options, {
                cursorAt: { left: 5, top: 10 },
                tolerance: 'pointer',
                helper: 'clone',
                scroll: false,
                appendTo: containerSelector,
                start: start,
                beforeStop: beforeStop,
                stop: stop
            });

            value.options = options;

            var newValueAccessor = function () {
                return value;
            }
            return ko.bindingHandlers.sortable.init.call(this, element, newValueAccessor, allBindingsAccessor, data, context);
        },
        update: function (element, valueAccessor, allBindingsAccessor, data, context) {
            return ko.bindingHandlers.sortable.update.call(this, element, valueAccessor, allBindingsAccessor, data, context);
        }
    }
})
