(function (app) {

    var url = location.protocol + '//' + location.host + '/storage/image/upload';

    app.upload = function (callback) {

        var deffered = $.Deferred();

        var form = $("<form>")
            .hide()
            .attr('method', 'post')
            .attr('enctype', 'multipart/form-data')
            .insertAfter("body");

        var input = $("<input>")
            //.attr('accept', settings.acceptedTypes)
            .attr('type', 'file')
            .attr('name', 'file')
            .on('change', function () {

                if (callback) {
                    callback();
                }

                var formData = new FormData();
                formData.append('file', this.files[0]);
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                }).done(function (response) {
                    try {
                        var obj = JSON.parse(response)

                        if (obj && obj.success && obj.data && obj.data.url) {

                            deffered.resolve(obj.data.url);
                        } else {
                            deffered.reject();
                        }

                    } catch (f) {
                        deffered.reject();
                    }

                }).fail(function (a, b, c) {
                    deffered.reject();
                });

            })
            .appendTo(form);

        input.click();

        return deffered.promise();
    }

})(window.app = window.app || {});
