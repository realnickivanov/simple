define([], function () {
    return function (id, key) {

        this.id = id;
        this.key = key;
        this.value = ko.observable();

        this.acceptValue = function (value) {
            this.value(value);
        };
        this.rejectValue = function () {
            this.value(null);
        };
    };
})