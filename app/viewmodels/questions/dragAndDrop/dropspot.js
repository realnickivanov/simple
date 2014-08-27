define([],
    function () {

        function Dropspot(spec) {
            var self = this;
            this.position = spec.position;
            this.limit = spec.limit;
            this.items = spec.items;

            this.allowDrop = function (items) {
                return items().length < self.limit;
            };

            this.afterMove = function (args) {
                self.updateItemPosition(args.item);
            };

            this.updateItemPosition = function (item) {
                item.position = self.position;
            };
        }
        return Dropspot;
    }
);