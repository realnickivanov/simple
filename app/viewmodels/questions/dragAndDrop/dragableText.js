define([],
    function () {

        function DragableText(spec) {
            this.id = spec.id;
            this.text = spec.text;
            this.position = spec.position;
        }

        return DragableText;
    }
);