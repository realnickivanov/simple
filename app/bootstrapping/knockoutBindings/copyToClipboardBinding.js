define(['knockout'], function(ko) {
    ko.bindingHandlers.copyToClipboard = {
        init: function(element, valueAccessor) {
            var $element = $(element),
                targets = valueAccessor().targets,
                texts = valueAccessor().texts,
                copied = valueAccessor().copied;

            var cplipboard = new Clipboard(element, {
                text: function() {
                    var targetTexts = [];
                    var text = '';
                    targets.forEach(function(item) {
                        var itemText = document.getElementById(item);
                        targetTexts.push(itemText.value);
                    });
                    copied(true);
                    setTimeout(function(){
                        copied(false);
                    }, 3000);
                    if (texts) {
                        texts.forEach(function(item, index) {
                            if (index == texts.length - 1) {
                                text += item + ': ' + targetTexts[index];
                            } else {
                                text += item + ': ' + targetTexts[index] + ', ';
                            }
                        });
                        return text;
                    }
                    return targetTexts[0];
                }
            });
        }
    };
})