define(['durandal/system', 'durandal/composition', 'durandal/app', 'constants'], function (system, composition, app, constants) {
    "use strict";

    var imagePreviewModel = {
        imageId: ko.observable(null),
        imageUrl: ko.observable(''),
        isVisible: ko.observable(false),
        isLoaded: ko.observable(false),

        openPreviewImage: openPreviewImage,
        closePreview: closePreview,
        activate: activate
    };

    return imagePreviewModel;

    function activate() {
        
    }

    function openPreviewImage(data) {
        showOverlay();
        setPreviewImage(data);
    }

    function setPreviewImage(data) {
        imagePreviewModel.imageId(data.id);
        imagePreviewModel.imageUrl(data.image);
    }

    function showOverlay() {
        imagePreviewModel.isVisible(true);
    }

    function closePreview() {
        hideOverlay();
    }

    function hideOverlay() {
        imagePreviewModel.isVisible(false);
        app.trigger(constants.events.imagePreviewClosed, imagePreviewModel.imageId());
    }
});