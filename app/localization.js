define(['translation'], function (translation) {

    return {
        localize: function () {
            $('[data-translate-text]').each(function () {
                var key = $(this).attr('data-translate-text');
                try {
                    $(this).text(translation.getTextByKey(key));
                } catch (exeption) {
                    console.error(exeption);
                }
            });

            $('[data-translate-placeholder]').each(function () {
                var key = $(this).attr('data-translate-placeholder');
                try {
                    $(this).attr("placeholder", translation.getTextByKey(key));
                } catch (exeption) {
                    console.error(exeption);
                }
            });

            $('[data-translate-title]').each(function () {
                var key = $(this).attr('data-translate-title');
                try {
                    $(this).attr("title", translation.getTextByKey(key));
                } catch (exeption) {
                    console.error(exeption);
                }
            });
        }
    }
})