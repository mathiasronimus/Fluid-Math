define(["require", "exports", "./CanvasController", "./consts", "./helpers"], function (require, exports, CanvasController_1, consts_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    WebFont.load({
        google: {
            families: [consts_1.default.fontFamily + ":" + consts_1.default.fontWeight + ",400"]
        },
        active: function () { init(); },
        inactive: function () { init(); }
    });
    function init() {
        //Moto g5s: 360
        //Moto g5s landscape: 592
        //Pixel: 412
        //Pixel landscape: 684
        //My laptop: 1280
        let test = document.createElement('p');
        test.innerHTML = window.innerWidth + "";
        document.body.appendChild(test);
        window.addEventListener('resize', function () {
            test.innerHTML = window.innerWidth + "";
        });
        helpers_1.addStyleSheet();
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
                new CanvasController_1.default(this_.container, instructions);
            };
            let req = new XMLHttpRequest();
            req.addEventListener("load", onLoad);
            req.open("GET", "anim" + num + ".json");
            req.send();
        }
    }
});
