define(['localizationManager', 'constants'], function (localizationManager, constants) {
    return {
        getDocumentBlockContent: function (html) {
            let $output = $('<output>').html(html),
                $container = $output.find(constants.documents.containerSelector);

            let downloadText = localizationManager.getLocalizedText(constants.documents.downloadLocalizationKey);
            let documentData = {
                type: $container.attr(constants.documents.typeAttrName),
                size: $container.attr(constants.documents.sizeAttrName)
            };

            let documentSizeString = getSize(documentData.size);
            let downloadBtnText = `${downloadText} (${documentSizeString})`;

            $output.find(constants.documents.downloadBtnSelector)
                .text(downloadBtnText);

            let $typeIcon = $('<div class="icon-container">' +
                `<span class="document-type-text">${documentData.type}</span>` +
                '</div>')
                .addClass(getIconClass(documentData.type));
            let $typeIconWrapper = $('<div class="document-icon"></div>')
                .append($typeIcon);

            let $documentInfo = $(constants.documents.documentInfoSelector, $container)
                .prepend($typeIconWrapper, $('<div class="separator"></div>'));

            return $output.children()[0];
        }
    };

    function getIconClass(documentType) {
        return {
            [constants.documents.types.zip]: 'icon-zip'
        }[documentType] || 'icon-file';
    }

    function getSize(sizeKb) {
        let size = '';
        if (!sizeKb) {
            return '0 Kb';
        }
        if (sizeKb > 1024) {
            size = (sizeKb / 1024).toFixed(2);
        }
        return size + ' MB';
    }
});
