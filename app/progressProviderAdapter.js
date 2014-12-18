define([], function () {

    var adapter = {
        current: null,
        register: function (provider) {
            if (_.isFunction(provider.getProgress) && _.isFunction(provider.saveProgress)) {
                adapter.current = provider;
            } else {
                throw 'Cannot register progress provider';
            }
        }
    };

    return adapter;

});
