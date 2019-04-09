import CanvasController from './CanvasController';
import C from './consts';
import { addStyleSheet } from './helpers';

(function () {

    addStyleSheet();
    let containers = document.getElementsByClassName('eqContainer');
    // Once loaded, instructions are put here. Each container is
    // associated with its instructions by index.
    let instructions = [];
    let numInstructionsToGet = containers.length;

    for (let i = 0; i < containers.length; i++) {
        instructionsRequest(i);
    }

    function afterInstructionLoad() {
        // Need to load the fonts used by the animations so they
        // can be displayed correctly.
        // Use an object as a kind of set, to determine the unique
        // fonts we have to load.
        let fontSet = {}
        let defaultFontObj = {
            type: "g",
            name: C.fontFamily + ":" + C.fontWeight
        }
        instructions.forEach(instructObj => {
            let fontObj;
            if (!instructObj["font"]) {
                // No font specified, use default
                fontObj = defaultFontObj;
            } else {
                // Load custom font
                fontObj = instructObj["font"];
            }
            fontSet[JSON.stringify(fontObj)] = true;
        });
        // Get an object describing how to load the font for each
        // unique font.
        let fontObjs = Object.keys(fontSet).map(str => JSON.parse(str));
        // Convert these to an object used by the google web font loader
        let webFontObj = {
            active: afterFontLoad,
            inactive: afterFontLoad
        };
        fontObjs.forEach(fontObj => {
            let type: string = fontObj["type"];
            if (type === "g") {
                // Load a google font
                if (!webFontObj["google"]) {
                    webFontObj["google"] = {};
                    webFontObj["google"]["families"] = [];
                }
                (webFontObj["google"]["families"] as Array<string>).push(fontObj["name"]);
            } else if (type === "c") {
                // Load a custom font
                // Need to add a stylesheet containing a font face declaration.
                let styleEl = document.createElement('style');
                let styleText = 
                    "@font-face {" +
                        "font-family: " + fontObj["name"] + ";" +
                        "font-style: " + fontObj["style"] + ";" +
                        "font-weight: " + fontObj["weight"] + ";" +
                        "src: url(" + fontObj["src"] + ");" +
                    "}";
                styleEl.appendChild(document.createTextNode(styleText));
                document.head.appendChild(styleEl);
                // Also need a string that the loader can recognize
                let loaderString = fontObj.name + ":";
                if (fontObj.style === "normal") {
                    loaderString += "n";
                } else if (fontObj.style === "italic") {
                    loaderString += "i";
                } else {
                    throw "Unrecognized custom font style";
                }
                loaderString += fontObj.weight;
                if (!webFontObj["custom"]) {
                    webFontObj["custom"] = {};
                    webFontObj["custom"]["families"] = [];
                }
                (webFontObj["custom"]["families"] as Array<string>).push(loaderString);
            } else {
                throw "unrecognized custom font type";
            }
        });
        window['WebFont'].load(webFontObj);
    }

    function afterFontLoad() {
        for (let i = 0; i < containers.length; i++) {
            new CanvasController(containers[i] as HTMLElement, instructions[i]);
        }
    }

    function instructionsRequest(containerIndex: number) {
        let onLoad = function() {
            let instructObj = JSON.parse(this.responseText);
            instructions[containerIndex] = instructObj;
            numInstructionsToGet--;
            if (numInstructionsToGet === 0) {
                afterInstructionLoad();
            }
        }
        let req = new XMLHttpRequest();
        req.addEventListener('load', onLoad);
        req.open("GET", "anim" + containerIndex + ".json");
        req.send();
    }

})();