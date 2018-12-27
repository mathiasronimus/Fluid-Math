define(["require", "exports", "../animation/BezierEasing"], function (require, exports, BezierEasing_1) {
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
        termPadding: 5,
        //Creator
        creatorVBoxPadding: 30,
        creatorHBoxPadding: 30,
        //Animations: durations are in MS
        addDuration: 600,
        addEasing: BezierEasing_1.default(0.0, 0.0, 0.2, 1),
        canvasSizeDuration: 600,
        canvasSizeEasing: BezierEasing_1.default(0.4, 0.0, 0.2, 1),
        moveDuration: 600,
        moveEasing: BezierEasing_1.default(0.4, 0.0, 0.2, 1),
        removeDuration: 300,
        removeEasing: BezierEasing_1.default(0.4, 0.0, 1, 1),
        colorDuration: 600,
        colorEasing: BezierEasing_1.default(0.5, 0.5, 0.5, 0.5),
        //Appearance
        colors: {
            //RGB
            "red": [244, 67, 54],
            "pink": [233, 30, 99],
            "purple": [156, 39, 176],
            "blue": [33, 150, 243],
            "teal": [0, 150, 136],
            "green": [76, 175, 80],
            "orange": [255, 152, 0]
        },
        defaultColor: [0, 0, 0],
        fadedOpacity: 0.3,
        normalOpacity: 0.85,
        focusedOpacity: 1
    };
    exports.default = constants;
});
