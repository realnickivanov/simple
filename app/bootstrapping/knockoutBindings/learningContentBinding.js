define(['durandal/composition'], function (composition) {
    ko.bindingHandlers.learningContent = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                html = valueAccessor();
            
            var $output = $('<output>');
            $output.html(html);
            
            
            var dataType = $('[data-type]', $output);
            
            if (dataType.length !== 0){
                var hotspotOnImage = new HotspotOnImage($(html)[0]);
                $element.html(hotspotOnImage.element);
            } else {
                $element.html(html);
            }
        }
    };
    
    composition.addBindingHandler('learningContent');
});