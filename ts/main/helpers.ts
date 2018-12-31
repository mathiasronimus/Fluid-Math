import C from './consts';

/**
 * Add styles based on the contents of consts
 */
export function addStyleSheet() {
    let styleEl = document.createElement('style');
    let styleText = "";
    Object.keys(C.colors).forEach(colorName => {
        let colorVal = C.colors[colorName];
        styleText += '.' + colorName + " { color: " + 'rgb(' + colorVal[0] + ',' + colorVal[1] + "," + colorVal[2] + ")}"; 
    });
    styleEl.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleEl);
}