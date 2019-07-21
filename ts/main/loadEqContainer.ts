import CanvasController from './CanvasController';
import HeightComputeCanvasController from './HeightComputeCanvasController';
import * as WebFont from 'webfontloader';
import C from './consts';
import { addStyleSheet, getMetrics } from './helpers';
import { GoogleFontFormat, CustomFontFormat, FileFormat, FontFormat, ColorsFormat } from './FileFormat';
import EqContent from '../layout/EqContent';

let colorsRequested = false;
let loadedColorsFile: ColorsFormat;
let loadedColorsResCode: number = 0;

const defaultFontObj: GoogleFontFormat = {
    type: "g",
    name: C.fontFamily + ":" + C.fontWeight
}

// Export the loader function as a UMD module.
// This is only intended to be used on the frontend.
// If an AMD module loader is present like require.js,
// the module will be available through that. Otherwise,
// it will become a global variable.
declare var define;
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD.
        define('loadEqContainer', [], factory);
    } else {
        // Browser globals.
        window['loadEqContainer'] = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    // The implementation of loadEqContainer
    return function(arg1: string | HTMLElement, arg2: string | FileFormat) {
        if (typeof arg1 === 'string') {
            // String represents class name. Find all
            // elements of this class to initialize.
            initAll(arg1);
        } else if (typeof arg1 === 'object' && arg1 instanceof HTMLElement) {
            // Load a single container represented by
            // arg1.
            initOne(arg1, arg2);
        } else {
            throw new Error(
                'Invalid first argument. Pass either a class name representing ' +
                'all containers to load, or an HTML Element that will become the container.'
            );
        }
    }
}));

/**
 * Make a request for the colors file, updating the variables at the top
 * when they are received.
 */
function requestColors() {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.status === 200) {
            loadedColorsFile = JSON.parse(req.responseText);
            EqContent.colors = loadedColorsFile.colors;
            addStyleSheet(loadedColorsFile.colors);
        } else {
            EqContent.colors = C.colors;
            addStyleSheet();
        }
        loadedColorsResCode = req.status;
    });
    req.open("GET", "colors.json");
    req.send();
    colorsRequested = true;
}

/**
 * Given a font object for a custom font,
 * return the familiy name for the web font
 * loader and add the style for the font
 * face declaration.
 * @param fontObj The font object for the custom font.
 */
function customFontObjToFamily(fontObj: CustomFontFormat) {
    // Need to add a stylesheet containing a font face declaration.
    let styleEl = document.createElement('style');
    let styleText = 
        "@font-face {" +
            "font-family: " + fontObj.name + ";" +
            "font-style: " + fontObj.style + ";" +
            "font-weight: " + fontObj.weight + ";" +
            "src: url(" + fontObj.src + ");" +
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
    return loaderString;
}

/**
 * Safely initialize a Canvas Controller, making sure
 * it has all necessary info.
 * @param element The HTML element to initialize into.
 * @param instructions The instructions object.
 */
function initCanvController(element: HTMLElement, instructions: FileFormat) {
    if (!instructions.metrics) {
        // Metrics not calculated yet
        instructions.metrics = getMetrics(instructions);
    }
    if (element.hasAttribute('data-fix-height') && !instructions.maxHeights) {
        // Canvas needs fixed height information and
        // doesn't have it.
        instructions.maxHeights = new HeightComputeCanvasController(instructions).compute();
    }

    // Wait for the colors to be loaded, if necessary
    const doLoad = () => {
        if (loadedColorsResCode === 0) {
            // Not loaded yet
            setTimeout(doLoad, 10);
        } else if (loadedColorsResCode === 200) {
            new CanvasController(element, instructions, loadedColorsFile);
        } else {
            new CanvasController(element, instructions);
        }
    };
    doLoad();
}

/**
 * Initialize one container.
 * @param element The HTML element for the container.
 * @param urlOrObj  The url locating the animation .json file,
 *                  or the object representing the parsed .json file,
 *                  or undefined to attempt to load via the data-src
 *                  attribute on the element.
 */
function initOne(element: HTMLElement, urlOrObj: string | FileFormat) {

    // Request colors for this page
    if (!colorsRequested) {
        requestColors();
    }

    let instructionsObj: FileFormat;
    
    let afterFontLoad = function() {
        initCanvController(element, instructionsObj);
    }

    let fontLoad = function() {
        let fontConfig: WebFont.Config;
        if (!instructionsObj.font) {
            fontConfig = {
                google: {
                    families: [defaultFontObj.name]
                }
            }
        } else if (instructionsObj.font.type === 'c') {
            fontConfig = {
                custom: {
                    families: [customFontObjToFamily(instructionsObj.font as CustomFontFormat)]
                }
            }
        } else if (instructionsObj.font.type === 'g') {
            fontConfig = {
                google: {
                    families: [(instructionsObj.font as GoogleFontFormat).name]
                }
            }
        } else {
            throw new Error('Unrecognized font type.');
        }
        fontConfig.active = afterFontLoad;
        fontConfig.inactive = afterFontLoad;
        WebFont.load(fontConfig);
    }

    if (typeof urlOrObj === 'object') {
        // Already have the instructions object
        instructionsObj = urlOrObj;
        fontLoad();
    } else {
        let afterInstructionsLoad = function() {
            instructionsObj = JSON.parse(this.responseText);
            fontLoad();
        }

        let instructionsURL = urlOrObj ? urlOrObj : element.getAttribute('data-src');
        if (!instructionsURL) {
            throw new Error(
                'If a URL is not passed to loadEqContainer, it must ' +
                'be specified on the element via the data-src attribute.'
            );
        }

        let req = new XMLHttpRequest();
        req.addEventListener('load', afterInstructionsLoad);
        req.open('GET', instructionsURL);
        req.send();
    }
}

/**
 * Initialize all elements on the page with
 * a certain class name.
 * @param className The class name.
 */
function initAll(className: string) {

    // Request colors for this page
    if (!colorsRequested) {
        requestColors();
    }

    let containers = document.getElementsByClassName(className) as HTMLCollectionOf<HTMLElement>;
    // Once loaded, instructions are put here. Each container is
    // associated with its instructions by index.
    let instructions: FileFormat[] = [];
    let numInstructionsToGet = containers.length;

    let numCustom = 0;
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        if (container.hasAttribute('data-src')) {
            instructionsRequest(i, container.getAttribute('data-src'));
            numCustom++;
        } else {
            instructionsRequest(i, 'anim' + (i - numCustom) + '.json');
        }
    }

    function afterInstructionLoad() {
        // Need to load the fonts used by the animations so they
        // can be displayed correctly.
        // Use an object as a kind of set, to determine the unique
        // fonts we have to load.
        let fontSet = {}
        instructions.forEach(instructObj => {
            let fontObj: FontFormat;
            if (!instructObj.font) {
                // No font specified, use default
                fontObj = defaultFontObj;
            } else {
                // Load custom font
                fontObj = instructObj.font;
            }
            fontSet[JSON.stringify(fontObj)] = true;
        });
        // Get an object describing how to load the font for each
        // unique font.
        let fontObjs: FontFormat[] = Object.keys(fontSet).map(str => JSON.parse(str));
        // Convert these to an object used by the google web font loader
        let webFontObj: WebFont.Config = {
            active: afterFontLoad,
            inactive: afterFontLoad
        };
        fontObjs.forEach(fontObj => {
            let type: string = fontObj.type;
            if (type === "g") {
                let googleFont = fontObj as GoogleFontFormat;
                // Load a google font
                if (!webFontObj.google) {
                    webFontObj.google = {
                        families: []
                    };
                }
                webFontObj.google.families.push(googleFont.name);
            } else if (type === "c") {
                // Load a custom font
                // Need to add a stylesheet containing a font face declaration.
                const loaderString = customFontObjToFamily(fontObj as CustomFontFormat);
                if (!webFontObj.custom) {
                    webFontObj.custom = {};
                    webFontObj.custom.families = [];
                }
                webFontObj.custom.families.push(loaderString);
            } else {
                throw "unrecognized custom font type";
            }
        });
        WebFont.load(webFontObj);
    }

    function afterFontLoad() {
        for (let i = 0; i < containers.length; i++) {
            initCanvController(containers[i], instructions[i]);
        }
    }

    function instructionsRequest(containerIndex: number, src: string) {
        let onLoad = function() {
            let instructObj: FileFormat = JSON.parse(this.responseText);
            instructions[containerIndex] = instructObj;
            numInstructionsToGet--;
            if (numInstructionsToGet === 0) {
                afterInstructionLoad();
            }
        }
        let req = new XMLHttpRequest();
        req.addEventListener('load', onLoad);
        req.open("GET", src);
        req.send();
    }
}