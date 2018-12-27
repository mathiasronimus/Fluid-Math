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
        //Color
        colors: {
            "red": "#F44336",
            "pink": "#E91E63",
            "purple": "#9C27B0",
            "blue": "#2196F3",
            "teal": "#009688",
            "green": "#4CAF50",
            "orange": "#FF9800"
        }
    };
    exports.default = constants;
});
