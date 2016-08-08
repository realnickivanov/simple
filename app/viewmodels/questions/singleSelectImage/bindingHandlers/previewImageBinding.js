define(['durandal/app', 'constants', 'knockout', 'durandal/composition', 'widgets/imagePreview/viewmodel'],
    function (app, constants, ko, composition, imagePreview) {
        app.on(constants.events.imagePreviewClosed, function (id) {
            $('#' + id).focus();
        });

        ko.bindingHandlers.previewImage = {
            init: function (element, valueAccessor) {
                var $element = $(element),
                    $data = valueAccessor();

                if ($data) {
                    $element.on('click', function () {
                        imagePreview.openPreviewImage($data);
                    }).on('keydown', function (event) {
                        if (event.which == 13) {
                            event.preventDefault();
                            event.stopPropagation();
                            $element.click();
                        }
                    });
                }
            }
        };

        composition.addBindingHandler('previewImage');
    });