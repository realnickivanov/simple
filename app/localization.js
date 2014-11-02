define(['modules/templateSettings'], function (templateSettings) {

    return {
        localize: function () {
            $('[data-translate-text]').each(function () {
                var key = $(this).attr('data-translate-text');
                $(this).text(getTextByKey(key));
            });

            $('[data-translate-placeholder]').each(function () {
                var key = $(this).attr('data-translate-placeholder');
                $(this).attr("placeholder", getTextByKey(key));
            });

            $('[data-translate-title]').each(function () {
                var key = $(this).attr('data-translate-title');
                $(this).attr("title", getTextByKey(key));
            });
        }
    }

    function getTextByKey(key) {
        var
            translations = templateSettings.translations
        ;

        for (var i = 0; i < translations.length; i++) {
            if (translations[i].key == key) {
                return translations[i].value;
            }
        }
        throw 'Unable to localize ' + key;
    }

})