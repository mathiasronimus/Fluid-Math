define(["require", "exports", "./CanvasController", "./consts"], function (require, exports, CanvasController_1, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebFont.load({
        google: {
            families: [consts_1.default.fontFamily + ":" + consts_1.default.fontWeight]
        },
        active: function () { init(); },
        inactive: function () { init(); }
    });
    function init() {
        let containers = document.getElementsByClassName('eqContainer');
        //For each container, get its instructions from the server
        for (let i = 0; i < containers.length; i++) {
            new InstructionsRequest(containers[i], i);
        }
    }
    class InstructionsRequest {
        constructor(container, num) {
            this.container = container;
            let this_ = this;
            let onLoad = function () {
                let instructions = JSON.parse(this.responseText);
                new CanvasController_1.default(this_.container, instructions, consts_1.default.fontFamily, consts_1.default.fontWeight);
            };
            let req = new XMLHttpRequest();
            req.addEventListener("load", onLoad);
            req.open("GET", "anim" + num + ".json");
            req.send();
        }
    }
});
