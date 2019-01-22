import bezier from '../animation/BezierEasing';
import Padding from '../layout/Padding';

const constants = {
    //Font: size in px
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSizes: [35, 30, 25],
    borderRadius: 5,
    //The tiers at which font size will change.
    //More tiers means better layout but worse
    //file size.
    widthTiers: [670, 500, 300],
    //Tuning variable, turn down for better
    //performance. Too low will give layout
    //innacuracies.
    testCanvasFontSizeMultiple: 5,
    testCanvasWidth: 800,
    
    //Layout:
    defaultVBoxPadding: 0,
    defaultHBoxPadding: 0,
    defaultTightHBoxPadding: 0,
    defaultSubSuperPadding: Padding.even(0),
    termPadding: new Padding(10, 5, 10, 5),
    tightTermPadding: new Padding(5, 2, 5, 2),
    hDividerPadding: new Padding(0, 2, 0, 2),
    //The scaling of exponents and subscripts.
    expScale: 0.5,
    //The proportion of exponents and subscripts that portrudes from the component they're 'attached' to.
    defaultExpPortrusion: 0.1,

    //Creator
    creatorVBoxPadding: Padding.even(30),
    creatorHBoxPadding: Padding.even(30),
    creatorTightHBoxPadding: Padding.even(30),
    creatorHDividerPadding: Padding.even(5),
    creatorSubSuperPadding: Padding.even(15),
    creatorContainerStroke: "rgba(0, 0, 0, 0.4)",
    creatorLineDash: [5],
    creatorErrorTimeout: 5000,

    //Animations: durations are in MS
    addDuration: 600,
    addEasing: bezier(0.0, 0.0, 0.2, 1),
    canvasSizeDuration: 600,
    canvasSizeEasing: bezier(0.4, 0.0, 0.2, 1),
    moveDuration: 600,
    moveEasing: bezier(0.4, 0.0, 0.2, 1),
    removeDuration: 300,
    removeEasing: bezier(0.4, 0.0, 1, 1),
    colorDuration: 300,
    colorEasing: bezier(0.5, 0.5, 0.5, 0.5),
    opacityDuration: 300,
    opacityEasing: bezier(0.5, 0.5, 0.5, 0.5),
    progressDuration: 600,
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