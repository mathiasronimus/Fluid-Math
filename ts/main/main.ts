import CanvasController from './CanvasController';
import C from './consts';
import { addStyleSheet } from './helpers';

WebFont.load({
    google: {
        families: [C.fontFamily + ":" + C.fontWeight]
    },
    active: function () { init(); },
    inactive: function () { init(); }
});

function init() {
    
    addStyleSheet();
    let containers = document.getElementsByClassName('eqContainer');

    //For each container, get its instructions from the server
    for (let i = 0; i < containers.length; i++) {
        new InstructionsRequest(containers[i], i);
    }

}

class InstructionsRequest {

    private container: Element;

    constructor(container: Element, num: number) {
        this.container = container;

        let this_ = this;
        let onLoad = function() {
            let instructions = JSON.parse(this.responseText);
            new CanvasController(this_.container, instructions, C.fontFamily, C.fontWeight);
        }

        let req: XMLHttpRequest = new XMLHttpRequest();
        req.addEventListener("load", onLoad);
        req.open("GET", "anim" + num + ".json");
        req.send();
    }
}