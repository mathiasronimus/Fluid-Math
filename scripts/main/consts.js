define(["require", "exports", "../animation/BezierEasing", "../layout/Padding"], function (require, exports, BezierEasing_1, Padding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const constants = {
        //Font: size in px
        fontFamily: 'Roboto',
        fontWeight: '400',
        fontSize: 30,
        //Tuning variable, turn down for better
        //performance. Too low will give layout
        //innacuracies.
        testCanvasFontSizeMultiple: 5,
        //Layout:
        defaultVBoxPadding: 6,
        defaultHBoxPadding: 6,
        defaultTightHBoxPadding: 0,
        defaultSubSuperPadding: Padding_1.default.even(0),
        termPadding: Padding_1.default.even(5),
        tightTermPadding: new Padding_1.default(5, 2, 5, 2),
        hDividerPadding: new Padding_1.default(0, 5, 0, 5),
        //The scaling of exponents and subscripts.
        expScale: 0.6,
        //The proportion of exponents and subscripts that portrudes from the component they're 'attached' to.
        expPortrusion: 0.1,
        //Creator
        creatorVBoxPadding: Padding_1.default.even(30),
        creatorHBoxPadding: Padding_1.default.even(30),
        creatorTightHBoxPadding: Padding_1.default.even(30),
        creatorHDividerPadding: Padding_1.default.even(5),
        creatorSubSuperPadding: Padding_1.default.even(15),
        creatorContainerStroke: "rgba(0, 0, 0, 0.4)",
        creatorLineDash: [5],
        //Animations: durations are in MS
        addDuration: 600,
        addEasing: BezierEasing_1.default(0.0, 0.0, 0.2, 1),
        canvasSizeDuration: 600,
        canvasSizeEasing: BezierEasing_1.default(0.4, 0.0, 0.2, 1),
        moveDuration: 600,
        moveEasing: BezierEasing_1.default(0.4, 0.0, 0.2, 1),
        removeDuration: 300,
        removeEasing: BezierEasing_1.default(0.4, 0.0, 1, 1),
        colorDuration: 300,
        colorEasing: BezierEasing_1.default(0.5, 0.5, 0.5, 0.5),
        opacityDuration: 300,
        opacityEasing: BezierEasing_1.default(0.5, 0.5, 0.5, 0.5),
        progressDuration: 600,
        progressEasing: BezierEasing_1.default(0.4, 0.0, 0.2, 1),
        //Appearance
        colors: {
            //RGB
            "red": [229, 57, 53],
            "pink": [216, 27, 96],
            "purple": [142, 36, 170],
            "blue": [30, 136, 229],
            "teal": [0, 137, 123],
            "green": [67, 160, 71],
            "orange": [251, 140, 0],
            "default": [0, 0, 0]
        },
        fadedOpacity: 0.3,
        normalOpacity: 0.6,
        focusedOpacity: 0.9,
    };
    exports.default = constants;
});
