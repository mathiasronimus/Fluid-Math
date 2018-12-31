define(["require", "exports", "./consts"], function (require, exports, consts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Add styles based on the contents of consts
     */
    function addStyleSheet() {
        let styleEl = document.createElement('style');
        let styleText = "";
        Object.keys(consts_1.default.colors).forEach(colorName => {
            let colorVal = consts_1.default.colors[colorName];
            styleText += '.' + colorName + " { color: " + 'rgb(' + colorVal[0] + ',' + colorVal[1] + "," + colorVal[2] + ")}";
        });
        styleEl.appendChild(document.createTextNode(styleText));
        document.head.appendChild(styleEl);
    }
    exports.addStyleSheet = addStyleSheet;
});
