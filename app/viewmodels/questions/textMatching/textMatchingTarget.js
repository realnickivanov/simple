define(function () {

    return function (value) {
        this.value = ko.observable(value);

        this.acceptValue = function (value) {
            this.value(value);
        };
        this.rejectValue = function () {
            this.value(null);
        };
    };

})