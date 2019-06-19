import Padding from '../layout/Padding';
import bezier from 'bezier-easing';

const constants = {
    //Font: size in px
    // The DEFAULT Google font, may be overridden.
    fontFamily: 'Old Standard TT',
    fontStyle: 'Normal',
    fontWeight: '400',
    fontSizes: [35, 30, 25],
    //The tiers at which font size will change.
    //More tiers means better layout but worse
    //file size.
    widthTiers: [670, 500, 300],
    //Tuning variable, turn down for better
    //performance. Too low will give layout
    //innacuracies.
    testCanvasFontSizeMultiple: 5,
    testCanvasWidth: 800,
    // The width and height of the progress indicator in px
    restartAndProgressSize: 28,
    // The total padding (x and y) of the progress indicator in px
    restartAndProgressPadding: 16,
    progressFill: "rgba(0, 0, 0, 0.06)",
    
    //Layout:
    defaultVBoxPadding: 0,
    defaultHBoxPadding: 0,
    defaultTightHBoxPadding: 0,
    defaultSubSuperPadding: Padding.even(0),
    defaultRootPadding: Padding.even(0),
    termPadding: new Padding(10, 5, 10, 5),
    tightTermPadding: new Padding(5, 2, 5, 2),
    hDividerPadding: new Padding(0, 3, 0, 3),
    //The scaling of exponents and subscripts.
    expScale: 0.575,
    //The proportion of exponents and subscripts that portrudes from the component they're 'attached' to.
    defaultExpPortrusion: 0.1,

    //Roots:
    rootArgMarginLeft: 7,
    rootIndexScale: 0.5,
    // The angle the small tip of the radical kink makes
    // to the rest of the kink.
    rootKinkTipAngle: Math.PI / 2,
    rootKinkTipLength: 3,

    //Creator
    creatorContainerPadding: Padding.even(30),
    creatorHDividerPadding: new Padding(5, 15, 5, 15),
    creatorSelectableHDividerPadding: new Padding(5, 0, 5, 0),
    creatorContainerStroke: "rgb(225, 225, 225)",
    creatorCaretFillStyle: '#444',
    creatorCaretFillStyleLighter: '#999',
    creatorCaretSize: 5,
    creatorLineDash: [2],
    creatorErrorTimeout: 5000,

    //Animations: durations are in MS
    addDuration: 700,
    addEasing: bezier(0.0, 0.0, 0.2, 1),
    moveDuration: 700,
    moveEasing: bezier(0.4, 0.0, 0.2, 1),
    removeDuration: 400,
    removeEasing: bezier(0.4, 0.0, 1, 1),
    progressEasing: bezier(0.4, 0.0, 0.2, 1),

    //Appearance
    colors: {
        //RGB
        "red": [229,57,53],
        "pink": [216,27,96],
        "purple": [142,36,170],
        "blue": [30,136,229],
        "teal": [0,137,123],
        "green": [67,160,71],
        "orange": [251,140,0],
        "default": [0,0,0]
    },
    fadedOpacity: 0.3,
    normalOpacity: 0.6,
    focusedOpacity: 0.9,
}

export default constants;