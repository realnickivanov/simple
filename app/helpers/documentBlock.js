define(['localizationManager', 'constants'], function (localizationManager, constants) {
    return {
        getDocumentBlockContent: function (html) {
            var $output = $('<output>').html(html),
                $container = $output.find(constants.documents.containerSelector);

            var downloadText = localizationManager.getLocalizedText(constants.documents.downloadLocalizationKey);
            var documentData = {
                type: $container.attr(constants.documents.typeAttrName),
                size: $container.attr(constants.documents.sizeAttrName)
            };

            var documentSizeString = getSize(documentData.size);
            var downloadBtnText = downloadText + ' (' + documentSizeString + ')';

            $output.find(constants.documents.downloadBtnSelector)
                .text(downloadBtnText);

            var $typeIcon = $('<div class="icon-container">' +
                '<span class="document-type-text">' + documentData.type + '</span>' +
                '</div>')
                .addClass(getIconClass(documentData.type));
            var $typeIconWrapper = $('<div class="document-icon"></div>')
                .append($typeIcon);

            var $documentInfo = $(constants.documents.documentInfoSelector, $container)
                .prepend($typeIconWrapper, $('<div class="separator"></div>'));

            return $output.children()[0];
        }
    };

    function getIconClass(documentType) {
        switch (documentType) {
            case constants.documents.types.zip:
                return 'icon-zip';
            default:
                return 'icon-file';
        }
    }

    function getSize(sizeKb) {
        var size = '';
        if (!sizeKb) {
            return '0 Kb';
        }
        if (sizeKb > 1024) {
            size = (sizeKb / 1024).toFixed(2);
        }
        return size + ' MB';
    }
});
