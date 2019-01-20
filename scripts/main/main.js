define(["require", "exports", "./CanvasController", "./consts", "./helpers"], function (require, exports, CanvasController_1, consts_1, helpers_1) {
    "use strict";
    exports.__esModule = true;
    WebFont.load({
        google: {
            families: [consts_1["default"].fontFamily + ":" + consts_1["default"].fontWeight + ",400"]
        },
        active: function () { init(); },
        inactive: function () { init(); }
    });
    function init() {
        helpers_1.addStyleSheet();
        var containers = document.getElementsByClassName('eqContainer');
        //For each container, get its instructions from the server
        for (var i = 0; i < containers.length; i++) {
            new InstructionsRequest(containers[i], i);
        }
    }
    var InstructionsRequest = (function () {
        function InstructionsRequest(container, num) {
            this.container = container;
            var this_ = this;
            var onLoad = function () {
                var instructions = JSON.parse(this.responseText);
                new CanvasController_1["default"](this_.container, instructions);
            };
            var req = new XMLHttpRequest();
            req.addEventListener("load", onLoad);
            req.open("GET", "anim" + num + ".json");
            req.send();
        }
        return InstructionsRequest;
    }());
});
