define(['knockout'], function (ko) {

    ko.bindingHandlers.syncHeightScope = {
        init: function (element, valueAccessor) {
            var
                value = valueAccessor(),
                scope = value && value.scope ? value.scope : 'question'
            ;

            _.defer(function () {
                var table = document.createElement('table');
                table.style.position = 'absolute';
                table.style.left = '-9999px';
                table.style.top = '-9999px';
                table.className = 'common-height-scope-' + scope;

                var tr = document.createElement('tr');

                [].forEach.call(
                    element.parentNode.querySelectorAll('[data-sync-height]'),
                    function (el) {
                        var td = document.createElement('td');
                        td.innerHTML = el.innerHTML;
                        tr.appendChild(td);
                    }
                );

                table.appendChild(tr);
                element.appendChild(table);

                var handler = function () {
                    var
                        el = element.parentNode.querySelector('[data-sync-height]'),
                        width = el ? el.clientWidth : 0;

                    [].forEach.call(
                        table.querySelectorAll('div'),
                        function (td) {
                            td.style.width = width + 'px';
                            td.style.maxWidth = width + 'px';
                        }
                    );


                    [].forEach.call(
                        element.parentNode.querySelectorAll('[data-sync-height]'),
                        function (td) {
                            td.style.height = table.clientHeight + 'px';
                        }
                    );
                }

                handler();

                var debounced = _.debounce(handler, 10);

                $(window).on('resize orientationchange', debounced);
                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $(window).off('resize orientationchange', debounced);
                });
            });

        }
    }

});