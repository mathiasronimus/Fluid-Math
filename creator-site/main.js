(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "../src/animation/AddAnimation.ts":
/*!****************************************!*\
  !*** ../src/animation/AddAnimation.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ "../src/animation/Animation.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Animates a component in by scaling it from
 * 0 to its normal size.
 */
var AddAnimation = /** @class */ (function (_super) {
    __extends(AddAnimation, _super);
    function AddAnimation(end, set, ctx, duration) {
        return _super.call(this, duration, _main_consts__WEBPACK_IMPORTED_MODULE_1__["addEasing"], set, end.withZeroScale(), end, end.component, ctx) || this;
    }
    return AddAnimation;
}(_Animation__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (AddAnimation);


/***/ }),

/***/ "../src/animation/Animation.ts":
/*!*************************************!*\
  !*** ../src/animation/Animation.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BezierCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierCallback */ "../src/animation/BezierCallback.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * A bezier callback whose step function
 * calls the draw function of content.
 */
var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    function Animation(duration, easing, set, before, after, component, ctx) {
        var _this = _super.call(this, duration, easing, set) || this;
        _this.before = before;
        _this.after = after;
        _this.component = component;
        _this.ctx = ctx;
        return _this;
    }
    Animation.prototype.step = function (completion) {
        this.ctx.save();
        this.component.draw(this.before, this.after, completion, this.ctx);
        this.ctx.restore();
    };
    return Animation;
}(_BezierCallback__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Animation);


/***/ }),

/***/ "../src/animation/AnimationSet.ts":
/*!****************************************!*\
  !*** ../src/animation/AnimationSet.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _layout_EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/EqContent */ "../src/layout/EqContent.ts");

/**
 * Plays a set of animations and provides
 * options for controlling them as a group.
 * Also erases the canvas before each frame.
 */
var AnimationSet = /** @class */ (function () {
    /**
     * Create a new Animation Set.
     * @param done Function to call when all animations are done.
     * @param ctx Context of the canvas to clear/draw to.
     * @param clearWidth The width of the canvas to clear.
     * @param clearHeight The height of the canvas to clear.
     * @param clearFill The background color to fill at the start of each frame.
     * @param drawStates (optional) the states to draw after each frame.
     */
    function AnimationSet(done, ctx, clearWidth, clearHeight, clearFill, drawStates) {
        this.stopped = false;
        this.animations = [];
        this.done = done;
        this.ctx = ctx;
        this.clearWidth = clearWidth;
        this.clearHeight = clearHeight;
        this.states = drawStates;
        this.clearFill = clearFill;
    }
    AnimationSet.prototype.addAnimation = function (anim) {
        this.animations.push(anim);
    };
    /**
     * Starts running the animations.
     */
    AnimationSet.prototype.start = function () {
        this.numRunning = this.animations.length;
        var this_ = this;
        var doAll = function (timestamp) {
            // Clear the canvas
            this_.ctx.save();
            this_.ctx.fillStyle = this_.clearFill;
            this_.ctx.fillRect(0, 0, this_.clearWidth, this_.clearHeight);
            this_.ctx.restore();
            this_.animations.forEach(function (a) {
                a.run(timestamp);
            });
            // Draw all content states if necessary
            if (this_.states) {
                this_.states.forEach(function (state) {
                    if (state.component instanceof _layout_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]) {
                        this_.ctx.save();
                        state.component.draw(state, state, 1, this_.ctx);
                        this_.ctx.restore();
                    }
                });
            }
            if (this_.numRunning > 0 && !this_.stopped) {
                requestAnimationFrame(doAll);
            }
        };
        requestAnimationFrame(doAll);
    };
    /**
     * Called by a BezierCallback when it is done.
     */
    AnimationSet.prototype.finished = function () {
        this.numRunning--;
        if (this.numRunning === 0 && this.done) {
            this.done();
        }
    };
    /**
     * Stop all running animations and call the done event,
     * if it was provided.
     */
    AnimationSet.prototype.stop = function () {
        this.stopped = true;
        if (this.done) {
            this.done();
        }
    };
    return AnimationSet;
}());
/* harmony default export */ __webpack_exports__["default"] = (AnimationSet);


/***/ }),

/***/ "../src/animation/BezierCallback.ts":
/*!******************************************!*\
  !*** ../src/animation/BezierCallback.ts ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Animates by repeatedly calling a step
 * function whose completion over time is
 * determined by a bezier curve.
 */
var BezierCallback = /** @class */ (function () {
    function BezierCallback(duration, easing, set) {
        this.done = false;
        this.startTime = -1;
        this.duration = duration;
        this.easing = easing;
        this.set = set;
    }
    BezierCallback.prototype.run = function (timestamp) {
        if (this.done) {
            // Continue drawing the final state
            this.step(1);
            return;
        }
        if (this.startTime === -1) {
            //Special Case: First Frame
            this.startTime = timestamp;
            this.step(0);
            return;
        }
        var elapsed = timestamp - this.startTime;
        if (elapsed >= this.duration) {
            //Done
            this.step(1);
            this.set.finished();
            this.done = true;
        }
        else {
            this.step(this.easing(elapsed / this.duration));
        }
    };
    return BezierCallback;
}());
/* harmony default export */ __webpack_exports__["default"] = (BezierCallback);


/***/ }),

/***/ "../src/animation/ContentLayoutState.ts":
/*!**********************************************!*\
  !*** ../src/animation/ContentLayoutState.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LayoutState */ "../src/animation/LayoutState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Layout state containing info relevant to
 * content, ie color and opacity.
 */
var ContentLayoutState = /** @class */ (function (_super) {
    __extends(ContentLayoutState, _super);
    function ContentLayoutState(layoutParent, component, tlx, tly, width, height, scale, color, opacity) {
        var _this = _super.call(this, layoutParent, component, tlx, tly, width, height, scale) || this;
        _this.color = color;
        _this.opacity = opacity;
        return _this;
    }
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    ContentLayoutState.prototype.withZeroScale = function () {
        return new ContentLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0, this.color, 0);
    };
    return ContentLayoutState;
}(_LayoutState__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (ContentLayoutState);


/***/ }),

/***/ "../src/animation/EvalAnimation.ts":
/*!*****************************************!*\
  !*** ../src/animation/EvalAnimation.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ "../src/animation/Animation.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var EvalAnimation = /** @class */ (function (_super) {
    __extends(EvalAnimation, _super);
    function EvalAnimation(evalFrom, evalTo, set, ctx, duration) {
        return _super.call(this, duration, _main_consts__WEBPACK_IMPORTED_MODULE_1__["moveEasing"], set, evalFrom, evalTo.withZeroScale(), evalFrom.component, ctx) || this;
    }
    return EvalAnimation;
}(_Animation__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (EvalAnimation);


/***/ }),

/***/ "../src/animation/LayoutState.ts":
/*!***************************************!*\
  !*** ../src/animation/LayoutState.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Stores how a component should be
 * drawn at a particular step.
 */
var LayoutState = /** @class */ (function () {
    function LayoutState(layoutParent, component, tlx, tly, width, height, scale) {
        this.tlx = tlx;
        this.tly = tly;
        this.width = width;
        this.height = height;
        this.component = component;
        this.layoutParent = layoutParent;
        this.scale = scale;
    }
    /**
     * Checks if this layout contains the
     * specified point.
     *
     * @param x X-ordinate of the point.
     * @param y Y-ordinate of the point.
     */
    LayoutState.prototype.contains = function (x, y) {
        return x >= this.tlx &&
            x <= this.tlx + this.width &&
            y >= this.tly &&
            y <= this.tly + this.height;
    };
    /**
     * Checks if the x-ordinate is on
     * the left half of this layout.
     *
     * @param x The x-ordinate
     */
    LayoutState.prototype.onLeft = function (x) {
        return x <= this.tlx + this.width / 2;
    };
    /**
     * Checks if the y-ordinate is on
     * the top half of this layout.
     *
     * @param y The y-ordinate
     */
    LayoutState.prototype.onTop = function (y) {
        return y <= this.tly + this.height / 2;
    };
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    LayoutState.prototype.withZeroScale = function () {
        return new LayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0);
    };
    return LayoutState;
}());
/* harmony default export */ __webpack_exports__["default"] = (LayoutState);


/***/ }),

/***/ "../src/animation/MoveAnimation.ts":
/*!*****************************************!*\
  !*** ../src/animation/MoveAnimation.ts ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ "../src/animation/Animation.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var MoveAnimation = /** @class */ (function (_super) {
    __extends(MoveAnimation, _super);
    function MoveAnimation(start, end, set, ctx, duration) {
        return _super.call(this, duration, _main_consts__WEBPACK_IMPORTED_MODULE_1__["moveEasing"], set, start, end, end.component, ctx) || this;
    }
    return MoveAnimation;
}(_Animation__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (MoveAnimation);


/***/ }),

/***/ "../src/animation/OriginalDimenLayoutState.ts":
/*!****************************************************!*\
  !*** ../src/animation/OriginalDimenLayoutState.ts ***!
  \****************************************************/
/*! exports provided: OriginalDimenLayoutState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OriginalDimenLayoutState", function() { return OriginalDimenLayoutState; });
/* harmony import */ var _ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentLayoutState */ "../src/animation/ContentLayoutState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * A layout state that also stores the original (non-scaled)
 * inner dimensions.
 */
var OriginalDimenLayoutState = /** @class */ (function (_super) {
    __extends(OriginalDimenLayoutState, _super);
    function OriginalDimenLayoutState(layoutParent, component, tlx, tly, width, height, scale, color, opacity, origInnerWidth, origInnerHeight) {
        var _this = _super.call(this, layoutParent, component, tlx, tly, width, height, scale, color, opacity) || this;
        _this.origInnerWidth = origInnerWidth;
        _this.origInnerHeight = origInnerHeight;
        return _this;
    }
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    OriginalDimenLayoutState.prototype.withZeroScale = function () {
        return new OriginalDimenLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0, this.color, 0, this.origInnerWidth, this.origInnerHeight);
    };
    return OriginalDimenLayoutState;
}(_ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__["default"]));



/***/ }),

/***/ "../src/animation/OutlineColorAnimation.ts":
/*!*************************************************!*\
  !*** ../src/animation/OutlineColorAnimation.ts ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BezierCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierCallback */ "../src/animation/BezierCallback.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var OutlineColorAnimation = /** @class */ (function (_super) {
    __extends(OutlineColorAnimation, _super);
    function OutlineColorAnimation(outlineLayout, newColor, set) {
        var _this = _super.call(this, _main_consts__WEBPACK_IMPORTED_MODULE_1__["outlineFadeInDuration"], _main_consts__WEBPACK_IMPORTED_MODULE_1__["outlineFadeInEasing"], set) || this;
        _this.layout = outlineLayout;
        _this.startColor = _this.layout.color;
        _this.endColor = newColor;
        set.addAnimation(_this);
        return _this;
    }
    OutlineColorAnimation.prototype.step = function (completion) {
        var currR = this.startColor[0] * (1 - completion) + this.endColor[0] * completion;
        var currG = this.startColor[1] * (1 - completion) + this.endColor[1] * completion;
        var currB = this.startColor[2] * (1 - completion) + this.endColor[2] * completion;
        this.layout.color = [Math.round(currR), Math.round(currG), Math.round(currB)];
    };
    return OutlineColorAnimation;
}(_BezierCallback__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (OutlineColorAnimation);


/***/ }),

/***/ "../src/animation/OutlineFadeAnimation.ts":
/*!************************************************!*\
  !*** ../src/animation/OutlineFadeAnimation.ts ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BezierCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierCallback */ "../src/animation/BezierCallback.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var OutlineFadeAnimation = /** @class */ (function (_super) {
    __extends(OutlineFadeAnimation, _super);
    function OutlineFadeAnimation(outlineLayout, newOpacity, set) {
        var _this = _super.call(this, _main_consts__WEBPACK_IMPORTED_MODULE_1__["outlineFadeInDuration"], _main_consts__WEBPACK_IMPORTED_MODULE_1__["outlineFadeInEasing"], set) || this;
        _this.layout = outlineLayout;
        _this.startO = _this.layout.opacity;
        _this.endO = newOpacity;
        set.addAnimation(_this);
        return _this;
    }
    OutlineFadeAnimation.prototype.step = function (completion) {
        var currOpacity = this.startO * (1 - completion) + this.endO * completion;
        this.layout.opacity = currOpacity;
    };
    return OutlineFadeAnimation;
}(_BezierCallback__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (OutlineFadeAnimation);


/***/ }),

/***/ "../src/animation/ProgressAnimation.ts":
/*!*********************************************!*\
  !*** ../src/animation/ProgressAnimation.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BezierCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierCallback */ "../src/animation/BezierCallback.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Animate the progress indicator.
 */
var ProgressAnimation = /** @class */ (function (_super) {
    __extends(ProgressAnimation, _super);
    function ProgressAnimation(startStep, endStep, numSteps, pi, set, duration, easing, canvasWidth, canvasHeight) {
        var _this = _super.call(this, duration, easing, set) || this;
        _this.startCompletion = startStep / (numSteps - 1);
        _this.endCompletion = endStep / (numSteps - 1);
        _this.pi = pi;
        _this.canvasWidth = canvasWidth;
        _this.canvasHeight = canvasHeight;
        return _this;
    }
    ProgressAnimation.prototype.step = function (animCompletion) {
        var currCompletion = this.startCompletion * (1 - animCompletion) + this.endCompletion * animCompletion;
        this.pi.draw(currCompletion, this.canvasWidth, this.canvasHeight);
    };
    return ProgressAnimation;
}(_BezierCallback__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (ProgressAnimation);


/***/ }),

/***/ "../src/animation/RadioButtonLayoutState.ts":
/*!**************************************************!*\
  !*** ../src/animation/RadioButtonLayoutState.ts ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentLayoutState */ "../src/animation/ContentLayoutState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RadioButtonLayoutState = /** @class */ (function (_super) {
    __extends(RadioButtonLayoutState, _super);
    function RadioButtonLayoutState(component, tlx, tly, width, height, scale, color, opacity, percentFill) {
        var _this = _super.call(this, undefined, component, tlx, tly, width, height, scale, color, opacity) || this;
        _this.percentFill = percentFill;
        return _this;
    }
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    RadioButtonLayoutState.prototype.withZeroScale = function () {
        return new RadioButtonLayoutState(this.component, this.tlx, this.tly, this.width, this.height, 0, this.color, 0, this.percentFill);
    };
    return RadioButtonLayoutState;
}(_ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RadioButtonLayoutState);


/***/ }),

/***/ "../src/animation/RadioButtonSelectAnimation.ts":
/*!******************************************************!*\
  !*** ../src/animation/RadioButtonSelectAnimation.ts ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BezierCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BezierCallback */ "../src/animation/BezierCallback.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RadioButtonSelectAnimation = /** @class */ (function (_super) {
    __extends(RadioButtonSelectAnimation, _super);
    function RadioButtonSelectAnimation(duration, easing, set, layout, startFill, endFill) {
        var _this = _super.call(this, duration, easing, set) || this;
        _this.layout = layout;
        _this.startFill = startFill;
        _this.endFill = endFill;
        set.addAnimation(_this);
        return _this;
    }
    RadioButtonSelectAnimation.prototype.step = function (completion) {
        var currFill = this.startFill * (1 - completion) + this.endFill * completion;
        this.layout.percentFill = currFill;
    };
    return RadioButtonSelectAnimation;
}(_BezierCallback__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RadioButtonSelectAnimation);


/***/ }),

/***/ "../src/animation/RemoveAnimation.ts":
/*!*******************************************!*\
  !*** ../src/animation/RemoveAnimation.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ "../src/animation/Animation.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var RemoveAnimation = /** @class */ (function (_super) {
    __extends(RemoveAnimation, _super);
    function RemoveAnimation(start, set, ctx, duration) {
        return _super.call(this, duration, _main_consts__WEBPACK_IMPORTED_MODULE_1__["removeEasing"], set, start, start.withZeroScale(), start.component, ctx) || this;
    }
    return RemoveAnimation;
}(_Animation__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RemoveAnimation);


/***/ }),

/***/ "../src/animation/ReverseEvalAnimation.ts":
/*!************************************************!*\
  !*** ../src/animation/ReverseEvalAnimation.ts ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animation */ "../src/animation/Animation.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ReverseEvalAnimation = /** @class */ (function (_super) {
    __extends(ReverseEvalAnimation, _super);
    function ReverseEvalAnimation(from, to, set, ctx, duration) {
        return _super.call(this, duration, _main_consts__WEBPACK_IMPORTED_MODULE_1__["moveEasing"], set, from.withZeroScale(), to, to.component, ctx) || this;
    }
    return ReverseEvalAnimation;
}(_Animation__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (ReverseEvalAnimation);


/***/ }),

/***/ "../src/animation/RootContainerLayoutState.ts":
/*!****************************************************!*\
  !*** ../src/animation/RootContainerLayoutState.ts ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LayoutState */ "../src/animation/LayoutState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RootContainerLayoutState = /** @class */ (function (_super) {
    __extends(RootContainerLayoutState, _super);
    function RootContainerLayoutState(layoutParent, component, tlx, tly, width, height, scale, kinkTipX, kinkTipY, kinkTopX, kinkTopY, tickBotX, tickBotY, tickTopX, tickTopY, endX, endY) {
        var _this = _super.call(this, layoutParent, component, tlx, tly, width, height, scale) || this;
        _this.kinkTipX = kinkTipX;
        _this.kinkTipY = kinkTipY;
        _this.kinkTopX = kinkTopX;
        _this.kinkTopY = kinkTopY;
        _this.tickBotX = tickBotX;
        _this.tickBotY = tickBotY;
        _this.tickTopX = tickTopX;
        _this.tickTopY = tickTopY;
        _this.endX = endX;
        _this.endY = endY;
        return _this;
    }
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    RootContainerLayoutState.prototype.withZeroScale = function () {
        return new RootContainerLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0, this.kinkTipX, this.kinkTipY, this.kinkTopX, this.kinkTopY, this.tickBotX, this.tickBotY, this.tickTopX, this.tickTopY, this.endX, this.endY);
    };
    return RootContainerLayoutState;
}(_LayoutState__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RootContainerLayoutState);


/***/ }),

/***/ "../src/animation/TermLayoutState.ts":
/*!*******************************************!*\
  !*** ../src/animation/TermLayoutState.ts ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ContentLayoutState */ "../src/animation/ContentLayoutState.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var TermLayoutState = /** @class */ (function (_super) {
    __extends(TermLayoutState, _super);
    function TermLayoutState() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.padding = _main_consts__WEBPACK_IMPORTED_MODULE_1__["termPadding"];
        return _this;
    }
    /**
     * Change this layout state to
     * reflect a Term in a tight
     * layout. This reduces padding
     * and width.
     *
     * @param widthDiff The difference in width between a tight and normal term.
     */
    TermLayoutState.prototype.tighten = function (widthDiff) {
        this.padding = _main_consts__WEBPACK_IMPORTED_MODULE_1__["tightTermPadding"];
        this.width -= widthDiff;
    };
    /**
     * Returns a new Layout State the same
     * as this one, but with a scaling of 0.
     */
    TermLayoutState.prototype.withZeroScale = function () {
        return new TermLayoutState(this.layoutParent, this.component, this.tlx, this.tly, this.width, this.height, 0, this.color, 0);
    };
    return TermLayoutState;
}(_ContentLayoutState__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (TermLayoutState);


/***/ }),

/***/ "../src/layout/CurvedOutline.ts":
/*!**************************************!*\
  !*** ../src/layout/CurvedOutline.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _animation_ContentLayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/ContentLayoutState */ "../src/animation/ContentLayoutState.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



/**
 * Temporary content that draws a curved outline.
 */
var CurvedOutline = /** @class */ (function (_super) {
    __extends(CurvedOutline, _super);
    /**
     * Initialize a curved outline with the same dimensions
     * as a layout state.
     * @param mimic The layout state to mimic.
     * @param addTo The collection to add this outline to.
     * @param opacity The opacity to render as.
     */
    function CurvedOutline(padding, mimic, addTo, opacity, color) {
        var _this = _super.call(this, padding, undefined) || this;
        var padWidth = padding.width();
        var padHeight = padding.height();
        _this.layout = new _animation_ContentLayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, _this, mimic.tlx - padWidth / 2, mimic.tly - padHeight / 2, mimic.width + padWidth, mimic.height + padHeight, mimic.scale, color, opacity);
        addTo.set(_this, _this.layout);
        _this.width = _this.layout.width;
        _this.height = _this.layout.height;
        return _this;
    }
    CurvedOutline.prototype.getLayout = function () {
        return this.layout;
    };
    /**
     * Draws the content on the canvas.
     *
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    CurvedOutline.prototype.draw = function (before, after, progress, ctx) {
        this.setupCtx(before, after, progress, ctx);
        // Draw rectangle with rounded corners
        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;
        var r = _main_consts__WEBPACK_IMPORTED_MODULE_2__["curvedOutlineBorderRadius"];
        ctx.beginPath();
        // Top line
        ctx.moveTo(-halfWidth + r, -halfHeight);
        ctx.lineTo(halfWidth - r, -halfHeight);
        // Top right corner
        ctx.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + r);
        // Right line
        ctx.lineTo(halfWidth, halfHeight - r);
        // Bottom right corner
        ctx.quadraticCurveTo(halfWidth, halfHeight, halfWidth - r, halfHeight);
        // Bottom line
        ctx.lineTo(-halfWidth + r, halfHeight);
        // Bottom left corner
        ctx.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - r);
        // Left line
        ctx.lineTo(-halfWidth, -halfHeight + r);
        // Top left corner
        ctx.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + r, -halfHeight);
        // Finish up
        ctx.closePath();
        ctx.stroke();
    };
    CurvedOutline.prototype.calcWidth = function () { return this.width; };
    CurvedOutline.prototype.calcHeight = function () { return this.height; };
    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     *
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    CurvedOutline.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        return undefined;
    };
    return CurvedOutline;
}(_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CurvedOutline);


/***/ }),

/***/ "../src/layout/EqComponent.ts":
/*!************************************!*\
  !*** ../src/layout/EqComponent.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * Represents any component (container, content)
 * that takes up space and forms a part of the
 * layout of a step.
 * The type L represents the Layout State that this
 * component produces.
 */
var EqComponent = /** @class */ (function () {
    function EqComponent(padding) {
        this.padding = padding;
    }
    EqComponent.prototype.setWidth = function (newWidth) {
        this.width = newWidth;
    };
    EqComponent.prototype.setHeight = function (newHeight) {
        this.height = newHeight;
    };
    EqComponent.prototype.getWidth = function () {
        return this.width;
    };
    EqComponent.prototype.getHeight = function () {
        return this.height;
    };
    EqComponent.prototype.getPadding = function () {
        return this.padding;
    };
    /**
     * Recalc dimensions for this component, and all children if
     * this is a container. Default implementation does just for
     * this component.
     */
    EqComponent.prototype.recalcDimensions = function () {
        this.width = this.calcWidth();
        this.height = this.calcHeight();
    };
    /**
     * Return the vertical dimensions that form the 'main text line'
     * of this component. This is only relevant to HBoxes, which will
     * ensure that their children's main text lines line up. These
     * dimensions are given with respect to the top of this component,
     * including padding. The default implementation given here returns
     * undefined, indicating that the component does not have a main
     * text line. Components that do this are simply vertically centered
     * in the HBox.
     */
    EqComponent.prototype.getMainTextLine = function () {
        return undefined;
    };
    return EqComponent;
}());
/* harmony default export */ __webpack_exports__["default"] = (EqComponent);


/***/ }),

/***/ "../src/layout/EqContainer.ts":
/*!************************************!*\
  !*** ../src/layout/EqContainer.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqComponent */ "../src/layout/EqComponent.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Umbrella class for all containers. Doesn't declare anything, but useful for
 * checking if a variable is a container using instanceof.
 */
var EqContainer = /** @class */ (function (_super) {
    __extends(EqContainer, _super);
    function EqContainer(padding) {
        return _super.call(this, padding) || this;
    }
    return EqContainer;
}(_EqComponent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (EqContainer);


/***/ }),

/***/ "../src/layout/EqContent.ts":
/*!**********************************!*\
  !*** ../src/layout/EqContent.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqComponent */ "../src/layout/EqComponent.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var EqContent = /** @class */ (function (_super) {
    __extends(EqContent, _super);
    function EqContent(padding, ref) {
        var _this = _super.call(this, padding) || this;
        //Whether to interpolate color and opacity
        //during the current animation.
        _this.interpColor = true;
        _this.ref = ref;
        return _this;
    }
    /**
     * Sets up the Canvas by performing
     * transformations and style changes.
     * Subclasses should call the method as
     * defined here, then draw themselves
     * centered on (0, 0). Returns width
     * and height to allow them
     * to do this.
     * There is no need to call save() or
     * restore(), animations handle this.
     *
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    EqContent.prototype.setupCtx = function (before, after, progress, ctx) {
        var invProg = 1 - progress;
        var x = before.tlx * invProg + after.tlx * progress;
        var y = before.tly * invProg + after.tly * progress;
        var width = before.width * invProg + after.width * progress;
        var height = before.height * invProg + after.height * progress;
        var scale = before.scale * invProg + after.scale * progress;
        ctx.translate(x + width / 2, y + height / 2);
        ctx.scale(scale, scale);
        this.setupCtxStyle(before, after, progress, ctx);
        return [width, height];
    };
    /**
     * Interpolates color and opacity and sets up the
     * canvas to draw with the right color and opacity.
     *
     * @param before The State before.
     * @param after The State after.
     * @param progress How close we are to after, from before,
     *                 from 0-1.
     * @param ctx The rendering context.
     */
    EqContent.prototype.setupCtxStyle = function (before, after, progress, ctx) {
        if (progress === 0) {
            //Check whether to interpolate color at start of animation
            var colB = before.color;
            var colA = after.color;
            this.interpColor = colB[0] !== colA[0] ||
                colB[1] !== colA[1] ||
                colB[2] !== colA[2] ||
                before.opacity !== after.opacity;
        }
        var color = before.color;
        var opacity = before.opacity;
        if (this.interpColor) {
            var invProg = 1 - progress;
            var r = before.color[0] * invProg + after.color[0] * progress;
            var g = before.color[1] * invProg + after.color[1] * progress;
            var b = before.color[2] * invProg + after.color[2] * progress;
            var a = before.opacity * invProg + after.opacity * progress;
            color = [Math.round(r), Math.round(g), Math.round(b)];
            opacity = a;
        }
        this.setCtxStyle(ctx, color, opacity);
    };
    /**
     * Sets a graphics context to have
     * a certain color and opacity.
     *
     * @param ctx The graphics context.
     * @param color The color.
     * @param opacity The opacity.
     */
    EqContent.prototype.setCtxStyle = function (ctx, color, opacity) {
        var style = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_1__["rgbaArrayToCssString"])(color.concat([opacity]));
        ctx.fillStyle = style;
        ctx.strokeStyle = style;
    };
    /**
     * Given a colors object, determine what
     * color this content should be.
     *
     * @param colorObj The colors object for a step.
     */
    EqContent.prototype.getColorForContent = function (colorObj) {
        if (colorObj !== undefined && colorObj[this.ref] !== undefined) {
            //A color is specified
            return EqContent.colors[colorObj[this.ref]];
        }
        else {
            //A color isn't specified, use default
            return EqContent.colors['default'];
        }
    };
    /**
     * Gets the opacity for this content
     * at a step.
     *
     * @param opacityObj The opacities object for a step.
     */
    EqContent.prototype.getOpacityForContent = function (opacityObj) {
        if (opacityObj !== undefined && opacityObj[this.ref] !== undefined) {
            //Opacity specified
            return opacityObj[this.ref];
        }
        else {
            //No opacity specified
            return _main_consts__WEBPACK_IMPORTED_MODULE_2__["normalOpacity"];
        }
    };
    /**
     * Set the content to not interpolate color
     * until setupCtx is called with progress = 0.
     */
    EqContent.prototype.interpColorOff = function () {
        this.interpColor = false;
    };
    EqContent.prototype.getRef = function () {
        return this.ref;
    };
    return EqContent;
}(_EqComponent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (EqContent);


/***/ }),

/***/ "../src/layout/HBox.ts":
/*!*****************************!*\
  !*** ../src/layout/HBox.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _LinearContainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./LinearContainer */ "../src/layout/LinearContainer.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var HBox = /** @class */ (function (_super) {
    __extends(HBox, _super);
    function HBox(children, padding) {
        var _this = _super.call(this, children, padding) || this;
        _this.width = _this.calcWidth();
        _this.height = _this.calcHeight();
        return _this;
    }
    HBox_1 = HBox;
    HBox.prototype.calcHeight = function () {
        // Line up text of children, then return their position relative to this component
        // Sort children into those with a line and those without
        // Store their line if they have one
        var childrenWithLine = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["newMap"])();
        var childrenWithoutLine = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["newMap"])();
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            var line = child.getMainTextLine();
            if (line === undefined) {
                childrenWithoutLine.set(child, undefined);
            }
            else {
                childrenWithLine.set(child, line);
            }
        }
        // Calculate the height that the aligned children will take up
        // To do this, we find the maximum of two distances:
        //  - From the middle of the main line to the top of the component
        //  - From the middle of the main line to the bottom of the component
        // And we add them together.
        var maxAboveAligned = 0;
        var maxBelowAligned = 0;
        var lineHeight; // Must be consistently one of CanvasController.termHeights for all components
        childrenWithLine.forEach(function (line, component) {
            lineHeight = line[1] - line[0];
            var compHeight = component.getHeight();
            var middleOfLine = (line[0] + line[1]) / 2;
            var above = middleOfLine;
            var below = compHeight - middleOfLine;
            if (above > maxAboveAligned) {
                maxAboveAligned = above;
            }
            if (below > maxBelowAligned) {
                maxBelowAligned = below;
            }
        });
        // See if any non-aligned components will poke above/below this
        // when centered with the middle of the aligned line
        var maxAboveNonAligned = maxAboveAligned;
        var maxBelowNonAligned = maxBelowAligned;
        childrenWithoutLine.forEach(function (nothing, component) {
            var halfCompHeight = component.getHeight() / 2;
            if (halfCompHeight > maxAboveNonAligned) {
                maxAboveNonAligned = halfCompHeight;
            }
            if (halfCompHeight > maxBelowNonAligned) {
                maxBelowNonAligned = halfCompHeight;
            }
        });
        // Case for if there are no aligned children
        if (childrenWithLine.size === 0) {
            this.mainLine = undefined;
            var finalHeight = maxAboveNonAligned + maxBelowNonAligned + this.padding.height();
            this.middleMainLineDist = finalHeight / 2;
            return finalHeight;
        }
        // Distance between top of this and start of aligned part
        var topAlignedDist = maxAboveNonAligned > maxAboveAligned ? maxAboveNonAligned - maxAboveAligned : 0;
        // Distance from top of this to top of main line
        var topMainLineDist = this.padding.top + topAlignedDist + maxAboveAligned - lineHeight / 2;
        // Distance from top of this to bottom of main line
        var botMainLineDist = topMainLineDist + lineHeight;
        this.middleMainLineDist = topMainLineDist + (botMainLineDist - topMainLineDist) / 2;
        this.mainLine = [topMainLineDist, botMainLineDist];
        // The final height
        return maxAboveNonAligned + maxBelowNonAligned + this.padding.height();
    };
    HBox.prototype.calcWidth = function () {
        var totalWidth = 0;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            totalWidth += currChild.getWidth();
        }
        return totalWidth + this.padding.width();
    };
    HBox.prototype.getMainTextLine = function () {
        return (this.mainLine ? this.mainLine.slice() : undefined);
    };
    HBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var upToX = tlx + this.padding.left * currScale;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            var childHeight = currChild.getHeight() * currScale;
            var childLine = currChild.getMainTextLine();
            // Position child in the middle of the main line if it isn't aligned
            // Position its main line in the middle of this's main line if it is
            var childTLY = tly;
            if (childLine) {
                childLine[0] *= currScale;
                childLine[1] *= currScale;
                childTLY += this.middleMainLineDist * currScale - (childLine[1] + childLine[0]) / 2;
            }
            else {
                childTLY += this.middleMainLineDist * currScale - childHeight / 2;
            }
            upToX += currChild.addLayout(state, layouts, upToX, childTLY, currScale, opacityObj, colorObj, mouseEnter, mouseExit, mouseClick, tempContent).width;
        }
        layouts.set(this, state);
        return state;
    };
    var HBox_1;
    HBox = HBox_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__["Container"])({
            typeString: 'hbox',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                // Return HBox from file
                var format = containerObj;
                var children = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["parseContainerChildren"])(format.children, depth + 1, containerGetter, contentGetter);
                return new HBox_1(children, _Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(_main_consts__WEBPACK_IMPORTED_MODULE_5__["defaultHBoxPadding"]));
            }
        }),
        __metadata("design:paramtypes", [Array, _Padding__WEBPACK_IMPORTED_MODULE_0__["default"]])
    ], HBox);
    return HBox;
}(_LinearContainer__WEBPACK_IMPORTED_MODULE_3__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (HBox);


/***/ }),

/***/ "../src/layout/HDivider.ts":
/*!*********************************!*\
  !*** ../src/layout/HDivider.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/OriginalDimenLayoutState */ "../src/animation/OriginalDimenLayoutState.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var HDivider = /** @class */ (function (_super) {
    __extends(HDivider, _super);
    function HDivider(padding, ref) {
        var _this = _super.call(this, padding, ref) || this;
        _this.height = _this.calcHeight();
        //For layout purposes, the divider
        //has no width. It stretches to fill
        //its container.
        _this.width = _this.calcWidth();
        return _this;
    }
    HDivider_1 = HDivider;
    HDivider.prototype.setPadding = function (newPadding) {
        this.padding = newPadding;
    };
    HDivider.prototype.calcWidth = function () { return 0; };
    HDivider.prototype.calcHeight = function () { return 1 + this.padding.height(); };
    HDivider.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        //Set x to align left with parent
        var x = parentLayout.tlx;
        var width = parentLayout.width;
        var height = this.getHeight();
        var state = new _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__["OriginalDimenLayoutState"](parentLayout, this, x, tly, width, height, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj), width / currScale, height);
        layouts.set(this, state);
        return state;
    };
    HDivider.prototype.draw = function (before, after, progress, ctx) {
        this.setupCtx(before, after, progress, ctx);
        var width = before.origInnerWidth * (1 - progress) + after.origInnerWidth * progress;
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_1__["line"])(-width / 2 + this.padding.left, 0, width / 2 - this.padding.right, 0, ctx);
    };
    var HDivider_1;
    HDivider = HDivider_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__["Content"])({
            character: 'h',
            initialize: function (file) {
                var dividers = [];
                for (var i = 0; i < file.hDividers; i++) {
                    dividers.push(new HDivider_1(_main_consts__WEBPACK_IMPORTED_MODULE_5__["hDividerPadding"], 'h' + i));
                }
                return dividers;
            }
        }),
        __metadata("design:paramtypes", [_Padding__WEBPACK_IMPORTED_MODULE_2__["default"], String])
    ], HDivider);
    return HDivider;
}(_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (HDivider);


/***/ }),

/***/ "../src/layout/LinearContainer.ts":
/*!****************************************!*\
  !*** ../src/layout/LinearContainer.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContainer */ "../src/layout/EqContainer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Represents a simple linear container
 * whose contents can be represented as
 * a single children array.
 */
var LinearContainer = /** @class */ (function (_super) {
    __extends(LinearContainer, _super);
    function LinearContainer(children, padding) {
        var _this = _super.call(this, padding) || this;
        _this.children = children;
        return _this;
    }
    LinearContainer.prototype.getChildren = function () {
        return this.children;
    };
    LinearContainer.prototype.recalcDimensions = function () {
        this.children.forEach(function (child) { return child.recalcDimensions(); });
        _super.prototype.recalcDimensions.call(this);
    };
    return LinearContainer;
}(_EqContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (LinearContainer);


/***/ }),

/***/ "../src/layout/Padding.ts":
/*!********************************!*\
  !*** ../src/layout/Padding.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Padding = /** @class */ (function () {
    function Padding(top, left, bottom, right) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
    }
    Padding.prototype.height = function () {
        return this.top + this.bottom;
    };
    Padding.prototype.width = function () {
        return this.left + this.right;
    };
    /**
     * Return a new Padding, having scaled this
     * one by a certain amount.
     * @param by The amount to scale by.
     */
    Padding.prototype.scale = function (by) {
        return new Padding(this.top * by, this.left * by, this.bottom * by, this.right * by);
    };
    /**
     * Return a new Padding with same insets on
     * each side.
     * @param amount The amount of inset on each side.
     */
    Padding.even = function (amount) {
        return new Padding(amount, amount, amount, amount);
    };
    return Padding;
}());
/* harmony default export */ __webpack_exports__["default"] = (Padding);


/***/ }),

/***/ "../src/layout/Quiz.ts":
/*!*****************************!*\
  !*** ../src/layout/Quiz.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VBox */ "../src/layout/VBox.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _CurvedOutline__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CurvedOutline */ "../src/layout/CurvedOutline.ts");
/* harmony import */ var _animation_OutlineFadeAnimation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../animation/OutlineFadeAnimation */ "../src/animation/OutlineFadeAnimation.ts");
/* harmony import */ var _animation_OutlineColorAnimation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../animation/OutlineColorAnimation */ "../src/animation/OutlineColorAnimation.ts");
/* harmony import */ var _RadioButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./RadioButton */ "../src/layout/RadioButton.ts");
/* harmony import */ var _animation_RadioButtonSelectAnimation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../animation/RadioButtonSelectAnimation */ "../src/animation/RadioButtonSelectAnimation.ts");
/* harmony import */ var _animation_RadioButtonLayoutState__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../animation/RadioButtonLayoutState */ "../src/animation/RadioButtonLayoutState.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var Quiz = /** @class */ (function (_super) {
    __extends(Quiz, _super);
    function Quiz(children, padding, answers, outlineOpacity, outlineColor, radioButtonOpacity, radioButtonColor, correctColor, incorrectColor) {
        var _this = _super.call(this, children, padding) || this;
        _this.clickedIndex = -1;
        _this.outlineOpacity = outlineOpacity;
        _this.outlineColor = outlineColor;
        _this.radioButtonOpacity = radioButtonOpacity;
        _this.radioButtonColor = radioButtonColor;
        _this.correctColor = correctColor;
        _this.incorrectColor = incorrectColor;
        _this.answers = [];
        answers.forEach(function (index) { return _this.answers[index] = true; });
        return _this;
    }
    Quiz_1 = Quiz;
    // Override to add padding
    Quiz.prototype.calcWidth = function () {
        return _super.prototype.calcWidth.call(this) + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizCurvedOutlinePadding"].width() + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDimen"];
    };
    // Override to add margin
    Quiz.prototype.calcHeight = function () {
        return _super.prototype.calcHeight.call(this) + _main_consts__WEBPACK_IMPORTED_MODULE_11__["answerVMargin"] * (this.children.length + 2);
    };
    Quiz.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var _this = this;
        var state = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        var upToY = tly + this.padding.top * currScale + _main_consts__WEBPACK_IMPORTED_MODULE_11__["answerVMargin"];
        var allOutlines = [];
        var allButtons = [];
        var _loop_1 = function (i) {
            var currChild = this_1.children[i];
            // Width of the whole row (button, outline, and child)
            var rowWidth = currChild.getWidth() + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizCurvedOutlinePadding"].width() + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDimen"];
            // Height of the whole row (same as height of child)
            var rowHeight = currChild.getHeight();
            // Start x of the whole row
            var rowTLX = tlx + (innerWidth - rowWidth) / 2;
            // Add radio button
            var radioButton = new _RadioButton__WEBPACK_IMPORTED_MODULE_7__["default"](_main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonPadding"], rowTLX, upToY + (rowHeight - _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDimen"]) / 2, _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDimen"], layouts, this_1.radioButtonOpacity, this_1.radioButtonColor);
            tempContent.push(radioButton);
            var radioButtonLayout = radioButton.getLayout();
            allButtons.push(radioButtonLayout);
            if (this_1.clickedIndex === i) {
                radioButtonLayout.percentFill = 1;
            }
            // Position child in the middle horizontally
            var childTLX = rowTLX + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDimen"] + _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizCurvedOutlinePadding"].left;
            var childLayout = currChild.addLayout(state, layouts, childTLX, upToY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
            upToY += childLayout.height + _main_consts__WEBPACK_IMPORTED_MODULE_11__["answerVMargin"];
            // Give child an outline that can respond to events.
            var outline = new _CurvedOutline__WEBPACK_IMPORTED_MODULE_4__["default"](_main_consts__WEBPACK_IMPORTED_MODULE_11__["quizCurvedOutlinePadding"], childLayout, layouts, this_1.outlineOpacity, this_1.outlineColor);
            tempContent.push(outline);
            var outlineLayout = outline.getLayout();
            allOutlines.push(outlineLayout);
            if (this_1.clickedIndex !== -1) {
                outlineLayout.opacity = _main_consts__WEBPACK_IMPORTED_MODULE_11__["revealedOutlineOpacity"];
                if (this_1.answers[i]) {
                    outlineLayout.color = this_1.correctColor;
                }
                else {
                    outlineLayout.color = this_1.incorrectColor;
                }
            }
            // If mouse enters outline or button, make it lighter (unless answer has been revealed)
            var onEnter = function (oldLayout, set, controller) {
                if (_this.clickedIndex === -1) {
                    new _animation_OutlineFadeAnimation__WEBPACK_IMPORTED_MODULE_5__["default"](outlineLayout, _main_consts__WEBPACK_IMPORTED_MODULE_11__["hoveredOutlineOpacity"], set);
                    new _animation_RadioButtonSelectAnimation__WEBPACK_IMPORTED_MODULE_8__["default"](_main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonSelectDuration"], _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonSelectEasing"], set, radioButtonLayout, 0, 1);
                }
                controller.setCursor('pointer');
            };
            if (this_1.clickedIndex === -1) {
                mouseEnter.set(outlineLayout, onEnter);
                mouseEnter.set(radioButtonLayout, onEnter);
            }
            // If mouse exits, make darker again (unless answer has been revealed)
            var onExit = function (oldLayout, set, controller) {
                if (_this.clickedIndex === -1) {
                    new _animation_OutlineFadeAnimation__WEBPACK_IMPORTED_MODULE_5__["default"](outlineLayout, _this.outlineOpacity, set);
                    new _animation_RadioButtonSelectAnimation__WEBPACK_IMPORTED_MODULE_8__["default"](_main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDeselectDuration"], _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizRadioButtonDeselectEasing"], set, radioButtonLayout, 1, 0);
                }
                controller.setCursor('default');
            };
            if (this_1.clickedIndex === -1) {
                mouseExit.set(outlineLayout, onExit);
                mouseExit.set(radioButtonLayout, onExit);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.children.length; i++) {
            _loop_1(i);
        }
        if (this.clickedIndex === -1) {
            // If mouse clicks, reveal answer
            var onClick_1 = function (oldLayout, set, controller) {
                // Check if correct
                var clickedIndex = oldLayout instanceof _animation_RadioButtonLayoutState__WEBPACK_IMPORTED_MODULE_9__["default"] ? allButtons.indexOf(oldLayout) : allOutlines.indexOf(oldLayout);
                if (_this.answers[clickedIndex]) {
                    controller.setText('<em class="green">Correct!</em> Tap again to see working.');
                }
                else {
                    controller.setText('<em class="red">Not quite...</em> Tap again to see working.');
                }
                // Animate all options
                allOutlines.forEach(function (layout, index) {
                    // If correct, go green. Otherwise go red.
                    var color = _this.answers[index] ? _this.correctColor : _this.incorrectColor;
                    new _animation_OutlineColorAnimation__WEBPACK_IMPORTED_MODULE_6__["default"](layout, color, set);
                    new _animation_OutlineFadeAnimation__WEBPACK_IMPORTED_MODULE_5__["default"](layout, _main_consts__WEBPACK_IMPORTED_MODULE_11__["revealedOutlineOpacity"], set);
                    return true;
                });
                _this.clickedIndex = clickedIndex;
                // Remove the events so they won't be triggered again.
                allOutlines.forEach(function (layout) {
                    mouseClick.delete(layout);
                    mouseEnter.delete(layout);
                    mouseExit.delete(layout);
                });
                allButtons.forEach(function (layout) {
                    mouseClick.delete(layout);
                    mouseEnter.delete(layout);
                    mouseExit.delete(layout);
                });
                controller.setCursor("default");
            };
            // Bind all outlines to the same click event
            allOutlines.forEach(function (layout) { return mouseClick.set(layout, onClick_1); });
            allButtons.forEach(function (layout) { return mouseClick.set(layout, onClick_1); });
        }
        layouts.set(this, state);
        return state;
    };
    var Quiz_1;
    Quiz = Quiz_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_10__["Container"])({
            typeString: 'quiz',
            parse: function (containerObj, depth, contentGetter, containerGetter, inf) {
                var format = containerObj;
                return new Quiz_1(Object(_main_helpers__WEBPACK_IMPORTED_MODULE_3__["parseContainerChildren"])(format.children, depth + 1, containerGetter, contentGetter), _main_consts__WEBPACK_IMPORTED_MODULE_11__["defaultQuizPadding"], format.answers, inf['customColors'] && inf['customColors'].curvedOutlineOpacity ? inf['customColors'].curvedOutlineOpacity : _main_consts__WEBPACK_IMPORTED_MODULE_11__["curvedOutlineDefaultOpacity"], inf['customColors'] && inf['customColors'].curvedOutlineColor ? inf['customColors'].curvedOutlineColor : _main_consts__WEBPACK_IMPORTED_MODULE_11__["curvedOutlineColor"], inf['customColors'] && inf['customColors'].radioButtonOpacity ? inf['customColors'].radioButtonOpacity : _main_consts__WEBPACK_IMPORTED_MODULE_11__["radioButtonDefaultOpacity"], inf['customColors'] && inf['customColors'].radioButtonColor ? inf['customColors'].radioButtonColor : _main_consts__WEBPACK_IMPORTED_MODULE_11__["radioButtonColor"], inf['customColors'] && inf['customColors'].quizCorrectColor ? inf['customColors'].quizCorrectColor : _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizCorrectColor"], inf['customColors'] && inf['customColors'].quizIncorrectColor ? inf['customColors'].quizIncorrectColor : _main_consts__WEBPACK_IMPORTED_MODULE_11__["quizIncorrectColor"]);
            }
        }),
        __metadata("design:paramtypes", [Array, _Padding__WEBPACK_IMPORTED_MODULE_1__["default"], Array, Number, Array, Number, Array, Array, Array])
    ], Quiz);
    return Quiz;
}(_VBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Quiz);


/***/ }),

/***/ "../src/layout/Radical.ts":
/*!********************************!*\
  !*** ../src/layout/Radical.ts ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/OriginalDimenLayoutState */ "../src/animation/OriginalDimenLayoutState.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Radical = /** @class */ (function (_super) {
    __extends(Radical, _super);
    function Radical(ref) {
        var _this = _super.call(this, _Padding__WEBPACK_IMPORTED_MODULE_1__["default"].even(0), ref) || this;
        _this.height = _this.calcHeight();
        _this.width = _this.calcWidth();
        return _this;
    }
    Radical_1 = Radical;
    // Radical mimics dimensions of the root container, so for layout
    // purposes doesn't have dimensions to enforce.
    Radical.prototype.calcWidth = function () { return 0; };
    Radical.prototype.calcHeight = function () { return 0; };
    /**
     * Draws the content on the canvas.
     *
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    Radical.prototype.draw = function (before, after, progress, ctx) {
        var contBefore = before.layoutParent;
        var contAfter = after.layoutParent;
        var invProg = 1 - progress;
        var kinkTipX = contBefore.kinkTipX * invProg + contAfter.kinkTipX * progress;
        var kinkTipY = contBefore.kinkTipY * invProg + contAfter.kinkTipY * progress;
        var kinkTopX = contBefore.kinkTopX * invProg + contAfter.kinkTopX * progress;
        var kinkTopY = contBefore.kinkTopY * invProg + contAfter.kinkTopY * progress;
        var tickBotX = contBefore.tickBotX * invProg + contAfter.tickBotX * progress;
        var tickBotY = contBefore.tickBotY * invProg + contAfter.tickBotY * progress;
        var tickTopX = contBefore.tickTopX * invProg + contAfter.tickTopX * progress;
        var tickTopY = contBefore.tickTopY * invProg + contAfter.tickTopY * progress;
        var endX = contBefore.endX * invProg + contAfter.endX * progress;
        var endY = contBefore.endY * invProg + contAfter.endY * progress;
        var width = before.origInnerWidth * invProg + after.origInnerWidth * progress;
        var height = before.origInnerHeight * invProg + after.origInnerHeight * progress;
        this.setupCtx(before, after, progress, ctx);
        var startX = -width / 2;
        var startY = -height / 2;
        // Kink tip
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(startX + kinkTipX, startY + kinkTipY, startX + kinkTopX, startY + kinkTopY, ctx);
        // Rest of kink
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(startX + kinkTopX, startY + kinkTopY, startX + tickBotX, startY + tickBotY, ctx);
        // Tick
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(startX + tickBotX, startY + tickBotY, startX + tickTopX, startY + tickTopY, ctx);
        // Top
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(startX + tickTopX, startY + tickTopY, startX + endX, startY + endY, ctx);
    };
    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     *
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    Radical.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        var parentPad = parentLayout.component.getPadding().scale(currScale);
        var padWidth = parentPad.width();
        var padHeight = parentPad.height();
        var thisLayout = new _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__["OriginalDimenLayoutState"](parentLayout, this, tlx + padWidth / 2, tly + padHeight / 2, parentLayout.width - padWidth, parentLayout.height - padHeight, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj), (parentLayout.width - padWidth) / currScale, (parentLayout.height - padHeight) / currScale);
        layouts.set(this, thisLayout);
        return thisLayout;
    };
    var Radical_1;
    Radical = Radical_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__["Content"])({
            character: 'r',
            initialize: function (file) {
                var radicals = [];
                for (var i = 0; i < file.radicals; i++) {
                    radicals.push(new Radical_1('r' + i));
                }
                return radicals;
            }
        }),
        __metadata("design:paramtypes", [String])
    ], Radical);
    return Radical;
}(_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Radical);


/***/ }),

/***/ "../src/layout/RadioButton.ts":
/*!************************************!*\
  !*** ../src/layout/RadioButton.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _animation_RadioButtonLayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/RadioButtonLayoutState */ "../src/animation/RadioButtonLayoutState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var RadioButton = /** @class */ (function (_super) {
    __extends(RadioButton, _super);
    /**
     * Create a new Radio Button at the specified coordinates.
     * @param padding The padding to use. The drawn circle goes to the edge of the padding.
     * @param tlx The x-ordinate of the top left of the button, including padding.
     * @param tly The y-ordinate of the top left of the button, including padding.
     * @param dimen The width and height of the button.
     * @param addTo The collection to add the layout state of this radio button to.
     * @param opacity The opacity to render as.
     */
    function RadioButton(padding, tlx, tly, dimen, addTo, opacity, color) {
        var _this = _super.call(this, padding, undefined) || this;
        _this.layout = new _animation_RadioButtonLayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](_this, tlx, tly, dimen, dimen, 1, color, opacity, 0);
        _this.width = dimen;
        _this.height = dimen;
        addTo.set(_this, _this.layout);
        return _this;
    }
    RadioButton.prototype.getLayout = function () {
        return this.layout;
    };
    /**
     * Draws the content on the canvas.
     *
     * @param before The starting layout state.
     * @param after The ending layout state.
     * @param progress The progress through the animation from 0-1.
     * @param ctx The graphics context to draw on.
     */
    RadioButton.prototype.draw = function (before, after, progress, ctx) {
        this.setupCtx(before, after, progress, ctx);
        // Draw the outer circle
        ctx.beginPath();
        var rad = (this.width - this.padding.width()) / 2;
        ctx.arc(0, 0, rad, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
        // Draw the filled inner circle
        ctx.beginPath();
        var percentFill = before.percentFill * (1 - progress) + after.percentFill * progress;
        var innerRad = rad * percentFill;
        ctx.arc(0, 0, innerRad, 0, 2 * Math.PI);
        ctx.fill();
    };
    RadioButton.prototype.calcWidth = function () { return this.width; };
    RadioButton.prototype.calcHeight = function () { return this.height; };
    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     *
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    RadioButton.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        return undefined;
    };
    return RadioButton;
}(_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RadioButton);


/***/ }),

/***/ "../src/layout/RootContainer.ts":
/*!**************************************!*\
  !*** ../src/layout/RootContainer.ts ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _animation_RootContainerLayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/RootContainerLayoutState */ "../src/animation/RootContainerLayoutState.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _HBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HBox */ "../src/layout/HBox.ts");
/* harmony import */ var _Radical__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Works together with the 'Radical' content to
 * display roots. The radical is the line of the root.
 * The index is the container displayed on the top left
 * of the radical. Ie, for a cube root, it would contain
 * '3'. The argument is what is being rooted, residing
 * under the radical.
 */
var RootContainer = /** @class */ (function (_super) {
    __extends(RootContainer, _super);
    function RootContainer(index, argument, radical, padding, termHeights) {
        var _this = _super.call(this, padding) || this;
        _this.index = index;
        _this.argument = argument;
        _this.radical = radical;
        if (_this.termHeights === undefined || _this.termHeights.length === 0) {
            // Edge case: sometimes a RootContainer is constructed before any terms exist
            _this.termHeights = [20, 20, 20];
        }
        else {
            _this.termHeights = termHeights;
        }
        _this.calcMetrics();
        _this.width = _this.calcWidth();
        _this.height = _this.calcHeight();
        return _this;
    }
    RootContainer_1 = RootContainer;
    /**
     * Calculate the layout parameters for the display
     * of the container.
     */
    RootContainer.prototype.calcMetrics = function () {
        this.padBottom = _main_consts__WEBPACK_IMPORTED_MODULE_6__["termPadding"].bottom / 2;
        var termHeight = this.termHeights[Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["getWidthTier"])()] + _main_consts__WEBPACK_IMPORTED_MODULE_6__["termPadding"].height();
        this.indexHeight = termHeight * _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootIndexScale"];
        this.kinkHeight = (termHeight - this.padBottom) - this.indexHeight;
        this.indexTopOverflow = this.index.getHeight() * _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootIndexScale"] - this.indexHeight;
        this.indexTopOverflow = Math.max(this.indexTopOverflow, 0);
        this.emptySpaceAboveIndex = this.argument.getHeight() - this.kinkHeight - this.indexHeight;
        this.emptySpaceAboveIndex = Math.max(this.emptySpaceAboveIndex, 0);
        /*
              /\        /-----------
             /  \      /
            /y|z \    /   arg
                  \  /
        __________x\/w______________
        Calculate x such that x = w if
        the height of the argument is one
        terms height.
        */
        // tan x = termHeight / argMargin
        // x = atan(termHeight / argMargin)
        var x = Math.atan(termHeight / _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootArgMarginLeft"]);
        // tan x = h / w
        // w = h / tan x
        var mainKinkWidth = this.kinkHeight / Math.tan(x);
        var z = Math.PI - x - Math.PI / 2;
        // y + z = rootKinkTipAngle
        // y = rootKinkTipAngle - z
        var y = _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootKinkTipAngle"] - z;
        // sin y = w / tipLen
        // w = tipLen * sin y
        this.kinkTipWidth = _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootKinkTipLength"] * Math.sin(y);
        this.kinkWidth = mainKinkWidth + this.kinkTipWidth;
        // cos y = h / tipLen
        // h = tipLen * cos y
        this.kinkTipHeight = _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootKinkTipLength"] * Math.cos(y);
        this.yToKinkStart = this.indexTopOverflow + this.emptySpaceAboveIndex + this.indexHeight + this.kinkTipHeight - this.padBottom;
        // tan x = kinkHeight / xFromRightOfKink
        // xFromRightOfKink = kinkHeight / tan x
        var xFromRightOfKinkForIdx = this.kinkHeight / Math.tan(x);
        var widthForIdx = this.kinkWidth + xFromRightOfKinkForIdx;
        var realIdxWidth = this.index.getWidth() * _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootIndexScale"];
        this.indexLeftOverflow = realIdxWidth - widthForIdx;
    };
    RootContainer.prototype.recalcDimensions = function () {
        this.radical.recalcDimensions();
        this.argument.recalcDimensions();
        this.index.recalcDimensions();
        this.calcMetrics();
        _super.prototype.recalcDimensions.call(this);
    };
    RootContainer.prototype.getMainTextLine = function () {
        var argLine = this.argument.getMainTextLine();
        var toAdd = this.indexTopOverflow + this.padding.top;
        argLine[0] += toAdd;
        argLine[1] += toAdd;
        return argLine;
    };
    RootContainer.prototype.calcWidth = function () {
        var realIdxLeftPortrusion = Math.max(this.indexLeftOverflow, 0);
        return realIdxLeftPortrusion + this.kinkWidth + _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootArgMarginLeft"] + this.argument.getWidth() + this.padding.width();
    };
    RootContainer.prototype.calcHeight = function () {
        return this.indexTopOverflow + this.argument.getHeight() + this.padding.height();
    };
    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     *
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     */
    RootContainer.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var adjustedPad = this.padding.scale(currScale);
        // Points for the radical: Relative to this container
        var realLeftOverflow = Math.max(this.indexLeftOverflow, 0);
        var kinkTipX = realLeftOverflow;
        var kinkTipY = this.yToKinkStart;
        var kinkTopX = kinkTipX + this.kinkTipWidth;
        var kinkTopY = kinkTipY - this.kinkTipHeight;
        var tickBotX = realLeftOverflow + this.kinkWidth;
        var tickBotY = kinkTopY + this.kinkHeight;
        var tickTopX = tickBotX + _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootArgMarginLeft"];
        var tickTopY = tickBotY - this.argument.getHeight() + 1 + this.padBottom;
        var endX = tickTopX + this.argument.getWidth();
        var endY = tickTopY;
        var thisWidth = this.getWidth() * currScale;
        var thisHeight = this.getHeight() * currScale;
        // The layout for this container
        var thisLayout = new _animation_RootContainerLayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](parentLayout, this, tlx, tly, thisWidth, thisHeight, currScale, kinkTipX, kinkTipY, kinkTopX, kinkTopY, tickBotX, tickBotY, tickTopX, tickTopY, endX, endY);
        // Calculate layout for the index
        var indexTlx;
        if (this.indexLeftOverflow < 0) {
            // Doesn't overflow, needs to be centered
            indexTlx = tlx - (this.indexLeftOverflow / 2) * currScale;
        }
        else {
            // Overflows or fits exactly
            indexTlx = tlx;
        }
        indexTlx += adjustedPad.left - 1 * currScale;
        var indexTly = tly + (this.emptySpaceAboveIndex - 1 - this.padBottom) * currScale + adjustedPad.top;
        this.index.addLayout(thisLayout, layouts, indexTlx, indexTly, currScale * _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootIndexScale"], opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
        // Calculate layout for the argument
        var argTlx = tlx + (realLeftOverflow + this.kinkWidth + _main_consts__WEBPACK_IMPORTED_MODULE_6__["rootArgMarginLeft"]) * currScale + adjustedPad.left;
        var argTly = tly + this.indexTopOverflow * currScale + adjustedPad.top;
        this.argument.addLayout(thisLayout, layouts, argTlx, argTly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
        if (this.radical) {
            this.radical.addLayout(thisLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj);
        }
        layouts.set(this, thisLayout);
        return thisLayout;
    };
    var RootContainer_1;
    RootContainer = RootContainer_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__["Container"])({
            typeString: 'root',
            parse: function (containerObj, depth, contentGetter, containerGetter, genInfo) {
                // Return container from file
                var format = containerObj;
                var idx = new _HBox__WEBPACK_IMPORTED_MODULE_3__["default"](Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.idx, depth + 1, containerGetter, contentGetter), _Padding__WEBPACK_IMPORTED_MODULE_2__["default"].even(0));
                var arg = new _HBox__WEBPACK_IMPORTED_MODULE_3__["default"](Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.arg, depth + 1, containerGetter, contentGetter), _Padding__WEBPACK_IMPORTED_MODULE_2__["default"].even(0));
                var radical;
                if (format.rad) {
                    radical = contentGetter(format.rad);
                }
                return new RootContainer_1(idx, arg, radical, _main_consts__WEBPACK_IMPORTED_MODULE_6__["defaultRootPadding"], genInfo['termHeights']);
            }
        }),
        __metadata("design:paramtypes", [_HBox__WEBPACK_IMPORTED_MODULE_3__["default"], _HBox__WEBPACK_IMPORTED_MODULE_3__["default"], _Radical__WEBPACK_IMPORTED_MODULE_4__["default"], _Padding__WEBPACK_IMPORTED_MODULE_2__["default"], Array])
    ], RootContainer);
    return RootContainer;
}(_EqContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RootContainer);


/***/ }),

/***/ "../src/layout/SubSuper.ts":
/*!*********************************!*\
  !*** ../src/layout/SubSuper.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _HBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HBox */ "../src/layout/HBox.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _TightHBox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TightHBox */ "../src/layout/TightHBox.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Lays out components in a way that
 * enables exponents (top) and subscripts
 * (bottom).
 */
var SubSuper = /** @class */ (function (_super) {
    __extends(SubSuper, _super);
    function SubSuper(top, middle, bottom, portrusion, padding) {
        var _this = _super.call(this, padding) || this;
        _this.portrusionProportion = portrusion;
        _this.top = top;
        _this.middle = middle;
        _this.bottom = bottom;
        _this.recalcPortrusion();
        _this.height = _this.calcHeight();
        _this.width = _this.calcWidth();
        return _this;
    }
    SubSuper_1 = SubSuper;
    SubSuper.prototype.recalcPortrusion = function () {
        this.topPortrusion = this.top.getHeight() * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"] * this.portrusionProportion;
        this.bottomPortrusion = this.bottom.getHeight() * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"] * this.portrusionProportion;
    };
    SubSuper.prototype.recalcDimensions = function () {
        this.top.recalcDimensions();
        this.middle.recalcDimensions();
        this.bottom.recalcDimensions();
        this.recalcPortrusion();
        _super.prototype.recalcDimensions.call(this);
    };
    SubSuper.prototype.getMainTextLine = function () {
        var middleLine = this.middle.getMainTextLine();
        if (!middleLine) {
            return undefined;
        }
        // Add the y position of the middle inside this container
        var toAdd = this.topPortrusion + this.padding.top;
        middleLine[0] += toAdd;
        middleLine[1] += toAdd;
        return middleLine;
    };
    SubSuper.prototype.calcWidth = function () {
        //Width of the right portion, ie the top and bottom
        var rightWidth = Math.max(this.top.getWidth() * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"], this.bottom.getWidth() * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"]);
        return this.middle.getWidth() + rightWidth + this.padding.width();
    };
    SubSuper.prototype.calcHeight = function () {
        return this.middle.getHeight()
            + this.topPortrusion
            + this.bottomPortrusion
            + this.padding.height();
    };
    SubSuper.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var layout = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_4__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        //Add the middle
        var middleLayout = this.middle.addLayout(layout, layouts, tlx + this.padding.left * currScale, tly + (this.topPortrusion + this.padding.top) * currScale, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
        var rightX = middleLayout.tlx + middleLayout.width;
        //Add the top
        this.top.addLayout(layout, layouts, rightX, tly + this.padding.top * currScale, currScale * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"], opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
        //Add the bottom
        this.bottom.addLayout(layout, layouts, rightX, tly + layout.height - (this.padding.bottom + this.bottom.getHeight() * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"]) * currScale, currScale * _main_consts__WEBPACK_IMPORTED_MODULE_3__["expScale"], opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
        //Add own
        layouts.set(this, layout);
        return layout;
    };
    var SubSuper_1;
    SubSuper = SubSuper_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_6__["Container"])({
            typeString: 'subSuper',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                // Return subSuper from file
                var format = containerObj;
                var top = new _HBox__WEBPACK_IMPORTED_MODULE_1__["default"](Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.top, depth + 1, containerGetter, contentGetter), _Padding__WEBPACK_IMPORTED_MODULE_2__["default"].even(0));
                var middle = new _TightHBox__WEBPACK_IMPORTED_MODULE_7__["default"](Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.middle, depth + 1, containerGetter, contentGetter), _Padding__WEBPACK_IMPORTED_MODULE_2__["default"].even(0));
                var bottom = new _HBox__WEBPACK_IMPORTED_MODULE_1__["default"](Object(_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.bottom, depth + 1, containerGetter, contentGetter), _Padding__WEBPACK_IMPORTED_MODULE_2__["default"].even(0));
                var portrusion = format.portrusion ? format.portrusion : _main_consts__WEBPACK_IMPORTED_MODULE_3__["defaultExpPortrusion"];
                return new SubSuper_1(top, middle, bottom, portrusion, _main_consts__WEBPACK_IMPORTED_MODULE_3__["defaultSubSuperPadding"]);
            }
        }),
        __metadata("design:paramtypes", [_HBox__WEBPACK_IMPORTED_MODULE_1__["default"], _HBox__WEBPACK_IMPORTED_MODULE_1__["default"], _HBox__WEBPACK_IMPORTED_MODULE_1__["default"], Number, _Padding__WEBPACK_IMPORTED_MODULE_2__["default"]])
    ], SubSuper);
    return SubSuper;
}(_EqContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (SubSuper);


/***/ }),

/***/ "../src/layout/TableContainer.ts":
/*!***************************************!*\
  !*** ../src/layout/TableContainer.ts ***!
  \***************************************/
/*! exports provided: parseChildrenObj, parseChildren2D, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseChildrenObj", function() { return parseChildrenObj; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseChildren2D", function() { return parseChildren2D; });
/* harmony import */ var _EqContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Functions for loading from the file.
 */
/**
 * Parse an object containing references with indices
 * as keys.
 * @param obj The object to parse.
*/
function parseChildrenObj(obj, contentGetter) {
    var toReturn = {};
    if (!obj) {
        return toReturn;
    }
    Object.keys(obj).forEach(function (index) {
        var ref = obj[index];
        toReturn[index] = contentGetter(ref);
    });
    return toReturn;
}
/**
 * Parse a 2D array of components.
 * @param fromFile The array from the file.
 */
function parseChildren2D(fromFile, containerGetter, contentGetter) {
    var toReturn = [];
    fromFile.forEach(function (row) {
        toReturn.push(Object(_main_helpers__WEBPACK_IMPORTED_MODULE_3__["parseContainerChildren"])(row, 1, containerGetter, contentGetter));
    });
    return toReturn;
}
/**
 * Lays out components in a table.
 */
var TableContainer = /** @class */ (function (_super) {
    __extends(TableContainer, _super);
    function TableContainer(padding, children, hLines, vLines, lineStroke, cellPad) {
        var _this = _super.call(this, padding) || this;
        // The width of each column
        _this.widths = [];
        // The height of each row
        _this.heights = [];
        _this.cellPad = cellPad;
        _this.lineStroke = lineStroke;
        _this.children = children;
        _this.width = _this.calcWidth();
        _this.height = _this.calcHeight();
        _this.hLines = hLines;
        _this.vLines = vLines;
        return _this;
    }
    TableContainer_1 = TableContainer;
    /**
     * Return the amount of space to leave for lines
     * (both horizontal and vertical).
     */
    TableContainer.prototype.getLineStroke = function () {
        return this.lineStroke;
    };
    /**
     * Return the mimimum dimension in either axis
     * for a table cell.
     */
    TableContainer.prototype.getMinCellDimen = function () {
        return _main_consts__WEBPACK_IMPORTED_MODULE_4__["tableMinCellDimen"];
    };
    TableContainer.prototype.recalcDimensions = function () {
        this.children.forEach(function (row) {
            row.forEach(function (child) {
                if (child) {
                    child.recalcDimensions();
                }
            });
        });
        _super.prototype.recalcDimensions.call(this);
    };
    TableContainer.prototype.calcWidth = function () {
        var totalWidth = 0;
        // Width of each column is the max width of any component in that row
        for (var c = 0; c < this.children[0].length; c++) {
            var maxWidth = this.getMinCellDimen();
            for (var r = 0; r < this.children.length; r++) {
                var currChild = this.children[r][c];
                var currWidth = this.cellPad.width();
                if (currChild) {
                    currWidth += currChild.getWidth();
                }
                if (currWidth > maxWidth) {
                    maxWidth = currWidth;
                }
            }
            totalWidth += maxWidth;
            // Store col width for later
            this.widths[c] = maxWidth;
        }
        // Also need to take width of lines into account,
        // and padding.
        return totalWidth + this.padding.width() + (this.children[0].length + 1) * this.getLineStroke();
    };
    TableContainer.prototype.calcHeight = function () {
        var totalHeight = 0;
        // Height of each row is the max height of any component in that row
        for (var r = 0; r < this.children.length; r++) {
            var maxHeight = this.getMinCellDimen();
            for (var c = 0; c < this.children[r].length; c++) {
                var currChild = this.children[r][c];
                var currHeight = this.cellPad.height();
                if (currChild) {
                    currHeight += currChild.getHeight();
                }
                if (currHeight > maxHeight) {
                    maxHeight = currHeight;
                }
            }
            totalHeight += maxHeight;
            // Store height of this row for later
            this.heights[r] = maxHeight;
        }
        // Also need to take height of lines into account,
        // and padding.
        return totalHeight + this.padding.height() + (this.children.length + 1) * this.getLineStroke();
    };
    /**
     * Add the Layout State for this component, and any other
     * related components such as children of a container.
     *
     * @param parentLayout The frame of the container containing this component.
     * @param layouts The map of layouts to add to.
     * @param tlx The left x of this component.
     * @param tly The top y of this component.
     * @param currScale The current canvas scaling factor.
     * @param opacityObj The object storing opacity info for this step.
     * @param colorsObj The object storing color info for this step.
     * @param mouseEnter Mouse enter events for this step.
     * @param mouseExit Mouse exit events for this step.
     * @param mouseClick Mouse click events for this step.
     * @param tempContent Temporary content added only for this step.
     */
    TableContainer.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var thisState = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](parentLayout, this, tlx, tly, this.width, this.height, currScale);
        // Add child layouts row by row
        var upToY = tly + this.padding.top + this.getLineStroke();
        for (var r = 0; r < this.children.length; r++) {
            // Do the row
            var upToX = tlx + this.padding.left + this.getLineStroke();
            var rowHeight = this.heights[r];
            // Add hline before row if there is one
            if (this.hLines[r]) {
                this.hLines[r].addLayout(thisState, layouts, undefined, upToY - this.getLineStroke(), currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
            }
            for (var c = 0; c < this.children[r].length; c++) {
                // Do each column
                var colWidth = this.widths[c];
                // Add vline before column if there is one
                if (this.vLines[c]) {
                    this.vLines[c].addLayout(thisState, layouts, upToX - this.getLineStroke(), undefined, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
                }
                var currChild = this.children[r][c];
                if (currChild) {
                    // Add child layout, centering in both directions
                    var childWidth = currChild.getWidth();
                    var childHeight = currChild.getHeight();
                    var childX = upToX + (colWidth - childWidth) / 2;
                    var childY = upToY + (rowHeight - childHeight) / 2;
                    currChild.addLayout(thisState, layouts, childX, childY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
                }
                upToX += colWidth + this.getLineStroke();
                // Add vline after last column if there is one
                if (c === this.children[r].length - 1 && this.vLines[c + 1]) {
                    this.vLines[c + 1].addLayout(thisState, layouts, upToX - this.getLineStroke(), undefined, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
                }
            }
            upToY += rowHeight + this.getLineStroke();
            // Add hline after the last row if there is one
            if (r === this.children.length - 1 && this.hLines[r + 1]) {
                this.hLines[r + 1].addLayout(thisState, layouts, tlx + this.padding.left, upToY - this.getLineStroke(), currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
            }
        }
        layouts.set(this, thisState);
        return thisState;
    };
    var TableContainer_1;
    TableContainer = TableContainer_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__["Container"])({
            typeString: 'table',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                var format = containerObj;
                var children = parseChildren2D(format.children, containerGetter, contentGetter);
                return new TableContainer_1(_main_consts__WEBPACK_IMPORTED_MODULE_4__["defaultTablePadding"], children, parseChildrenObj(format.hLines, contentGetter), parseChildrenObj(format.vLines, contentGetter), 1, _main_consts__WEBPACK_IMPORTED_MODULE_4__["tableCellPadding"]);
            }
        }),
        __metadata("design:paramtypes", [_Padding__WEBPACK_IMPORTED_MODULE_2__["default"], Array, Object, Object, Number, _Padding__WEBPACK_IMPORTED_MODULE_2__["default"]])
    ], TableContainer);
    return TableContainer;
}(_EqContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (TableContainer);


/***/ }),

/***/ "../src/layout/Term.ts":
/*!*****************************!*\
  !*** ../src/layout/Term.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _animation_TermLayoutState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animation/TermLayoutState */ "../src/animation/TermLayoutState.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var Term = /** @class */ (function (_super) {
    __extends(Term, _super);
    function Term(text, widths, heights, ascents, ref) {
        var _this = _super.call(this, _main_consts__WEBPACK_IMPORTED_MODULE_0__["termPadding"], ref) || this;
        _this.widths = widths;
        _this.heights = heights;
        _this.halfInnerWidths = _this.widths.map(function (width) { return width / 2; });
        _this.halfInnerHeights = _this.heights.map(function (height) { return height / 2; });
        _this.ascents = ascents;
        _this.recalcDimensions();
        _this.text = text;
        return _this;
    }
    Term_1 = Term;
    Term.prototype.recalcDimensions = function () {
        _super.prototype.recalcDimensions.call(this);
        var tier = window['currentWidthTier'];
        this.halfInnerWidth = this.halfInnerWidths[tier];
        this.halfInnerHeight = this.halfInnerHeights[tier];
        this.ascent = this.ascents[tier];
    };
    Term.prototype.getMainTextLine = function () {
        return [this.padding.top, this.height - this.padding.bottom];
    };
    Term.prototype.calcHeight = function () {
        var tier = window['currentWidthTier'];
        return this.heights[tier] + this.padding.height();
    };
    Term.prototype.calcWidth = function () {
        var tier = window['currentWidthTier'];
        return this.widths[tier] + this.padding.width();
    };
    Term.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        var state = new _animation_TermLayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](parentLayout, this, tlx, tly, this.width * currScale, this.height * currScale, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj));
        layouts.set(this, state);
        return state;
    };
    Term.prototype.draw = function (before, after, progress, ctx) {
        this.setupCtx(before, after, progress, ctx);
        ctx.fillText(this.text, -this.halfInnerWidth, -this.halfInnerHeight + this.ascent);
    };
    var Term_1;
    Term = Term_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_3__["Content"])({
            character: 't',
            initialize: function (file, info) {
                var terms = [];
                var ascents = [];
                if (file.terms.length > 0) {
                    //Get the ascents from each tier
                    for (var w = 0; w < _main_consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length; w++) {
                        ascents.push(file.metrics[w].ascent);
                    }
                }
                //Initialize all terms
                for (var t = 0; t < file.terms.length; t++) {
                    var widths = [];
                    //Get the widths for each tier
                    for (var w = 0; w < _main_consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length; w++) {
                        widths.push(file.metrics[w].widths[t]);
                    }
                    var text = file.terms[t];
                    var term = new Term_1(text, widths, info['termHeights'], ascents, 't' + t);
                    terms.push(term);
                }
                return terms;
            },
            calcInfo: function (file, info) {
                var termHeights = [];
                if (file.terms.length > 0) {
                    //Get the term heights from each tier
                    for (var w = 0; w < _main_consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length; w++) {
                        termHeights.push(file.metrics[w].height);
                    }
                }
                info['termHeights'] = termHeights;
            }
        }),
        __metadata("design:paramtypes", [String, Array, Array, Array, String])
    ], Term);
    return Term;
}(_EqContent__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (Term);


/***/ }),

/***/ "../src/layout/TightHBox.ts":
/*!**********************************!*\
  !*** ../src/layout/TightHBox.ts ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HBox */ "../src/layout/HBox.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
/* harmony import */ var _Term__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Term */ "../src/layout/Term.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var widthDiff = _main_consts__WEBPACK_IMPORTED_MODULE_1__["termPadding"].width() - _main_consts__WEBPACK_IMPORTED_MODULE_1__["tightTermPadding"].width();
var TightHBox = /** @class */ (function (_super) {
    __extends(TightHBox, _super);
    function TightHBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TightHBox_1 = TightHBox;
    //Override to account for reduced width of tight terms.
    TightHBox.prototype.calcWidth = function () {
        var totalWidth = 0;
        var numTerms = 0;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            totalWidth += currChild.getWidth();
            if (currChild instanceof _Term__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                numTerms++;
            }
        }
        return totalWidth + this.padding.width() - numTerms * widthDiff;
    };
    //Override to reduce term padding.
    TightHBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_3__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var upToX = tlx + this.padding.left * currScale;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            var childHeight = currChild.getHeight() * currScale;
            //Position child in the middle vertically
            var childTLY = this.middleMainLineDist * currScale - childHeight / 2 + tly;
            var childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale, opacityObj, colorObj, mouseEnter, mouseExit, mouseClick, tempContent);
            if (currChild instanceof _Term__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                childLayout.tighten(widthDiff * currScale);
            }
            upToX += childLayout.width;
        }
        layouts.set(this, state);
        return state;
    };
    var TightHBox_1;
    TightHBox = TightHBox_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__["Container"])({
            typeString: 'tightHBox',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                // Return HBox from file
                var format = containerObj;
                var children = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_4__["parseContainerChildren"])(format.children, depth + 1, containerGetter, contentGetter);
                return new TightHBox_1(children, _Padding__WEBPACK_IMPORTED_MODULE_6__["default"].even(_main_consts__WEBPACK_IMPORTED_MODULE_1__["defaultHBoxPadding"]));
            }
        })
    ], TightHBox);
    return TightHBox;
}(_HBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (TightHBox);


/***/ }),

/***/ "../src/layout/VBox.ts":
/*!*****************************!*\
  !*** ../src/layout/VBox.ts ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _LinearContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LinearContainer */ "../src/layout/LinearContainer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var VBox = /** @class */ (function (_super) {
    __extends(VBox, _super);
    function VBox(children, padding) {
        var _this = _super.call(this, children, padding) || this;
        _this.width = _this.calcWidth();
        _this.height = _this.calcHeight();
        return _this;
    }
    VBox.prototype.calcHeight = function () {
        var totalHeight = 0;
        for (var i = 0; i < this.children.length; i++) {
            totalHeight += this.children[i].getHeight();
        }
        return totalHeight + this.padding.height();
    };
    VBox.prototype.calcWidth = function () {
        var maxWidth = 0;
        for (var i = 0; i < this.children.length; i++) {
            var childWidth = this.children[i].getWidth();
            if (childWidth > maxWidth) {
                maxWidth = childWidth;
            }
        }
        return maxWidth + this.padding.width();
    };
    VBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_0__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        var upToY = tly + this.padding.top * currScale;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            var childWidth = currChild.getWidth() * currScale;
            //Position child in the middle horizontally
            var childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent).height;
        }
        layouts.set(this, state);
        return state;
    };
    return VBox;
}(_LinearContainer__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (VBox);


/***/ }),

/***/ "../src/layout/VCenterVBox.ts":
/*!************************************!*\
  !*** ../src/layout/VCenterVBox.ts ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _VBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VBox */ "../src/layout/VBox.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * VBox used at the root of the layout hierarchy.
 * Vertically centers the children
 * as well as horizontally centering.
 * Decorator defined here to avoid circular
 * dependency between this and VBox.
 */
var VCenterVBox = /** @class */ (function (_super) {
    __extends(VCenterVBox, _super);
    function VCenterVBox(children, padding) {
        var _this = _super.call(this, children, padding) || this;
        _this.calcChildHeight();
        return _this;
    }
    VCenterVBox_1 = VCenterVBox;
    VCenterVBox.prototype.calcChildHeight = function () {
        var _this = this;
        // Calculate total child height
        this.totalChildHeight = 0;
        this.children.forEach(function (child) {
            _this.totalChildHeight += child.getHeight();
        });
    };
    VCenterVBox.prototype.recalcDimensions = function () {
        _super.prototype.recalcDimensions.call(this);
        this.calcChildHeight();
    };
    VCenterVBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        var upToY = tly + (this.getHeight() - this.totalChildHeight) / 2;
        for (var i = 0; i < this.children.length; i++) {
            var currChild = this.children[i];
            var childWidth = currChild.getWidth() * currScale;
            //Position child in the middle horizontally
            var childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            upToY += currChild.addLayout(state, layouts, childTLX, upToY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent).height;
        }
        layouts.set(this, state);
        return state;
    };
    var VCenterVBox_1;
    VCenterVBox = VCenterVBox_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__["Container"])({
            typeString: 'vbox',
            parse: function (containerObj, depth, contentGetter, containerGetter, inf) {
                // Return VBox from file
                var format = containerObj;
                var children = Object(_main_helpers__WEBPACK_IMPORTED_MODULE_3__["parseContainerChildren"])(format.children, depth + 1, containerGetter, contentGetter);
                // Allocate extra padding if at root of layout
                var padding = depth === 0 ? _main_consts__WEBPACK_IMPORTED_MODULE_5__["defaultRootVBoxPadding"] : _Padding__WEBPACK_IMPORTED_MODULE_1__["default"].even(_main_consts__WEBPACK_IMPORTED_MODULE_5__["defaultVBoxPadding"]);
                // Center vertically if at root of layout
                if (inf['fixedHeights'] && depth === 0) {
                    return new VCenterVBox_1(children, padding);
                }
                else {
                    return new _VBox__WEBPACK_IMPORTED_MODULE_0__["default"](children, padding);
                }
            }
        }),
        __metadata("design:paramtypes", [Array, _Padding__WEBPACK_IMPORTED_MODULE_1__["default"]])
    ], VCenterVBox);
    return VCenterVBox;
}(_VBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (VCenterVBox);


/***/ }),

/***/ "../src/layout/VDivider.ts":
/*!*********************************!*\
  !*** ../src/layout/VDivider.ts ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EqContent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _main_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _Padding__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Padding */ "../src/layout/Padding.ts");
/* harmony import */ var _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/OriginalDimenLayoutState */ "../src/animation/OriginalDimenLayoutState.ts");
/* harmony import */ var _main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../main/consts */ "../src/main/consts.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var VDivider = /** @class */ (function (_super) {
    __extends(VDivider, _super);
    function VDivider(padding, ref) {
        var _this = _super.call(this, padding, ref) || this;
        _this.width = _this.calcWidth();
        //For layout purposes, the divider
        //has no height. It stretches to fill
        //its container.
        _this.height = _this.calcHeight();
        return _this;
    }
    VDivider_1 = VDivider;
    VDivider.prototype.setPadding = function (newPadding) {
        this.padding = newPadding;
    };
    VDivider.prototype.calcWidth = function () { return 1 + this.padding.width(); };
    VDivider.prototype.calcHeight = function () { return 0; };
    VDivider.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj) {
        //Set y to align top with parent
        var y = parentLayout.tly;
        var height = parentLayout.height;
        var width = this.getWidth();
        var state = new _animation_OriginalDimenLayoutState__WEBPACK_IMPORTED_MODULE_3__["OriginalDimenLayoutState"](parentLayout, this, tlx, y, width, height, currScale, this.getColorForContent(colorsObj), this.getOpacityForContent(opacityObj), width, height / currScale);
        layouts.set(this, state);
        return state;
    };
    VDivider.prototype.draw = function (before, after, progress, ctx) {
        this.setupCtx(before, after, progress, ctx);
        var height = before.origInnerHeight * (1 - progress) + after.origInnerHeight * progress;
        Object(_main_helpers__WEBPACK_IMPORTED_MODULE_1__["line"])(0, -height / 2 + this.padding.top, 0, height / 2 - this.padding.bottom, ctx);
    };
    var VDivider_1;
    VDivider = VDivider_1 = __decorate([
        Object(_main_ComponentModel__WEBPACK_IMPORTED_MODULE_4__["Content"])({
            character: 'v',
            initialize: function (file) {
                var vDividers = [];
                for (var i = 0; i < file.vDividers; i++) {
                    vDividers.push(new VDivider_1(_main_consts__WEBPACK_IMPORTED_MODULE_5__["vDividerPadding"], 'v' + i));
                }
                return vDividers;
            }
        }),
        __metadata("design:paramtypes", [_Padding__WEBPACK_IMPORTED_MODULE_2__["default"], String])
    ], VDivider);
    return VDivider;
}(_EqContent__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (VDivider);


/***/ }),

/***/ "../src/main/CanvasController.ts":
/*!***************************************!*\
  !*** ../src/main/CanvasController.ts ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../animation/AnimationSet */ "../src/animation/AnimationSet.ts");
/* harmony import */ var _animation_MoveAnimation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animation/MoveAnimation */ "../src/animation/MoveAnimation.ts");
/* harmony import */ var _animation_RemoveAnimation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../animation/RemoveAnimation */ "../src/animation/RemoveAnimation.ts");
/* harmony import */ var _animation_AddAnimation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animation/AddAnimation */ "../src/animation/AddAnimation.ts");
/* harmony import */ var _animation_EvalAnimation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../animation/EvalAnimation */ "../src/animation/EvalAnimation.ts");
/* harmony import */ var _animation_ReverseEvalAnimation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../animation/ReverseEvalAnimation */ "../src/animation/ReverseEvalAnimation.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./consts */ "../src/main/consts.ts");
/* harmony import */ var _layout_EqContent__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _animation_ProgressAnimation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../animation/ProgressAnimation */ "../src/animation/ProgressAnimation.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers */ "../src/main/helpers.ts");
/* harmony import */ var _ProgressIndicator__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ProgressIndicator */ "../src/main/ProgressIndicator.ts");
/* harmony import */ var _animation_BezierCallback__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../animation/BezierCallback */ "../src/animation/BezierCallback.ts");
/* harmony import */ var _ComponentModel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();













/**
 * Responsible for managing a single canvas,
 * playing through the set of instructions
 * and animating.
 */
var CanvasController = /** @class */ (function () {
    /**
     * Create a new Canvas Controller,
     * setting up equation playback in the
     * given container.
     * @param container The container.
     * @param instructions The instructions.
     */
    function CanvasController(container, instructions, colors) {
        var _a;
        var _this = this;
        this.currStep = 0;
        this.mouseOnLast = [];
        this.lastHeight = 0;
        this.lastWidth = 0;
        this.container = container;
        this.steps = instructions.steps;
        this.stepOptions = instructions.stepOpts;
        this.setSize = this.setSize.bind(this);
        this.startAutoplay = this.startAutoplay.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.isAutoplay = instructions.autoplay;
        this.customColors = colors;
        // Create canvas
        var canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.container.appendChild(canvasContainer);
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        canvasContainer.appendChild(this.canvas);
        // Set background color
        this.backgroundFill = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["rgbaArrayToCssString"])(colors && colors.canvasBackground ? colors.canvasBackground : _consts__WEBPACK_IMPORTED_MODULE_6__["backgroundColor"]);
        // Check if any steps have text
        var hasText = false;
        for (var i = 0; i < this.steps.length; i++) {
            if (this.steps[i].text) {
                hasText = true;
                break;
            }
        }
        // Whether navigational buttons are necessary
        var needButtons = this.steps.length > 1 && !this.isAutoplay;
        // Create area below canvas, if needed
        if (needButtons || hasText) {
            var lowerArea = document.createElement("div");
            lowerArea.className = "eqUpper";
            this.container.appendChild(lowerArea);
            //Create back button, if needed
            if (needButtons) {
                var backButton = document.createElement("div");
                backButton.className = "material-icons eqIcon";
                backButton.innerHTML = "keyboard_arrow_left";
                backButton.setAttribute("role", "button");
                lowerArea.appendChild(backButton);
                this.prevStep = this.prevStep.bind(this);
                backButton.addEventListener("click", this.prevStep);
                // Highlight button on mouse over
                backButton.addEventListener("mouseenter", this.highlightButton.bind(this, backButton));
                backButton.addEventListener("mouseleave", this.unhighlightButton.bind(this, backButton));
            }
            // Create text area, if needed
            // text doesn't show if: none of the steps define any text
            if (hasText) {
                this.textArea = document.createElement("div");
                this.textArea.className = "eqText";
                lowerArea.appendChild(this.textArea);
            }
            //Create restart button and progress indicator
            if (needButtons) {
                this.restartOrNextButton = document.createElement("div");
                this.restartOrNextButton.className = "material-icons eqIcon";
                this.restartOrNextButton.innerHTML = "keyboard_arrow_right";
                this.restartOrNextButton.setAttribute("role", "button");
                lowerArea.appendChild(this.restartOrNextButton);
                this.restart = this.restart.bind(this);
                this.restartOrNextButton.addEventListener("click", this.handleMouseClick);
                // Highlight next/restart in all regions where it will happen
                this.canvas.addEventListener("mouseenter", this.highlightButton.bind(this, this.restartOrNextButton));
                this.restartOrNextButton.addEventListener("mouseenter", this.highlightButton.bind(this, this.restartOrNextButton));
                this.canvas.addEventListener("mouseleave", this.unhighlightButton.bind(this, this.restartOrNextButton));
                this.restartOrNextButton.addEventListener("mouseleave", this.unhighlightButton.bind(this, this.restartOrNextButton));
            }
        }
        // Initialize progress indicator, if not autoplaying
        if (!this.isAutoplay) {
            this.progress = new _ProgressIndicator__WEBPACK_IMPORTED_MODULE_10__["default"](this.canvas);
        }
        //Check whether to fix the height of the canvas
        if (container.hasAttribute('data-fix-height')) {
            this.fixedHeights = instructions.maxHeights;
        }
        //Initialize the font
        _a = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["getFont"])(instructions), this.fontFamily = _a[0], this.fontStyle = _a[1], this.fontWeight = _a[2];
        //Initialize Components and display first step
        this.initComponents(instructions);
        this.updateFontSize();
        this.recalc(true);
        // Bind next step to canvas/text click if not autoplaying
        if (!this.isAutoplay) {
            this.canvas.addEventListener("click", this.handleMouseClick);
            if (this.textArea) {
                this.textArea.addEventListener('click', this.handleMouseClick);
            }
        }
        //Redraw when window size changes
        this.recalc = this.recalc.bind(this);
        window.addEventListener('resize', function () {
            _this.updateFontSize();
            _this.updateDimensions();
            _this.recalc(false);
        });
        // Add overlay for play if autoplaying
        if (this.isAutoplay) {
            this.overlayContainer = document.createElement("div");
            this.overlayContainer.className = "overlayContainer";
            this.overlayContainer.addEventListener("click", this.startAutoplay);
            var playButton = document.createElement("span");
            playButton.className = "material-icons playButton";
            playButton.innerHTML = "play_arrow";
            this.overlayContainer.appendChild(playButton);
            container.appendChild(this.overlayContainer);
        }
        // Check for mouse events
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
    }
    /**
     * Initialize the components/content and
     * add general information.
     */
    CanvasController.prototype.initComponents = function (instructions) {
        this.components = new _ComponentModel__WEBPACK_IMPORTED_MODULE_12__["ComponentModel"](instructions);
        this.components.setGenInfo('customColors', this.customColors);
        this.components.setGenInfo('fixedHeights', this.fixedHeights);
    };
    /**
     * Emphasize a button.
     * @param button The element of the button.
     */
    CanvasController.prototype.highlightButton = function (button) {
        var set = new _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__["default"](function () { }, this.ctx, 0, 0, this.backgroundFill);
        var anim = new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.call(this, _consts__WEBPACK_IMPORTED_MODULE_6__["buttonHighlightDuration"], _consts__WEBPACK_IMPORTED_MODULE_6__["buttonHighlightEasing"], set) || this;
            }
            class_1.prototype.step = function (completion) {
                var opacity = 0.4 * (1 - completion) + _consts__WEBPACK_IMPORTED_MODULE_6__["buttonHighlightedOpacity"] * completion;
                button.style.opacity = "" + opacity;
            };
            return class_1;
        }(_animation_BezierCallback__WEBPACK_IMPORTED_MODULE_11__["default"]));
        set.addAnimation(anim);
        set.start();
    };
    /**
     * De-emphasize a button
     * @param button The element of the button.
     */
    CanvasController.prototype.unhighlightButton = function (button) {
        var set = new _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__["default"](function () { }, this.ctx, 0, 0, this.backgroundFill);
        var anim = new /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super.call(this, _consts__WEBPACK_IMPORTED_MODULE_6__["buttonUnhighlightDuration"], _consts__WEBPACK_IMPORTED_MODULE_6__["buttonUnhighlightEasing"], set) || this;
            }
            class_2.prototype.step = function (completion) {
                var opacity = _consts__WEBPACK_IMPORTED_MODULE_6__["buttonHighlightedOpacity"] * (1 - completion) + 0.4 * completion;
                button.style.opacity = "" + opacity;
            };
            return class_2;
        }(_animation_BezierCallback__WEBPACK_IMPORTED_MODULE_11__["default"]));
        set.addAnimation(anim);
        set.start();
    };
    /**
     * Set what the cursor will be above the canvas.
     * @param cursor The css style property for cursor.
     */
    CanvasController.prototype.setCursor = function (cursor) {
        this.canvas.style.cursor = cursor;
    };
    /**
     * Set what will be displayed as the text.
     * @param innerHTML The inner HTML text.
     */
    CanvasController.prototype.setText = function (innerHTML) {
        if (this.textArea) {
            this.textArea.innerHTML = innerHTML;
        }
    };
    /**
     * Decide what to do when the mouse clicks.
     * @param e The mouse event.
     */
    CanvasController.prototype.handleMouseClick = function (e) {
        var _this = this;
        if (this.mouseClickEvents.size > 0) {
            // May be something to process
            // Get the relative coords
            var canvasRect = this.canvas.getBoundingClientRect();
            var relX_1 = e.clientX - canvasRect.left;
            var relY_1 = e.clientY - canvasRect.top;
            // Get the layouts that the cursor is currently on
            var currentlyOn_1 = [];
            this.mouseClickEvents.forEach(function (handler, layout) {
                if (layout.contains(relX_1, relY_1)) {
                    currentlyOn_1.push(layout);
                }
            });
            // list of all states which need to be drawn each frame
            var allStates_1 = [];
            this.currStates.forEach(function (state) { return allStates_1.push(state); });
            // The animations that will be played.
            var animSet_1 = new _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__["default"](undefined, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill, allStates_1);
            currentlyOn_1.forEach(function (layout) {
                var handler = _this.mouseClickEvents.get(layout);
                handler(layout, animSet_1, _this);
            });
            animSet_1.start();
        }
        else if (this.currStep >= this.steps.length - 1) {
            this.restart();
        }
        else {
            this.nextStep();
        }
    };
    /**
     * Fire mouse events if necessary when the mouse moves.
     */
    CanvasController.prototype.handleMouseMove = function (e) {
        var _this = this;
        if (this.mouseEnterEvents.size > 0 || this.mouseExitEvents.size > 0) {
            // May be something to process
            // Get the relative coords
            var canvasRect = this.canvas.getBoundingClientRect();
            var relX_2 = e.clientX - canvasRect.left;
            var relY_2 = e.clientY - canvasRect.top;
            // Get the layouts that the cursor is currently on
            var currentlyOn_2 = [];
            this.mouseEnterEvents.forEach(function (handler, layout) {
                if (layout.contains(relX_2, relY_2)) {
                    currentlyOn_2.push(layout);
                }
            });
            this.mouseExitEvents.forEach(function (handler, layout) {
                if (layout.contains(relX_2, relY_2)) {
                    currentlyOn_2.push(layout);
                }
            });
            // list of all states which need to be drawn each frame
            var allStates_2 = [];
            this.currStates.forEach(function (state) { return allStates_2.push(state); });
            // The animations that will be played.
            var animSet_2 = new _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__["default"](undefined, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill, allStates_2);
            // For each layout the cursor is on, check if it
            // was on beforehand. If it was not, fire enter
            // event.
            currentlyOn_2.forEach(function (layout) {
                if (_this.mouseOnLast.indexOf(layout) === -1) {
                    // Fire the enter event
                    var handler = _this.mouseEnterEvents.get(layout);
                    handler(layout, animSet_2, _this);
                }
            });
            // For each layout the cursor was on, check if it
            // is still on. If not, fire the exit event.
            this.mouseOnLast.forEach(function (oldLayout) {
                if (currentlyOn_2.indexOf(oldLayout) === -1) {
                    // Fire the exit event
                    var handler = _this.mouseExitEvents.get(oldLayout);
                    handler(oldLayout, animSet_2, _this);
                }
            });
            this.mouseOnLast = currentlyOn_2;
            animSet_2.start();
        }
    };
    /**
     * Start playing the steps one after another.
     */
    CanvasController.prototype.startAutoplay = function () {
        this.overlayContainer.style.display = "none";
        this.autoplay();
    };
    /**
     * Animate to the next step until done.
     */
    CanvasController.prototype.autoplay = function () {
        var _this = this;
        if (this.currStep >= this.steps.length - 1) {
            // At the end
            setTimeout(function () {
                _this.stopAutoplay();
                _this.currStep = 0;
                _this.recalc(true);
            }, this.getAutoplayDelay(this.steps.length - 1));
        }
        else {
            // Can go to next step
            setTimeout(function () {
                _this.nextStep(function () {
                    _this.autoplay();
                });
            }, this.getAutoplayDelay(this.currStep));
        }
    };
    /**
     * Stop autoplaying.
     */
    CanvasController.prototype.stopAutoplay = function () {
        this.overlayContainer.style.display = "block";
    };
    /**
     * Get the delay before a step while autoplaying,
     * or 0 if none exists.
     * @param stepNum
     */
    CanvasController.prototype.getAutoplayDelay = function (stepNum) {
        if (this.isAutoplay.delays) {
            if (this.isAutoplay.delays[stepNum]) {
                return this.isAutoplay.delays[stepNum];
            }
            else {
                return 0;
            }
        }
        else {
            return 0;
        }
    };
    /**
     * Updates the font size for this canvas.
     * Should be called when the window size
     * changes.
     */
    CanvasController.prototype.updateFontSize = function () {
        this.fontSize = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["getFontSizeForTier"])(window['currentWidthTier']);
    };
    /**
     * Update the dimensions of all content, and the current layout.
     */
    CanvasController.prototype.updateDimensions = function () {
        this.forAllContent(function (content) {
            content.recalcDimensions();
        });
        if (this.currRootContainer) {
            this.currRootContainer.recalcDimensions();
        }
    };
    /**
     * Redraw the current step without animating.
     * Does not recalculate layout.
     */
    CanvasController.prototype.redraw = function () {
        var _this = this;
        this.ctx.save();
        var pixelRatio = window.devicePixelRatio || 1;
        this.ctx.fillStyle = this.backgroundFill;
        this.ctx.fillRect(0, 0, this.canvas.width / pixelRatio, this.canvas.height / pixelRatio);
        this.ctx.restore();
        this.currStates.forEach(function (f) {
            _this.ctx.save();
            if (f.component instanceof _layout_EqContent__WEBPACK_IMPORTED_MODULE_7__["default"]) {
                f.component.interpColorOff();
                f.component.draw(f, f, 0, _this.ctx);
            }
            _this.ctx.restore();
        });
    };
    /**
     * Recalculates and redraws the current step.
     * @param reparse Whether to reparse the container hierarchy.
     */
    CanvasController.prototype.recalc = function (reparse) {
        var _a;
        var rootLayout;
        _a = this.calcLayout(this.currStep, reparse), this.currStates = _a[0], rootLayout = _a[1], this.mouseEnterEvents = _a[2], this.mouseExitEvents = _a[3], this.mouseClickEvents = _a[4], this.tempContent = _a[5];
        this.mouseOnLast = [];
        var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
        this.setSize(width, height);
        this.redraw();
        if (this.progress) {
            this.progress.draw(this.currStep / (this.steps.length - 1), width, height);
        }
    };
    /**
     * If possible, animate to the next step
     * in the sequence.
     * @param whenDone A function to call when the next step animation is complete.
     */
    CanvasController.prototype.nextStep = function (whenDone) {
        var _a;
        if (this.currStep + 1 >= this.steps.length || this.currAnimation) {
            //Can't go to next step
            return;
        }
        this.currStep++;
        var oldStates = this.currStates;
        var rootLayout;
        _a = this.calcLayout(this.currStep, true), this.currStates = _a[0], rootLayout = _a[1], this.mouseEnterEvents = _a[2], this.mouseExitEvents = _a[3], this.mouseClickEvents = _a[4], this.tempContent = _a[5];
        this.mouseOnLast = [];
        var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
        this.currAnimation = this.diff(oldStates, width, height, this.currStep - 1, this.currStep, whenDone instanceof Function ? whenDone : undefined);
        this.currAnimation.start();
    };
    /**
     * If possible, animate to the previous step.
     */
    CanvasController.prototype.prevStep = function () {
        var _a;
        if (this.currStep - 1 < 0) {
            //Can't go to next step
            return;
        }
        // Stop the current animation if there is one
        if (this.currAnimation) {
            this.currAnimation.stop();
            this.redraw();
        }
        this.currStep--;
        var oldStates = this.currStates;
        var rootLayout;
        _a = this.calcLayout(this.currStep, true), this.currStates = _a[0], rootLayout = _a[1], this.mouseEnterEvents = _a[2], this.mouseExitEvents = _a[3], this.mouseClickEvents = _a[4], this.tempContent = _a[5];
        this.mouseOnLast = [];
        var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
        this.currAnimation = this.diff(oldStates, width, height, this.currStep + 1, this.currStep, undefined);
        this.currAnimation.start();
    };
    /**
     * Return to the first step.
     */
    CanvasController.prototype.restart = function () {
        var _a;
        if (this.currAnimation || this.currStep === 0) {
            //Can't go to next step
            return;
        }
        var oldStep = this.currStep;
        this.currStep = 0;
        var oldStates = this.currStates;
        var rootLayout;
        _a = this.calcLayout(this.currStep, true), this.currStates = _a[0], rootLayout = _a[1], this.mouseEnterEvents = _a[2], this.mouseExitEvents = _a[3], this.mouseClickEvents = _a[4], this.tempContent = _a[5];
        this.mouseOnLast = [];
        var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
        this.currAnimation = this.diff(oldStates, width, height, oldStep, 0, undefined);
        this.currAnimation.start();
    };
    /**
     * Run a callback for all content.
     * @param forEach A function that will be passed each bit of content.
     */
    CanvasController.prototype.forAllContent = function (forEach) {
        this.components.forAllContent(forEach);
        this.tempContent.forEach(forEach);
    };
    /**
     * Calculates and returns a set of animations
     * to play between the current and old step.
     * Also changes the canvas dimensions to
     * accommodate the new layout.
     *
     * @param oldStates The Map of layouts from the previous step.
     * @param canvasWidth The width the canvas should be as of the current step.
     * @param canvasHeight The height the canvas should be as of the current step.
     * @param stepBefore The old step number.
     * @param stepAfter The current step number.
     * @param whenDone A function to call when the animation is done.
     */
    CanvasController.prototype.diff = function (oldStates, canvasWidth, canvasHeight, stepBefore, stepAfter, whenDone) {
        var _this = this;
        var updateDimenAfter = canvasHeight < this.lastHeight;
        if (!updateDimenAfter) {
            this.setSize(canvasWidth, canvasHeight);
            /*
            IE Workaround: Setting size erases canvas,
            redraw immediately to avoid flash of blank.
            */
            if (_helpers__WEBPACK_IMPORTED_MODULE_9__["isIE"]) {
                var actualCurrStates = this.currStates;
                this.currStates = oldStates;
                this.redraw();
                this.currStates = actualCurrStates;
            }
        }
        var set = new _animation_AnimationSet__WEBPACK_IMPORTED_MODULE_0__["default"](function () {
            //When done
            if (updateDimenAfter) {
                _this.setSize(canvasWidth, canvasHeight);
                _this.redraw();
            }
            // Update next/restart button
            if (_this.restartOrNextButton) {
                if (stepAfter === _this.steps.length - 1) {
                    // Going to last step, show restart button (unless only two steps, can just go back)
                    _this.restartOrNextButton.innerHTML = 'refresh';
                }
                else {
                    // Not going to last step, show next step button
                    _this.restartOrNextButton.innerHTML = 'keyboard_arrow_right';
                }
            }
            // If we weren't animating the progress bar, draw it on the final frame.
            if (_this.progress && updateDimenAfter) {
                _this.progress.draw(_this.currStep / (_this.steps.length - 1), canvasWidth, canvasHeight);
            }
            _this.currAnimation = undefined;
            if (whenDone) {
                whenDone();
            }
        }, this.ctx, this.lastWidth, this.lastHeight, this.backgroundFill);
        //Get the step options for this transition
        var stepOptions;
        var reverseStep;
        if (stepBefore < stepAfter) {
            //Going forward
            stepOptions = this.getStepOptions(stepBefore, stepAfter);
            reverseStep = false;
        }
        else {
            //Going backwards
            stepOptions = this.getStepOptions(stepAfter, stepBefore);
            reverseStep = true;
        }
        //Whether a merge animation exists for this step
        var mergeExists = function (ref) {
            return stepOptions && stepOptions.merges && stepOptions.merges[ref];
        };
        //Whether a clone animation exists for this step
        var cloneExists = function (ref) {
            return stepOptions && stepOptions.clones && stepOptions.clones[ref];
        };
        //Whether an eval animation exists for this step
        var evalExists = function (ref) {
            return stepOptions && stepOptions.evals && stepOptions.evals[ref];
        };
        // Find the durations for each transition type (may be custom)
        var moveDuration = stepOptions && stepOptions.moveDuration ? stepOptions.moveDuration : _consts__WEBPACK_IMPORTED_MODULE_6__["defaultMoveDuration"];
        var addDuration;
        var removeDuration;
        // Add and remove need to be switched if we're going backwards
        if (reverseStep) {
            addDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : _consts__WEBPACK_IMPORTED_MODULE_6__["defaultRemoveDuration"];
            removeDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : _consts__WEBPACK_IMPORTED_MODULE_6__["defaultAddDuration"];
        }
        else {
            // Not going backwards
            addDuration = stepOptions && stepOptions.addDuration ? stepOptions.addDuration : _consts__WEBPACK_IMPORTED_MODULE_6__["defaultAddDuration"];
            removeDuration = stepOptions && stepOptions.removeDuration ? stepOptions.removeDuration : _consts__WEBPACK_IMPORTED_MODULE_6__["defaultRemoveDuration"];
        }
        var maxDuration = Math.max(moveDuration, addDuration, removeDuration);
        //Add a merge animation
        var addMerge = function (mergeToRef, stateBefore) {
            var mergeTo = this.components.getContent(mergeToRef);
            var mergeToNewState = this.currStates.get(mergeTo);
            set.addAnimation(new _animation_MoveAnimation__WEBPACK_IMPORTED_MODULE_1__["default"](stateBefore, mergeToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a clone animation
        var addClone = function (cloneFromRef, stateAfter) {
            var cloneFrom = this.components.getContent(cloneFromRef);
            var cloneFromOldState = oldStates.get(cloneFrom);
            set.addAnimation(new _animation_MoveAnimation__WEBPACK_IMPORTED_MODULE_1__["default"](cloneFromOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);
        //Add an eval animation
        var addEval = function (evalToRef, stateBefore) {
            var evalTo = this.components.getContent(evalToRef);
            var evalToNewState = this.currStates.get(evalTo);
            set.addAnimation(new _animation_EvalAnimation__WEBPACK_IMPORTED_MODULE_4__["default"](stateBefore, evalToNewState, set, this.ctx, moveDuration));
        }.bind(this);
        //Add a reverse eval
        var addRevEval = function (evalToRef, stateAfter) {
            var evalTo = this.components.getContent(evalToRef);
            var evalToOldState = oldStates.get(evalTo);
            set.addAnimation(new _animation_ReverseEvalAnimation__WEBPACK_IMPORTED_MODULE_5__["default"](evalToOldState, stateAfter, set, this.ctx, moveDuration));
        }.bind(this);
        //Animate the progress indicator
        if (this.progress && !updateDimenAfter) {
            set.addAnimation(new _animation_ProgressAnimation__WEBPACK_IMPORTED_MODULE_8__["default"](stepBefore, stepAfter, this.steps.length, this.progress, set, maxDuration, _consts__WEBPACK_IMPORTED_MODULE_6__["progressEasing"], canvasWidth, canvasHeight));
        }
        //Look through content to see what has happened to it (avoiding containers)
        this.forAllContent(function (content) {
            var stateBefore = undefined;
            //We may be initilizing, where there are no old frames and everything is added
            if (oldStates !== undefined)
                stateBefore = oldStates.get(content);
            var stateAfter = _this.currStates.get(content);
            var contentRef = content.getRef();
            if (stateBefore && stateAfter) {
                //Content has just moved
                set.addAnimation(new _animation_MoveAnimation__WEBPACK_IMPORTED_MODULE_1__["default"](stateBefore, stateAfter, set, _this.ctx, moveDuration));
            }
            else if (stateBefore) {
                //Doesn't exist after, has been removed
                if (mergeExists(contentRef)) {
                    //Do a merge animation
                    addMerge(stepOptions.merges[contentRef], stateBefore);
                }
                else if (evalExists(contentRef)) {
                    //Do an eval animation
                    addEval(stepOptions.evals[contentRef], stateBefore);
                }
                else if (reverseStep && cloneExists(contentRef)) {
                    //Do a reverse clone, aka merge.
                    //Cloning is "to": "from", need to work backwards
                    addMerge(stepOptions.clones[contentRef], stateBefore);
                }
                else {
                    //Do a regular remove animation
                    set.addAnimation(new _animation_RemoveAnimation__WEBPACK_IMPORTED_MODULE_2__["default"](stateBefore, set, _this.ctx, removeDuration));
                }
            }
            else if (stateAfter) {
                //Doesn't exist before, has been added
                if (cloneExists(contentRef)) {
                    //Do a clone animation
                    addClone(stepOptions.clones[contentRef], stateAfter);
                }
                else if (reverseStep && mergeExists(contentRef)) {
                    //Do a reverse merge, aka clone.
                    //Merging is "from": "to", need to work backwards.
                    addClone(stepOptions.merges[contentRef], stateAfter);
                }
                else if (reverseStep && evalExists(contentRef)) {
                    //Do a reverse eval
                    addRevEval(stepOptions.evals[contentRef], stateAfter);
                }
                else {
                    set.addAnimation(new _animation_AddAnimation__WEBPACK_IMPORTED_MODULE_3__["default"](stateAfter, set, _this.ctx, addDuration));
                }
            }
        });
        return set;
    };
    /**
     * Gets the dimensions of the canvas based on
     * the root layout state.
     *
     * @param root The layout state of the root container.
     */
    CanvasController.prototype.getSize = function (root) {
        var rootHeight = root.height;
        var rootWidth = root.width;
        var currWidth = this.container.clientWidth;
        var newWidth = rootWidth > currWidth ? rootWidth : currWidth;
        return [newWidth, rootHeight];
    };
    /**
     * Sets the dimensions of the canvas.
     *
     * @param newWidth The new width.
     * @param newHeight The new height.
     */
    CanvasController.prototype.setSize = function (newWidth, newHeight) {
        if (newWidth === this.lastWidth && newHeight === this.lastHeight) {
            //Early return, no need to change size
            return;
        }
        //Update canvas css size
        this.canvas.style.width = newWidth + "px";
        this.canvas.style.height = newHeight + "px";
        //Update canvas pixel size for HDPI
        var pixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = newWidth * pixelRatio;
        this.canvas.height = newHeight * pixelRatio;
        this.ctx.scale(pixelRatio, pixelRatio);
        this.ctx.font = this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFamily;
        this.lastHeight = newHeight;
        this.lastWidth = newWidth;
    };
    /**
     * Return the step options object for the
     * transition between two steps. Returns
     * undefined if there are no step options
     * for that transition. Step2 must be greater
     * than Step1.
     *
     * @param step1 The first step.
     * @param step2 The second step.
     */
    CanvasController.prototype.getStepOptions = function (step1, step2) {
        if (!this.stepOptions) {
            //No step options defined
            return undefined;
        }
        if (step2 - step1 !== 1) {
            //Steps are seperated or in the wrong order
            return undefined;
        }
        return this.stepOptions[step2 - 1];
    };
    /**
     * Calculate and return the layout for
     * a particular step. Returns [all layouts, root layout, mouse enter events, mouse exit events, mouse click events, temp content].
     *
     * @param idx The step number.
     * @param reparse Whether to re-create the container hierarchy.
     */
    CanvasController.prototype.calcLayout = function (idx, reparse) {
        //First create the structure of containers in memory
        if (reparse) {
            var rootObj = this.steps[idx].root;
            this.currRootContainer = this.components.parseContainer(rootObj, 0);
        }
        //If content doesn't take up full width, center it
        var width = this.container.clientWidth;
        if (this.currRootContainer.getWidth() < width) {
            this.currRootContainer.setWidth(width);
        }
        //Apply fixed height
        if (this.fixedHeights) {
            var height = this.fixedHeights[window['currentWidthTier']];
            this.currRootContainer.setHeight(height);
        }
        //Set the text
        if (reparse && this.textArea) {
            this.textArea.innerHTML = this.steps[idx].text ? this.steps[idx].text : "";
        }
        //Get the color info
        var colorsObj = this.steps[idx].color;
        var opacityObj = this.steps[idx].opacity;
        var allLayouts = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["newMap"])();
        var mouseEnters = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["newMap"])();
        var mouseExits = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["newMap"])();
        var mouseClicks = Object(_helpers__WEBPACK_IMPORTED_MODULE_9__["newMap"])();
        var tempContent = [];
        var rootLayout = this.currRootContainer.addLayout(undefined, allLayouts, 0, 0, 1, opacityObj, colorsObj, mouseEnters, mouseExits, mouseClicks, tempContent);
        return [allLayouts, rootLayout, mouseEnters, mouseExits, mouseClicks, tempContent];
    };
    return CanvasController;
}());
/* harmony default export */ __webpack_exports__["default"] = (CanvasController);


/***/ }),

/***/ "../src/main/ComponentModel.ts":
/*!*************************************!*\
  !*** ../src/main/ComponentModel.ts ***!
  \*************************************/
/*! exports provided: Content, containerParsers, Container, ComponentModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Content", function() { return Content; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "containerParsers", function() { return containerParsers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Container", function() { return Container; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComponentModel", function() { return ComponentModel; });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "../src/main/helpers.ts");

var contentSpecs = [];
function Content(contentSpec) {
    contentSpecs.push(contentSpec);
    return function (construc) { };
}
var containerParsers = {};
function Container(containerSpec) {
    containerParsers[containerSpec.typeString] = containerSpec.parse;
    return function (construc) { };
}
/**
 * Stores content/container information for a Canvas Controller in a way that's
 * modular. The decorator function above is used to mark content usable
 * here, and specifies how to load and store it.
 */
var ComponentModel = /** @class */ (function () {
    /**
     * Initialize the component model and the content
     * in the file.
     * @param file The file.
     */
    function ComponentModel(file) {
        var _this = this;
        this.genInfo = {};
        this.content = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__["newMap"])();
        // Initialize general info
        contentSpecs.forEach(function (spec) {
            if (spec.calcInfo) {
                spec.calcInfo(file, _this.genInfo);
            }
        });
        // Initialize content
        contentSpecs.forEach(function (spec) {
            _this.content.set(spec.character, spec.initialize(file, _this.genInfo));
        });
        this.getContent = this.getContent.bind(this);
        this.parseContainer = this.parseContainer.bind(this);
    }
    /**
     * Call a function for all content.
     * @param callback The function.
     */
    ComponentModel.prototype.forAllContent = function (callback) {
        this.content.forEach(function (contentArr) {
            contentArr.forEach(function (content) {
                callback(content);
            });
        });
    };
    /**
     * Get content by its reference.
     * @param ref The content reference.
     */
    ComponentModel.prototype.getContent = function (ref) {
        var contentType = ref.substring(0, 1);
        var contentIndex = parseFloat(ref.substring(1, ref.length));
        return this.content.get(contentType)[contentIndex];
    };
    /**
     * Parse a container object recursively and return its
     * class representation.
     * @param containerObj The container object to parse.
     * @param depth The depth in the container hierarchy.
     */
    ComponentModel.prototype.parseContainer = function (containerObj, depth) {
        return containerParsers[containerObj.type](containerObj, depth, this.getContent, this.parseContainer, this.genInfo);
    };
    /**
     * Set general info that content/containers might need
     * to initialize.
     * @param key The name of the info.
     * @param val The info.
     */
    ComponentModel.prototype.setGenInfo = function (key, val) {
        this.genInfo[key] = val;
    };
    return ComponentModel;
}());



/***/ }),

/***/ "../src/main/HeightComputeCanvasController.ts":
/*!****************************************************!*\
  !*** ../src/main/HeightComputeCanvasController.ts ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CanvasController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./consts */ "../src/main/consts.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "../src/main/helpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



/**
 * Canvas controller that computes the max height of an
 * instructions object at each font size.
 */
var HeightComputeCanvasController = /** @class */ (function (_super) {
    __extends(HeightComputeCanvasController, _super);
    function HeightComputeCanvasController(instructions) {
        var _this = _super.call(this, document.createElement('div'), instructions) || this;
        _this.origInstructions = instructions;
        return _this;
    }
    /**
     * Compute the maximum height of all steps for
     * a width tier.
     * @param tier The width tier.
     */
    HeightComputeCanvasController.prototype.getMaxHeight = function (tier) {
        var win = window;
        win.currentWidthTier = tier;
        for (var i = 0; i < this.origInstructions.terms.length; i++) {
            this.components.getContent('t' + i).recalcDimensions();
        }
        var maxHeight = 0;
        for (var i = 0; i < this.steps.length; i++) {
            var layout = this.calcLayout(i, true)[1];
            if (layout.height > maxHeight) {
                maxHeight = layout.height;
            }
        }
        win.currentWidthTier = Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["getWidthTier"])();
        return maxHeight;
    };
    /**
     * Compute and return the maximum height of every
     * step for each font size tier. The array returned
     * corresponds to each font size tier.
     */
    HeightComputeCanvasController.prototype.compute = function () {
        var toReturn = [];
        for (var i = 0; i < _consts__WEBPACK_IMPORTED_MODULE_1__["widthTiers"].length; i++) {
            toReturn.push(this.getMaxHeight(i));
        }
        return toReturn;
    };
    return HeightComputeCanvasController;
}(_CanvasController__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (HeightComputeCanvasController);


/***/ }),

/***/ "../src/main/ProgressIndicator.ts":
/*!****************************************!*\
  !*** ../src/main/ProgressIndicator.ts ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "../src/main/consts.ts");
/* harmony import */ var _layout_EqContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "../src/main/helpers.ts");



/**
 * Given a canvas, draws an arc at some circumference
 * to indicate the completion of the animation. I.E
 * nothing is 0% complete, a circle is 100% complete.
 */
var ProgressIndicator = /** @class */ (function () {
    /**
     * Create a new ProgressIndicator drawing
     * to a canvas.
     * @param canvas The canvas to draw to.
     */
    function ProgressIndicator(canvas) {
        this.ctx = canvas.getContext("2d");
    }
    /**
     * Draw the line on the canvas at some level of
     * completion.
     * @param completion The completion as a decimal.
     * @param width The width of the canvas to draw on.
     * @param height The height of the canvas to draw on.
     */
    ProgressIndicator.prototype.draw = function (completion, width, height) {
        var color = _layout_EqContent__WEBPACK_IMPORTED_MODULE_1__["default"].colors['default'];
        this.ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + _consts__WEBPACK_IMPORTED_MODULE_0__["progressOpacity"] + ')';
        Object(_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(0, height - 1, width * completion, height - 1, this.ctx);
    };
    return ProgressIndicator;
}());
/* harmony default export */ __webpack_exports__["default"] = (ProgressIndicator);


/***/ }),

/***/ "../src/main/consts.ts":
/*!*****************************!*\
  !*** ../src/main/consts.ts ***!
  \*****************************/
/*! exports provided: defaultFontFamily, defaultFontStyle, defaultFontWeight, fontSizes, widthTiers, testCanvasFontSizeMultiple, testCanvasWidth, progressOpacity, defaultVBoxPadding, defaultRootVBoxPadding, defaultHBoxPadding, defaultTightHBoxPadding, defaultSubSuperPadding, defaultRootPadding, defaultQuizPadding, defaultTablePadding, termPadding, tightTermPadding, hDividerPadding, vDividerPadding, tableCellPadding, tableMinCellDimen, expScale, defaultExpPortrusion, rootArgMarginLeft, rootIndexScale, rootKinkTipAngle, rootKinkTipLength, curvedOutlineBorderRadius, curvedOutlineDefaultOpacity, curvedOutlineColor, radioButtonDefaultOpacity, radioButtonColor, answerVMargin, hoveredOutlineOpacity, revealedOutlineOpacity, outlineFadeInDuration, outlineFadeInEasing, quizCorrectColor, quizIncorrectColor, quizCurvedOutlinePadding, quizRadioButtonDimen, quizRadioButtonPadding, quizRadioButtonSelectDuration, quizRadioButtonSelectEasing, quizRadioButtonDeselectDuration, quizRadioButtonDeselectEasing, creatorContainerPadding, creatorHDividerPadding, creatorVDividerPadding, creatorSelectableHDividerPadding, creatorSelectableVDividerPadding, creatorContainerStroke, creatorCaretFillStyle, creatorCaretFillStyleLighter, creatorCaretSize, creatorLineDash, creatorErrorTimeout, creatorTableMinCellDimen, creatorPlusLineHalfLength, defaultAddDuration, addEasing, defaultMoveDuration, moveEasing, defaultRemoveDuration, removeEasing, progressEasing, colors, fadedOpacity, normalOpacity, focusedOpacity, backgroundColor, buttonHighlightedOpacity, buttonHighlightDuration, buttonHighlightEasing, buttonUnhighlightDuration, buttonUnhighlightEasing */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultFontFamily", function() { return defaultFontFamily; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultFontStyle", function() { return defaultFontStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultFontWeight", function() { return defaultFontWeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fontSizes", function() { return fontSizes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "widthTiers", function() { return widthTiers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testCanvasFontSizeMultiple", function() { return testCanvasFontSizeMultiple; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "testCanvasWidth", function() { return testCanvasWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "progressOpacity", function() { return progressOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultVBoxPadding", function() { return defaultVBoxPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultRootVBoxPadding", function() { return defaultRootVBoxPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultHBoxPadding", function() { return defaultHBoxPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultTightHBoxPadding", function() { return defaultTightHBoxPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultSubSuperPadding", function() { return defaultSubSuperPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultRootPadding", function() { return defaultRootPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultQuizPadding", function() { return defaultQuizPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultTablePadding", function() { return defaultTablePadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "termPadding", function() { return termPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tightTermPadding", function() { return tightTermPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hDividerPadding", function() { return hDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vDividerPadding", function() { return vDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tableCellPadding", function() { return tableCellPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tableMinCellDimen", function() { return tableMinCellDimen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "expScale", function() { return expScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultExpPortrusion", function() { return defaultExpPortrusion; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rootArgMarginLeft", function() { return rootArgMarginLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rootIndexScale", function() { return rootIndexScale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rootKinkTipAngle", function() { return rootKinkTipAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rootKinkTipLength", function() { return rootKinkTipLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "curvedOutlineBorderRadius", function() { return curvedOutlineBorderRadius; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "curvedOutlineDefaultOpacity", function() { return curvedOutlineDefaultOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "curvedOutlineColor", function() { return curvedOutlineColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "radioButtonDefaultOpacity", function() { return radioButtonDefaultOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "radioButtonColor", function() { return radioButtonColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "answerVMargin", function() { return answerVMargin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hoveredOutlineOpacity", function() { return hoveredOutlineOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "revealedOutlineOpacity", function() { return revealedOutlineOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outlineFadeInDuration", function() { return outlineFadeInDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "outlineFadeInEasing", function() { return outlineFadeInEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizCorrectColor", function() { return quizCorrectColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizIncorrectColor", function() { return quizIncorrectColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizCurvedOutlinePadding", function() { return quizCurvedOutlinePadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonDimen", function() { return quizRadioButtonDimen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonPadding", function() { return quizRadioButtonPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonSelectDuration", function() { return quizRadioButtonSelectDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonSelectEasing", function() { return quizRadioButtonSelectEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonDeselectDuration", function() { return quizRadioButtonDeselectDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quizRadioButtonDeselectEasing", function() { return quizRadioButtonDeselectEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorContainerPadding", function() { return creatorContainerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorHDividerPadding", function() { return creatorHDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorVDividerPadding", function() { return creatorVDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorSelectableHDividerPadding", function() { return creatorSelectableHDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorSelectableVDividerPadding", function() { return creatorSelectableVDividerPadding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorContainerStroke", function() { return creatorContainerStroke; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorCaretFillStyle", function() { return creatorCaretFillStyle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorCaretFillStyleLighter", function() { return creatorCaretFillStyleLighter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorCaretSize", function() { return creatorCaretSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorLineDash", function() { return creatorLineDash; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorErrorTimeout", function() { return creatorErrorTimeout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorTableMinCellDimen", function() { return creatorTableMinCellDimen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorPlusLineHalfLength", function() { return creatorPlusLineHalfLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultAddDuration", function() { return defaultAddDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addEasing", function() { return addEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultMoveDuration", function() { return defaultMoveDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moveEasing", function() { return moveEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultRemoveDuration", function() { return defaultRemoveDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeEasing", function() { return removeEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "progressEasing", function() { return progressEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colors", function() { return colors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fadedOpacity", function() { return fadedOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalOpacity", function() { return normalOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "focusedOpacity", function() { return focusedOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "backgroundColor", function() { return backgroundColor; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonHighlightedOpacity", function() { return buttonHighlightedOpacity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonHighlightDuration", function() { return buttonHighlightDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonHighlightEasing", function() { return buttonHighlightEasing; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonUnhighlightDuration", function() { return buttonUnhighlightDuration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buttonUnhighlightEasing", function() { return buttonUnhighlightEasing; });
/* harmony import */ var _layout_Padding__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/Padding */ "../src/layout/Padding.ts");
/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bezier-easing */ "../node_modules/bezier-easing/src/index.js");
/* harmony import */ var bezier_easing__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bezier_easing__WEBPACK_IMPORTED_MODULE_1__);


// The DEFAULT Google font, may be overridden.
var defaultFontFamily = 'PT Serif';
// Normal or italic
var defaultFontStyle = 'Normal';
// Must be supported by the google font
var defaultFontWeight = '400';
// The font size at each width tier below
var fontSizes = [35, 30, 25];
// The tiers at which font size will change.
// More tiers means better layout but worse
// file size.
var widthTiers = [670, 500, 300];
// Tuning variable, turn down for better
// performance when loading files without
// inbuilt metrics.Too low will give layout
// innacuracies.
var testCanvasFontSizeMultiple = 5;
// The width of the test canvas. Once again,
// can turn down for better performance, but
// will limit the maximum width of terms.
var testCanvasWidth = 10000;
// The opacity of the progress bar
var progressOpacity = 0.25;
// Layout:
var defaultVBoxPadding = 0;
var defaultRootVBoxPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](18, 0, 20, 0);
var defaultHBoxPadding = 0;
var defaultTightHBoxPadding = 0;
var defaultSubSuperPadding = _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(0);
var defaultRootPadding = _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(0);
var defaultQuizPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](0, 10, 0, 10);
var defaultTablePadding = _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(2);
var termPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](10, 5, 10, 5);
var tightTermPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](5, 2, 5, 2);
var hDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](0, 3, 0, 3);
var vDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](3, 0, 3, 0);
var tableCellPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](7, 7, 7, 7);
var tableMinCellDimen = 30;
// The scaling of exponents and subscripts.
var expScale = 0.575;
// The proportion of exponents and subscripts that portrudes from the component they're 'attached' to.
var defaultExpPortrusion = 0.1;
// Roots:
var rootArgMarginLeft = 7;
var rootIndexScale = 0.5;
// The angle the small tip of the radical kink makes
// to the rest of the kink.
var rootKinkTipAngle = Math.PI / 2;
var rootKinkTipLength = 3;
// Curved outlines:
var curvedOutlineBorderRadius = 5;
var curvedOutlineDefaultOpacity = 0.3;
var curvedOutlineColor = [255, 255, 255];
// Radio buttons:
var radioButtonDefaultOpacity = 0.3;
var radioButtonColor = [255, 255, 255];
// Quizzes:
var answerVMargin = 20;
var hoveredOutlineOpacity = 0.75;
var revealedOutlineOpacity = 1;
var outlineFadeInDuration = 300;
var outlineFadeInEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.5, 0.5, 0.5, 0.5);
var quizCorrectColor = [100, 221, 23];
var quizIncorrectColor = [198, 40, 40];
var quizCurvedOutlinePadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](0, 5, 0, 5);
var quizRadioButtonDimen = 35;
var quizRadioButtonPadding = _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(10);
var quizRadioButtonSelectDuration = 300;
var quizRadioButtonSelectEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.0, 0.0, 0.2, 1);
var quizRadioButtonDeselectDuration = 300;
var quizRadioButtonDeselectEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.4, 0.0, 1, 1);
// Creator:
var creatorContainerPadding = _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"].even(30);
var creatorHDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](5, 15, 5, 15);
var creatorVDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](15, 5, 15, 5);
var creatorSelectableHDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](5, 0, 5, 0);
var creatorSelectableVDividerPadding = new _layout_Padding__WEBPACK_IMPORTED_MODULE_0__["default"](0, 5, 0, 5);
var creatorContainerStroke = "rgb(175, 175, 175)";
var creatorCaretFillStyle = '#eee';
var creatorCaretFillStyleLighter = '#777';
var creatorCaretSize = 5;
var creatorLineDash = [2];
var creatorErrorTimeout = 5000;
var creatorTableMinCellDimen = 30;
var creatorPlusLineHalfLength = 5;
// Animations: durations are in MS
var defaultAddDuration = 700;
var addEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.0, 0.0, 0.2, 1);
var defaultMoveDuration = 700;
var moveEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.4, 0.0, 0.2, 1);
var defaultRemoveDuration = 400;
var removeEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.4, 0.0, 1, 1);
var progressEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.4, 0.0, 0.2, 1);
// Appearance:
var colors = {
    //RGB
    "red": [229, 57, 53],
    "pink": [247, 18, 171],
    "purple": [170, 0, 255],
    "blue": [27, 158, 245],
    "teal": [0, 181, 193],
    "green": [88, 199, 75],
    "orange": [255, 102, 0],
    "default": [255, 255, 255],
    "primary": [212, 225, 87],
    "secondary": [255, 193, 7]
};
var fadedOpacity = 0.5;
var normalOpacity = 0.75;
var focusedOpacity = 1;
var backgroundColor = [0, 0, 0];
// Button animations:
var buttonHighlightedOpacity = 1;
var buttonHighlightDuration = 200;
var buttonHighlightEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.0, 0.0, 0.2, 1);
var buttonUnhighlightDuration = 200;
var buttonUnhighlightEasing = bezier_easing__WEBPACK_IMPORTED_MODULE_1___default()(0.4, 0.0, 1, 1);


/***/ }),

/***/ "../src/main/helpers.ts":
/*!******************************!*\
  !*** ../src/main/helpers.ts ***!
  \******************************/
/*! exports provided: rgbaArrayToCssString, addStyleSheet, getFont, getMetrics, isIE, line, tri, getWidthTier, getFontSizeForTier, newMap, parseContainerChildren */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgbaArrayToCssString", function() { return rgbaArrayToCssString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addStyleSheet", function() { return addStyleSheet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFont", function() { return getFont; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getMetrics", function() { return getMetrics; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isIE", function() { return isIE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "line", function() { return line; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tri", function() { return tri; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getWidthTier", function() { return getWidthTier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFontSizeForTier", function() { return getFontSizeForTier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "newMap", function() { return newMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseContainerChildren", function() { return parseContainerChildren; });
/* harmony import */ var _consts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./consts */ "../src/main/consts.ts");
/* harmony import */ var map_or_similar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! map-or-similar */ "../node_modules/map-or-similar/map-or-similar.js");
/* harmony import */ var map_or_similar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(map_or_similar__WEBPACK_IMPORTED_MODULE_1__);


/**
 * Given an array of r, g, b, and a values respectively,
 * return the CSS representation of that color.
 * @param colorArr The CSS color.
 */
function rgbaArrayToCssString(colorArr) {
    var r = colorArr[0];
    var g = colorArr[1];
    var b = colorArr[2];
    var a = colorArr[3];
    if (a !== undefined) {
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
    else {
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
}
/**
 * Add styles based on the contents of consts
 *
 * @param otherColors If present, use other colors than the default.
 */
function addStyleSheet(otherColors) {
    var styleEl = document.createElement('style');
    var styleText = '';
    var colorObj = otherColors ? otherColors : _consts__WEBPACK_IMPORTED_MODULE_0__["colors"];
    Object.keys(colorObj).forEach(function (colorName) {
        var colorVal = colorObj[colorName];
        styleText += '.' + colorName + ' { color: ' + rgbaArrayToCssString(colorVal) + '}';
    });
    styleEl.appendChild(document.createTextNode(styleText));
    document.head.appendChild(styleEl);
}
/**
 * Return the font family, style, and weight (in that order) to
 * use for a given instructions object.
 * @param instructions The instructions.
 */
function getFont(instructions) {
    if (instructions.font) {
        // There's a font set
        if (instructions.font.type === "c") {
            // There's a custom font
            var font = instructions.font;
            return [
                font.name,
                font.style,
                font.weight
            ];
        }
        else if (instructions.font.type === "g") {
            var font = instructions.font;
            // There's a google font
            var descriptor = font.name;
            var split = descriptor.split(":");
            var fontFamily = split[0];
            if (split[1]) {
                // It has a special weight/italic
                if (split[1].charAt(split[1].length - 1) === "i") {
                    // Is italic
                    return [
                        fontFamily,
                        'italic',
                        split[1].substring(0, split[1].length - 1)
                    ];
                }
                else {
                    // Not italic
                    return [
                        fontFamily,
                        _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontStyle"],
                        split[1]
                    ];
                }
            }
            else {
                // No defined weight/italic
                return [
                    fontFamily,
                    _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontStyle"],
                    _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontWeight"]
                ];
            }
        }
        else {
            throw "Unrecognized custom font type";
        }
    }
    else {
        // Use default
        return [
            _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontFamily"],
            _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontStyle"],
            _consts__WEBPACK_IMPORTED_MODULE_0__["defaultFontWeight"]
        ];
    }
}
/**
 * Get the font metrics object for an instructions object.
 * @param instructions The instructions to get the metrics for.
 */
function getMetrics(instructions) {
    var metricsArr = [];
    var _loop_1 = function (i) {
        var metrics = {};
        metricsArr.push(metrics);
        metrics.widths = [];
        /* Look for the max ascent and
           descent, which all terms will use. */
        var maxAscent = 0;
        var maxDescent = 0;
        instructions.terms.forEach(function (term) {
            var termMetrics = measureTerm(term, i, instructions);
            if (termMetrics.ascent > maxAscent) {
                maxAscent = termMetrics.ascent;
            }
            if (termMetrics.descent > maxDescent) {
                maxDescent = termMetrics.descent;
            }
            // All terms have their own width
            metrics.widths.push(termMetrics.width);
        });
        metrics.ascent = maxAscent;
        metrics.height = maxAscent + maxDescent;
    };
    // Calculate a metrics object for each width tier
    for (var i = 0; i < _consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length; i++) {
        _loop_1(i);
    }
    return metricsArr;
}
/**
 * Measure the metrics for a term.
 * @param term The term to measure.
 * @param tier The width tier to measure this term for.
 * @param instructions The instructions object containing this term.
 */
function measureTerm(term, tier, instructions) {
    var toReturn = {};
    var fontSize = getFontSizeForTier(tier);
    var _a = getFont(instructions), fontFamily = _a[0], style = _a[1], weight = _a[2];
    // Create a canvas to measure with
    var testCanvas = document.createElement('canvas');
    testCanvas.width = _consts__WEBPACK_IMPORTED_MODULE_0__["testCanvasWidth"];
    testCanvas.height = fontSize * _consts__WEBPACK_IMPORTED_MODULE_0__["testCanvasFontSizeMultiple"];
    var testCtx = testCanvas.getContext('2d');
    testCtx.font = weight + " " + style + " " + fontSize + "px " + fontFamily;
    // Get the width
    toReturn.width = testCtx.measureText(term).width;
    // Draw the text on the canvas to measure ascent and descent
    testCtx.fillStyle = 'white';
    testCtx.fillRect(0, 0, testCanvas.width, testCanvas.height);
    testCtx.fillStyle = 'black';
    testCtx.fillText(term, 0, testCanvas.height / 2);
    var image = testCtx.getImageData(0, 0, toReturn.width, testCanvas.height);
    var imageData = image.data;
    // Go down until we find text
    var i = 0;
    while (++i < imageData.length && imageData[i] === 255) { }
    var ascent = i / (image.width * 4);
    // Go up until we find text
    i = imageData.length - 1;
    while (--i > 0 && imageData[i] === 255) { }
    var descent = i / (image.width * 4);
    toReturn.ascent = testCanvas.height / 2 - ascent;
    toReturn.descent = descent - testCanvas.height / 2;
    return toReturn;
}
//Detects if the browser is ie
var userAgent = window.navigator.userAgent;
var isIE = userAgent.indexOf('MSIE ') > -1 ||
    userAgent.indexOf('Trident/') > -1 ||
    userAgent.indexOf('Edge/') > -1;
/**
 * Draws a line from one point to another.
 *
 * @param x1 Starting x.
 * @param y1 Starting y.
 * @param x2 End x.
 * @param y2 End y.
 * @param ctx The context to draw a line on.
 */
function line(x1, y1, x2, y2, ctx) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
/**
 * Draws an equilateral stroked triangle based
 * on its center and width.
 * @param centX The X-ordinate of the center of the triangle.
 * @param centY The Y-ordinate of the center of the triangle.
 * @param width The width of the triangle.
 * @param height The height of the triangle.
 * @param ctx The context to render to.
 */
function tri(centX, centY, width, height, ctx) {
    var tlx = centX - width / 2;
    var tly = centY - height / 2;
    ctx.beginPath();
    ctx.moveTo(tlx, tly);
    ctx.lineTo(tlx + width, tly);
    ctx.lineTo(centX, tly + height);
    ctx.lineTo(tlx, tly);
    ctx.fill();
}
window['currentWidthTier'] = getWidthTier();
window.addEventListener('resize', function () {
    window['currentWidthTier'] = getWidthTier();
});
/**
 * Return the current width tier, as
 * defined by consts.widthTiers. The
 * returned number is the index of the
 * consts.widthTiers array. If the window
 * width is less than the minimum defined
 * there, returns the index of the minimum
 * width tier.
 */
function getWidthTier() {
    var currWidth = window.innerWidth;
    for (var i = 0; i < _consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length; i++) {
        if (currWidth > _consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"][i]) {
            return i;
        }
    }
    return _consts__WEBPACK_IMPORTED_MODULE_0__["widthTiers"].length - 1;
}
/**
 * Calculates and returns the appropriate
 * font size for a width tier.
 */
function getFontSizeForTier(tier) {
    return _consts__WEBPACK_IMPORTED_MODULE_0__["fontSizes"][tier];
}
var mapSupported = typeof window['Map'] === 'function';
/**
 * Get a new Map, or Map-like-object
 * if Map is not supported. Available
 * operations are described by the interface
 * below.
 */
function newMap() {
    return mapSupported ? new window['Map']() : new map_or_similar__WEBPACK_IMPORTED_MODULE_1___default.a();
}
/**
 * Parse the children attribute of a container
 * JSON Object.
 *
 * @param children The children array.
 * @param depth The depth in the layout tree.
 */
function parseContainerChildren(children, depth, parseContainer, contentGetter) {
    var toReturn = [];
    children.forEach(function (child) {
        if (typeof child === 'object') {
            if (child === null) {
                toReturn.push(undefined);
            }
            else {
                toReturn.push(parseContainer(child, depth + 1));
            }
        }
        else if (typeof child === 'string') {
            toReturn.push(contentGetter(child));
        }
        else {
            throw "Invalid type of child in JSON file.";
        }
    });
    return toReturn;
}


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/Icon.ts":
/*!*************************!*\
  !*** ./src/app/Icon.ts ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Icon = /** @class */ (function () {
    function Icon(name, onClick, isActive) {
        this.name = name;
        this.onClickVar = onClick;
        this.isActive = isActive;
        this.onClick = this.onClick.bind(this);
    }
    Icon.prototype.onClick = function (e) {
        e.stopPropagation();
        // Don't allow click event when inactive.
        if (this.isActive && !this.isActive()) {
            return;
        }
        this.onClickVar();
    };
    return Icon;
}());
/* harmony default export */ __webpack_exports__["default"] = (Icon);


/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#main-column {\r\n    display: flex;\r\n    flex-direction: column;\r\n    flex-wrap: nowrap;\r\n    max-height: 100vh;\r\n    position: relative;\r\n    z-index: 1;\r\n}\r\n\r\n#middle-row {\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: nowrap;\r\n    flex-grow: 1;\r\n}\r\n\r\n#background {\r\n    position: fixed;\r\n    top: 0px;\r\n    left: 0px;\r\n    bottom: 0px;\r\n    right: 0px;\r\n    background-color: rgba(255, 255, 255, 0.25);\r\n}\r\n\r\n#modal-inner {\r\n    left: 50%;\r\n    top: 50%;\r\n    -webkit-transform: translate(-50%, -50%);\r\n            transform: translate(-50%, -50%);\r\n    position: fixed;\r\n    background-color: #111;\r\n    width: 400px;\r\n    max-height: 100vh;\r\n    padding: 10px;\r\n    overflow-y: auto;\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\n#error {\r\n    position: fixed;\r\n    z-index: 2;\r\n    padding: 10px;\r\n    bottom: 30px;\r\n    right: 30px;\r\n    background-color: black;\r\n    color: #EF5350;\r\n    border-radius: 5px;\r\n    display: flex;\r\n    align-items: center;\r\n    border: 1px solid rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n#error .material-icons {\r\n    padding: 5px;\r\n    cursor: pointer;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLGlCQUFpQjtJQUNqQixpQkFBaUI7SUFDakIsa0JBQWtCO0lBQ2xCLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsaUJBQWlCO0lBQ2pCLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsUUFBUTtJQUNSLFNBQVM7SUFDVCxXQUFXO0lBQ1gsVUFBVTtJQUNWLDJDQUEyQztBQUMvQzs7QUFFQTtJQUNJLFNBQVM7SUFDVCxRQUFRO0lBQ1Isd0NBQWdDO1lBQWhDLGdDQUFnQztJQUNoQyxlQUFlO0lBQ2Ysc0JBQXNCO0lBQ3RCLFlBQVk7SUFDWixpQkFBaUI7SUFDakIsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQiwrQkFBK0I7QUFDbkM7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsVUFBVTtJQUNWLGFBQWE7SUFDYixZQUFZO0lBQ1osV0FBVztJQUNYLHVCQUF1QjtJQUN2QixjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsMENBQTBDO0FBQzlDOztBQUVBO0lBQ0ksWUFBWTtJQUNaLGVBQWU7QUFDbkIiLCJmaWxlIjoic3JjL2FwcC9hcHAuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNtYWluLWNvbHVtbiB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGZsZXgtd3JhcDogbm93cmFwO1xyXG4gICAgbWF4LWhlaWdodDogMTAwdmg7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB6LWluZGV4OiAxO1xyXG59XHJcblxyXG4jbWlkZGxlLXJvdyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgIGZsZXgtd3JhcDogbm93cmFwO1xyXG4gICAgZmxleC1ncm93OiAxO1xyXG59XHJcblxyXG4jYmFja2dyb3VuZCB7XHJcbiAgICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgICB0b3A6IDBweDtcclxuICAgIGxlZnQ6IDBweDtcclxuICAgIGJvdHRvbTogMHB4O1xyXG4gICAgcmlnaHQ6IDBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yNSk7XHJcbn1cclxuXHJcbiNtb2RhbC1pbm5lciB7XHJcbiAgICBsZWZ0OiA1MCU7XHJcbiAgICB0b3A6IDUwJTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcclxuICAgIHdpZHRoOiA0MDBweDtcclxuICAgIG1heC1oZWlnaHQ6IDEwMHZoO1xyXG4gICAgcGFkZGluZzogMTBweDtcclxuICAgIG92ZXJmbG93LXk6IGF1dG87XHJcbiAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xyXG59XHJcblxyXG4jZXJyb3Ige1xyXG4gICAgcG9zaXRpb246IGZpeGVkO1xyXG4gICAgei1pbmRleDogMjtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBib3R0b206IDMwcHg7XHJcbiAgICByaWdodDogMzBweDtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IGJsYWNrO1xyXG4gICAgY29sb3I6ICNFRjUzNTA7XHJcbiAgICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKTtcclxufVxyXG5cclxuI2Vycm9yIC5tYXRlcmlhbC1pY29ucyB7XHJcbiAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div    id=\"main-column\" \r\n        (dragenter)=\"$event.preventDefault()\"\r\n        (dragover)=\"$event.preventDefault(); redraw();\"\r\n        (drop)=\"stopDrag($event)\"\r\n        (click)=\"deselect();\">\r\n    <app-tool-bar [leftIcons]=\"getLeftIcons()\" [rightIcons]=\"getRightIcons()\"></app-tool-bar>\r\n    <div id=\"middle-row\">\r\n        <app-central-area style=\"flex-grow: 1; height: calc(100vh - 156px);\"></app-central-area>\r\n        <app-content-pane style=\"height: calc(100vh - 156px)\"></app-content-pane>\r\n    </div>\r\n    <app-steps></app-steps>\r\n    <div    id=\"background\" \r\n            *ngIf=\"displayingModal\"\r\n            (mousedown)=\"modal.remove();\">\r\n        <div id=\"modal-inner\" (mousedown)=\"$event.stopPropagation();\" (click)=\"$event.stopPropagation();\">\r\n            <ng-template appModalHost></ng-template>\r\n        </div>\r\n    </div>\r\n    <div id=\"error\" *ngIf=\"error.active\">\r\n        {{ error.text }}\r\n        <span class=\"material-icons\" (click)=\"error.active = false;\">clear</span>\r\n    </div>\r\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _Icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Icon */ "./src/app/Icon.ts");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _central_area_central_area_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./central-area/central-area.component */ "./src/app/central-area/central-area.component.ts");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _content_pane_content_pane_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./content-pane/content-pane.component */ "./src/app/content-pane/content-pane.component.ts");
/* harmony import */ var _modal_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modal.directive */ "./src/app/modal.directive.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./color-picker/color-picker.component */ "./src/app/color-picker/color-picker.component.ts");
/* harmony import */ var _load_load_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./load/load.component */ "./src/app/load/load.component.ts");
/* harmony import */ var _save_save_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./save/save.component */ "./src/app/save/save.component.ts");
/* harmony import */ var _preview_preview_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./preview/preview.component */ "./src/app/preview/preview.component.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _sub_super_alignment_sub_super_alignment_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./sub-super-alignment/sub-super-alignment.component */ "./src/app/sub-super-alignment/sub-super-alignment.component.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./error.service */ "./src/app/error.service.ts");
/* harmony import */ var _font_settings_font_settings_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./font-settings/font-settings.component */ "./src/app/font-settings/font-settings.component.ts");
/* harmony import */ var _project_options_project_options_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./project-options/project-options.component */ "./src/app/project-options/project-options.component.ts");
/* harmony import */ var _quiz_configuration_quiz_configuration_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./quiz-configuration/quiz-configuration.component */ "./src/app/quiz-configuration/quiz-configuration.component.ts");
/* harmony import */ var _table_add_table_add_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./table-add/table-add.component */ "./src/app/table-add/table-add.component.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





















var AppComponent = /** @class */ (function () {
    function AppComponent(undoRedo, selection, modal, cd, error) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.modal = modal;
        this.cd = cd;
        this.error = error;
        this.displayingModal = false;
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.load = this.load.bind(this);
        this.save = this.save.bind(this);
        this.play = this.play.bind(this);
        this.deselect = this.deselect.bind(this);
        this.changeFont = this.changeFont.bind(this);
        this.openProjectOptions = this.openProjectOptions.bind(this);
        this.modal.appComponent = this;
        this.defaultLeftIcons = [];
        this.defaultRightIcons = [
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('save', this.save, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('get_app', this.load, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('play_arrow', this.play, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('undo', this.undo, this.undoRedo.canUndo),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('redo', this.redo, this.undoRedo.canRedo),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('font_download', this.changeFont, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('build', this.openProjectOptions, function () { return true; })
        ];
        this.selectedLeftIcons = [
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('clear', this.deselect, function () { return true; })
        ];
        this.selectedRightIcons = [
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('delete', function () {
                _this.selection.canvasInstance.delete();
            }, function () { return _this.selection.canvasInstance.canDelete(); }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('palette', function () {
                _this.modal.show(_color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_8__["ColorPickerComponent"]);
            }, function () { return true; })
        ];
        this.subSuperAlignIcon = new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('vertical_align_top', function () {
            _this.modal.show(_sub_super_alignment_sub_super_alignment_component__WEBPACK_IMPORTED_MODULE_13__["SubSuperAlignmentComponent"]);
        }, function () { return true; });
        this.quizConfigIcon = new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('star_half', function () {
            _this.modal.show(_quiz_configuration_quiz_configuration_component__WEBPACK_IMPORTED_MODULE_17__["QuizConfigurationComponent"]);
        }, function () { return true; });
        this.tableIcons = [
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('add', function () {
                _this.modal.show(_table_add_table_add_component__WEBPACK_IMPORTED_MODULE_18__["TableAddComponent"]);
            }, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('border_outer', function () {
                _this.selection.canvasInstance.tableAddOuterBorder();
            }, function () { return true; }),
            new _Icon__WEBPACK_IMPORTED_MODULE_1__["default"]('border_inner', function () {
                _this.selection.canvasInstance.tableAddInnerBorder();
            }, function () { return true; })
        ];
        this.undoRedo.publishChange(this.getDefaultInitialState());
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_12__["addStyleSheet"])();
    }
    Object.defineProperty(AppComponent.prototype, "modalHost", {
        get: function () {
            return this.modalHostVar;
        },
        set: function (newModalHost) {
            this.modalHostVar = newModalHost;
            if (this.onModalShow) {
                this.onModalShow(this.modalHostVar);
            }
            this.onModalShow = undefined;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.ngOnInit = function () {
        _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_19__["default"].colors = _shared_main_consts__WEBPACK_IMPORTED_MODULE_20__["colors"];
    };
    /**
     * Get the state displayed when the creator
     * is first loaded.
     */
    AppComponent.prototype.getDefaultInitialState = function () {
        return {
            steps: [{
                    root: {
                        type: 'vbox',
                        children: []
                    }
                }],
            terms: []
        };
    };
    /**
     * Get the icons to be displayed on the
     * left based on the current state.
     */
    AppComponent.prototype.getLeftIcons = function () {
        if (this.selection.selectedOnCanvas) {
            return this.selectedLeftIcons;
        }
        else {
            return this.defaultLeftIcons;
        }
    };
    /**
     * Get the icons to be displayed on the
     * right based on the current state.
     */
    AppComponent.prototype.getRightIcons = function () {
        if (this.selection.selectedOnCanvas) {
            if (this.selection.selectedOnCanvas === 'c4') {
                // A subsuper is selected, offer option to change alignment.
                return this.selectedRightIcons.concat([this.subSuperAlignIcon]);
            }
            else if (this.selection.selectedOnCanvas === 'c5') {
                // Quiz selected, offer option to change config
                return this.selectedRightIcons.concat([this.quizConfigIcon]);
            }
            else if (this.selection.selectedOnCanvas === 'c6') {
                // Table selected, offer table options
                return this.selectedRightIcons.concat(this.tableIcons);
            }
            else {
                return this.selectedRightIcons;
            }
        }
        else {
            return this.defaultRightIcons;
        }
    };
    /**
     * Redraw the canvas.
     */
    AppComponent.prototype.redraw = function () {
        this.centre.controller.redraw();
    };
    /**
     * When a component is dropped not on the
     * canvas, stop the adding behavior.
     * @param e The drag event.
     */
    AppComponent.prototype.stopDrag = function (e) {
        e.preventDefault();
        this.selection.adding = undefined;
        this.content.dragging = false;
    };
    /**
     * Deselect anything on the content pane
     * and canvas.
     */
    AppComponent.prototype.deselect = function () {
        this.selection.adding = undefined;
        this.selection.selectedOnCanvas = undefined;
    };
    /**
     * Roll back to the last state.
     */
    AppComponent.prototype.undo = function () {
        this.deselect();
        this.undoRedo.undo();
    };
    /**
     * Undo the last undo.
     */
    AppComponent.prototype.redo = function () {
        this.deselect();
        this.undoRedo.redo();
    };
    /**
     * Save the current state to a file.
     */
    AppComponent.prototype.save = function () {
        this.modal.show(_save_save_component__WEBPACK_IMPORTED_MODULE_10__["SaveComponent"]);
    };
    /**
     * Load from a file.
     */
    AppComponent.prototype.load = function () {
        this.modal.show(_load_load_component__WEBPACK_IMPORTED_MODULE_9__["LoadComponent"]);
    };
    /**
     * Play the current state.
     */
    AppComponent.prototype.play = function () {
        this.modal.show(_preview_preview_component__WEBPACK_IMPORTED_MODULE_11__["PreviewComponent"]);
    };
    /**
     * Change the current font.
     */
    AppComponent.prototype.changeFont = function () {
        this.modal.show(_font_settings_font_settings_component__WEBPACK_IMPORTED_MODULE_15__["FontSettingsComponent"]);
    };
    /**
     * Show the project config dialog.
     */
    AppComponent.prototype.openProjectOptions = function () {
        this.modal.show(_project_options_project_options_component__WEBPACK_IMPORTED_MODULE_16__["ProjectOptionsComponent"]);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_central_area_central_area_component__WEBPACK_IMPORTED_MODULE_3__["CentralAreaComponent"]),
        __metadata("design:type", _central_area_central_area_component__WEBPACK_IMPORTED_MODULE_3__["CentralAreaComponent"])
    ], AppComponent.prototype, "centre", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_content_pane_content_pane_component__WEBPACK_IMPORTED_MODULE_5__["ContentPaneComponent"]),
        __metadata("design:type", _content_pane_content_pane_component__WEBPACK_IMPORTED_MODULE_5__["ContentPaneComponent"])
    ], AppComponent.prototype, "content", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])(_modal_directive__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"]),
        __metadata("design:type", _modal_directive__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"]),
        __metadata("design:paramtypes", [_modal_directive__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"]])
    ], AppComponent.prototype, "modalHost", null);
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_2__["UndoRedoService"],
            _content_selection_service__WEBPACK_IMPORTED_MODULE_4__["ContentSelectionService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_7__["ModalService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _error_service__WEBPACK_IMPORTED_MODULE_14__["ErrorService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _tool_bar_tool_bar_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tool-bar/tool-bar.component */ "./src/app/tool-bar/tool-bar.component.ts");
/* harmony import */ var _content_pane_content_pane_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./content-pane/content-pane.component */ "./src/app/content-pane/content-pane.component.ts");
/* harmony import */ var _central_area_central_area_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./central-area/central-area.component */ "./src/app/central-area/central-area.component.ts");
/* harmony import */ var _steps_steps_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./steps/steps.component */ "./src/app/steps/steps.component.ts");
/* harmony import */ var _modal_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modal.directive */ "./src/app/modal.directive.ts");
/* harmony import */ var _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./color-picker/color-picker.component */ "./src/app/color-picker/color-picker.component.ts");
/* harmony import */ var _load_load_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./load/load.component */ "./src/app/load/load.component.ts");
/* harmony import */ var _save_save_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./save/save.component */ "./src/app/save/save.component.ts");
/* harmony import */ var _preview_preview_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./preview/preview.component */ "./src/app/preview/preview.component.ts");
/* harmony import */ var _step_text_step_text_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./step-text/step-text.component */ "./src/app/step-text/step-text.component.ts");
/* harmony import */ var _text_editor_text_editor_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./text-editor/text-editor.component */ "./src/app/text-editor/text-editor.component.ts");
/* harmony import */ var _sub_super_alignment_sub_super_alignment_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./sub-super-alignment/sub-super-alignment.component */ "./src/app/sub-super-alignment/sub-super-alignment.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./step-options/step-options.component */ "./src/app/step-options/step-options.component.ts");
/* harmony import */ var _term_template_term_template_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./term-template/term-template.component */ "./src/app/term-template/term-template.component.ts");
/* harmony import */ var _font_settings_font_settings_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./font-settings/font-settings.component */ "./src/app/font-settings/font-settings.component.ts");
/* harmony import */ var _custom_font_load_fail_custom_font_load_fail_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./custom-font-load-fail/custom-font-load-fail.component */ "./src/app/custom-font-load-fail/custom-font-load-fail.component.ts");
/* harmony import */ var _project_options_project_options_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./project-options/project-options.component */ "./src/app/project-options/project-options.component.ts");
/* harmony import */ var _quiz_configuration_quiz_configuration_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./quiz-configuration/quiz-configuration.component */ "./src/app/quiz-configuration/quiz-configuration.component.ts");
/* harmony import */ var _table_add_table_add_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./table-add/table-add.component */ "./src/app/table-add/table-add.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};























var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
                _tool_bar_tool_bar_component__WEBPACK_IMPORTED_MODULE_3__["ToolBarComponent"],
                _content_pane_content_pane_component__WEBPACK_IMPORTED_MODULE_4__["ContentPaneComponent"],
                _central_area_central_area_component__WEBPACK_IMPORTED_MODULE_5__["CentralAreaComponent"],
                _steps_steps_component__WEBPACK_IMPORTED_MODULE_6__["StepsComponent"],
                _modal_directive__WEBPACK_IMPORTED_MODULE_7__["ModalDirective"],
                _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_8__["ColorPickerComponent"],
                _load_load_component__WEBPACK_IMPORTED_MODULE_9__["LoadComponent"],
                _save_save_component__WEBPACK_IMPORTED_MODULE_10__["SaveComponent"],
                _preview_preview_component__WEBPACK_IMPORTED_MODULE_11__["PreviewComponent"],
                _step_text_step_text_component__WEBPACK_IMPORTED_MODULE_12__["StepTextComponent"],
                _text_editor_text_editor_component__WEBPACK_IMPORTED_MODULE_13__["TextEditorComponent"],
                _sub_super_alignment_sub_super_alignment_component__WEBPACK_IMPORTED_MODULE_14__["SubSuperAlignmentComponent"],
                _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__["StepOptionsComponent"],
                _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__["CloneContainerDirective"],
                _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__["MergeContainerDirective"],
                _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__["EvalContainerDirective"],
                _term_template_term_template_component__WEBPACK_IMPORTED_MODULE_17__["TermTemplateComponent"],
                _font_settings_font_settings_component__WEBPACK_IMPORTED_MODULE_18__["FontSettingsComponent"],
                _custom_font_load_fail_custom_font_load_fail_component__WEBPACK_IMPORTED_MODULE_19__["CustomFontLoadFailComponent"],
                _project_options_project_options_component__WEBPACK_IMPORTED_MODULE_20__["ProjectOptionsComponent"],
                _quiz_configuration_quiz_configuration_component__WEBPACK_IMPORTED_MODULE_21__["QuizConfigurationComponent"],
                _table_add_table_add_component__WEBPACK_IMPORTED_MODULE_22__["TableAddComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_15__["FormsModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]],
            entryComponents: [
                _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_8__["ColorPickerComponent"],
                _load_load_component__WEBPACK_IMPORTED_MODULE_9__["LoadComponent"],
                _save_save_component__WEBPACK_IMPORTED_MODULE_10__["SaveComponent"],
                _preview_preview_component__WEBPACK_IMPORTED_MODULE_11__["PreviewComponent"],
                _text_editor_text_editor_component__WEBPACK_IMPORTED_MODULE_13__["TextEditorComponent"],
                _sub_super_alignment_sub_super_alignment_component__WEBPACK_IMPORTED_MODULE_14__["SubSuperAlignmentComponent"],
                _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_16__["StepOptionsComponent"],
                _term_template_term_template_component__WEBPACK_IMPORTED_MODULE_17__["TermTemplateComponent"],
                _font_settings_font_settings_component__WEBPACK_IMPORTED_MODULE_18__["FontSettingsComponent"],
                _custom_font_load_fail_custom_font_load_fail_component__WEBPACK_IMPORTED_MODULE_19__["CustomFontLoadFailComponent"],
                _project_options_project_options_component__WEBPACK_IMPORTED_MODULE_20__["ProjectOptionsComponent"],
                _quiz_configuration_quiz_configuration_component__WEBPACK_IMPORTED_MODULE_21__["QuizConfigurationComponent"],
                _table_add_table_add_component__WEBPACK_IMPORTED_MODULE_22__["TableAddComponent"]
            ]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/central-area/CreatorCanvasController.ts":
/*!*********************************************************!*\
  !*** ./src/app/central-area/CreatorCanvasController.ts ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/layout/EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _shared_layout_VBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/VBox */ "../src/layout/VBox.ts");
/* harmony import */ var _shared_layout_HBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/layout/HBox */ "../src/layout/HBox.ts");
/* harmony import */ var _shared_layout_SubSuper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/SubSuper */ "../src/layout/SubSuper.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/layout/RootContainer */ "../src/layout/RootContainer.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _shared_layout_Quiz__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @shared/layout/Quiz */ "../src/layout/Quiz.ts");
/* harmony import */ var _shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @shared/layout/TableContainer */ "../src/layout/TableContainer.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _CreatorComponentModel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./CreatorComponentModel */ "./src/app/central-area/CreatorComponentModel.ts");
/* harmony import */ var _CreatorHBox__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./CreatorHBox */ "./src/app/central-area/CreatorHBox.ts");
/* harmony import */ var _CreatorQuiz__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./CreatorQuiz */ "./src/app/central-area/CreatorQuiz.ts");
/* harmony import */ var _CreatorRootContainer__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./CreatorRootContainer */ "./src/app/central-area/CreatorRootContainer.ts");
/* harmony import */ var _CreatorSubSuper__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./CreatorSubSuper */ "./src/app/central-area/CreatorSubSuper.ts");
/* harmony import */ var _CreatorTable__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./CreatorTable */ "./src/app/central-area/CreatorTable.ts");
/* harmony import */ var _CreatorTightHBox__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./CreatorTightHBox */ "./src/app/central-area/CreatorTightHBox.ts");
/* harmony import */ var _CreatorVBox__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./CreatorVBox */ "./src/app/central-area/CreatorVBox.ts");
/* harmony import */ var _shared_layout_VCenterVBox__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @shared/layout/VCenterVBox */ "../src/layout/VCenterVBox.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();













// Imports that need to be included but aren't used directly









var CreatorCanvasController = /** @class */ (function (_super) {
    __extends(CreatorCanvasController, _super);
    function CreatorCanvasController(container, instructions, undoRedo, selection, step, error) {
        var _this = _super.call(this, container, instructions) || this;
        // Remove autoplay overlay if present
        if (_this.isAutoplay) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        // Remove lower area if present
        if (container.childElementCount >= 2) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        _this.undoRedo = undoRedo;
        _this.selection = selection;
        _this.step = step;
        _this.error = error;
        _this.redraw = _this.redraw.bind(_this);
        _this.delete = _this.delete.bind(_this);
        _this.selection.addSelectedOnCanvasListener(function () {
            if (_this.selection.selectedOnCanvas === undefined) {
                _this.selectedLayout = undefined;
            }
            _this.redraw();
        });
        _this.selection.canvasInstance = _this;
        _this.currStep = step.selected;
        // Second recalc after super constructor) needed because step is only updated here
        _this.recalc();
        // Don't allow going to next step
        _this.canvas.removeEventListener('click', _this.handleMouseClick);
        _this.canvas.removeEventListener('mousemove', _this.handleMouseMove);
        _this.originalInstructions = instructions;
        // Whether dragging or clicking, mouse up could mean add
        _this.onMoveOver = _this.onMoveOver.bind(_this);
        _this.onMouseUp = _this.onMouseUp.bind(_this);
        _this.canvas.addEventListener('click', _this.onMouseUp);
        _this.canvas.addEventListener('drop', function (e) {
            _this.onMouseUp(e);
            e.preventDefault();
        });
        _this.canvas.addEventListener('dragover', _this.onMoveOver);
        _this.canvas.addEventListener('dragenter', function (e) {
            e.preventDefault();
        });
        _this.canvas.setAttribute('droppable', 'true');
        return _this;
    }
    CreatorCanvasController.prototype.initComponents = function (instructions) {
        this.components = new _CreatorComponentModel__WEBPACK_IMPORTED_MODULE_12__["default"](instructions);
        this.components.setGenInfo('customColors', this.customColors);
        this.components.setGenInfo('fixedHeights', this.fixedHeights);
    };
    /**
     * Add an outer border to the currently selected
     * table.
     */
    CreatorCanvasController.prototype.tableAddOuterBorder = function () {
        var table = this.getSelectedLayout().component;
        var vLines = table.getVLines();
        var hLines = table.getHLines();
        var children = table.getChildren();
        // Add left border, if none
        if (!vLines[0]) {
            vLines[0] = this.components.addVDivider();
        }
        // Add right border, if none
        if (!vLines[children[0].length]) {
            vLines[children[0].length] = this.components.addVDivider();
        }
        // Add top border, if none
        if (!hLines[0]) {
            hLines[0] = this.components.addHDivider();
        }
        // Add bottom border, if none
        if (!hLines[children.length]) {
            hLines[children.length] = this.components.addHDivider();
        }
        // Save changes
        this.save();
    };
    /**
     * Add inner borders to the currently selected
     * table.
     */
    CreatorCanvasController.prototype.tableAddInnerBorder = function () {
        var table = this.getSelectedLayout().component;
        var vLines = table.getVLines();
        var hLines = table.getHLines();
        var children = table.getChildren();
        // Add each missing horizontal border
        for (var r = 1; r < children.length; r++) {
            if (!hLines[r]) {
                hLines[r] = this.components.addHDivider();
            }
        }
        // Add each missing vertical border
        for (var c = 1; c < children[0].length; c++) {
            if (!vLines[c]) {
                vLines[c] = this.components.addVDivider();
            }
        }
        this.save();
    };
    /**
     * Fires when mouse moved over canvas.
     * @param e The mouse event.
     */
    CreatorCanvasController.prototype.onMoveOver = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.selection.adding) {
            this.previewAdd(e.offsetX, e.offsetY);
        }
    };
    /**
     * Fires when mouse is released over the canvas.
     * @param e The mouse event.
     */
    CreatorCanvasController.prototype.onMouseUp = function (e) {
        if (this.selection.adding) {
            this.finalizeAdd(e.offsetX, e.offsetY);
        }
        else {
            e.stopPropagation();
            this.select(e.offsetX, e.offsetY);
        }
    };
    CreatorCanvasController.prototype.redraw = function () {
        var _this = this;
        _super.prototype.redraw.call(this);
        this.currStates.forEach(function (l) {
            if (l.component instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                l.component.creatorDraw(l, _this.ctx);
            }
            if (_this.selection) {
                if (l.component instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_5__["default"] &&
                    l.component.getRef() === _this.selection.adding) {
                    // Highlight what's selected on the content pane.
                    _this.ctx.save();
                    _this.ctx.strokeStyle = '#2196F3';
                    _this.ctx.rect(l.tlx, l.tly, l.width, l.height);
                    _this.ctx.stroke();
                    _this.ctx.restore();
                }
                else if (l === _this.selectedLayout) {
                    _this.ctx.save();
                    _this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    _this.ctx.fillRect(l.tlx, l.tly, l.width, l.height);
                    _this.ctx.restore();
                }
            }
        });
    };
    /**
     * Recalculates and redraws the current step.
     * Override to store the root layout for later.
     */
    CreatorCanvasController.prototype.recalc = function () {
        var _a;
        // Whenever we recalc, the selection becomes invalid as we have new
        // layout states.
        if (this.selection) {
            this.selection.selectedOnCanvas = undefined;
            this.selectedLayout = undefined;
        }
        var rootLayout;
        _a = this.calcLayout(this.currStep, true), this.currStates = _a[0], rootLayout = _a[1];
        this.rootContainer = rootLayout.component;
        var _b = this.getSize(rootLayout), width = _b[0], height = _b[1];
        this.setSize(width, height);
        this.redraw();
    };
    /**
     * Add something at (x, y) and save the new state.
     * @param x X-ordinate of mouse
     * @param y Y-ordinate of mouse
     */
    CreatorCanvasController.prototype.finalizeAdd = function (x, y) {
        var newLayout = this.getChangedLayout(x, y, true);
        this.undoRedo.publishChange(newLayout);
        this.selection.adding = undefined;
    };
    /**
     * Add something at (x, y), but show a preview without saving the state.
     * @param x X-ordinate of mouse.
     * @param y Y-ordinate of mouse.
     */
    CreatorCanvasController.prototype.previewAdd = function (x, y) {
        var _a;
        var newLayout = this.getChangedLayout(x, y, false);
        var realSteps = this.steps;
        this.steps = newLayout.steps;
        _super.prototype.recalc.call(this, true);
        this.steps = realSteps;
        var newRootState;
        _a = this.calcLayout(this.currStep, true), this.currStates = _a[0], newRootState = _a[1];
        this.rootContainer = newRootState.component;
    };
    /**
     * Get the new layout resulting from adding something at (x, y)
     * @param x The x-ordinate of the mouse.
     * @param y The y-ordinate of the mouse.
     * @param final Whether this is a final add. If it is, errors are shown
     *              and some content may be automatically added.
     */
    CreatorCanvasController.prototype.getChangedLayout = function (x, y, final) {
        var modifyWith = function (instructions) { };
        // Check if the content is already on the canvas
        if (this.onCanvas()) {
            if (final) {
                this.error.text = 'Duplicate content not allowed in a step.';
            }
            return this.getLayoutForPublish(modifyWith);
        }
        var clickedLayout = this.getClickedLayout(x, y);
        if (clickedLayout === undefined) {
            // Didn't click on anything
            return this.getLayoutForPublish(modifyWith);
        }
        else if (clickedLayout.component instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            try {
                // Add adjacent to content
                var container = clickedLayout.layoutParent.component;
                var toAdd = this.getAddComponent();
                container.addClickOnChild(clickedLayout, x, y, toAdd);
                if (final) {
                    modifyWith = this.autoAddContent(toAdd);
                }
            }
            catch (e) {
                if (final) {
                    this.error.text = e.message;
                }
            }
        }
        else if (clickedLayout.component instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            try {
                var toAdd = this.getAddComponent();
                clickedLayout.component.addClick(clickedLayout, x, y, toAdd);
                if (final) {
                    modifyWith = this.autoAddContent(toAdd);
                }
            }
            catch (e) {
                console.error(e);
                if (final) {
                    this.error.text = e.message;
                }
            }
        }
        else {
            return this.getLayoutForPublish(modifyWith);
        }
        return this.getLayoutForPublish(modifyWith);
    };
    /**
     * Get the current layout in the format
     * that can be published.
     * @param modifyWith A function to modify the instructions with after the step has been changed.
     */
    CreatorCanvasController.prototype.getLayoutForPublish = function (modifyWith) {
        var newStepLayout = this.rootContainer.toStepLayout(this);
        var origInstructionsClone = Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["deepClone"])(this.originalInstructions);
        origInstructionsClone.steps[this.currStep].root = newStepLayout;
        modifyWith(origInstructionsClone);
        return origInstructionsClone;
    };
    /**
     * When a final add happens, automatically
     * add content to what was added if appropriate.
     * Returns a function that will be passed the
     * instructions object after the add. This can
     * be used to add the content.
     * @param addTo The component being added.
     */
    CreatorCanvasController.prototype.autoAddContent = function (addTo) {
        if (addTo instanceof _shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_7__["default"]) {
            // Add a radical automatically.
            // Look for a radical not used on the
            // current step, next step, or previous
            // step.
            var currState = this.undoRedo.getState();
            var currStep = currState.steps[this.step.selected];
            var nextStep = currState.steps[this.step.selected + 1];
            var prevStep = currState.steps[this.step.selected - 1];
            var unusedRef = void 0;
            for (var i = 0; i < currState.radicals; i++) {
                var ref = 'r' + i;
                var inCurr = currStep && Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["inLayout"])(currStep.root, ref);
                var inNext = nextStep && Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["inLayout"])(nextStep.root, ref);
                var inPrev = prevStep && Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["inLayout"])(prevStep.root, ref);
                if (!(inCurr || inNext || inPrev)) {
                    // Found an unused ref
                    unusedRef = ref;
                    break;
                }
            }
            if (unusedRef) {
                // Use a previously created radical, no need to add one in instructions.
                addTo.setRadical(this.components.getContent(unusedRef));
                return function () { };
            }
            else {
                // No radicals, or all used in adjacent steps.
                var newRef = 'r' + this.components.numRadicals();
                // Dummy radical, but doesn't matter. Contents of the
                // container are serialized then re-created with the
                // modifed instructions.
                var dummyRadForSave = new _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_8__["default"](newRef);
                addTo.setRadical(dummyRadForSave);
                return function (instructions) {
                    if (!instructions.radicals) {
                        instructions.radicals = 0;
                    }
                    instructions.radicals++;
                };
            }
        }
        else {
            return function () { };
        }
    };
    /**
     * Given clicked coordinates, find
     * the layout that was clicked. If not
     * found, returns undefined.
     * @param x X-ordinate on the canvas.
     * @param y Y-ordinate on the canvas.
     */
    CreatorCanvasController.prototype.getClickedLayout = function (x, y) {
        var clicked;
        this.currStates.forEach(function (currState) {
            if (!clicked && currState.contains(x, y)) {
                clicked = currState;
            }
        });
        return clicked;
    };
    /**
     * Whether the component to be added
     * is already on the canvas.
     */
    CreatorCanvasController.prototype.onCanvas = function () {
        // Duplicate containers allowed
        if (this.selection.addingContainer()) {
            return false;
        }
        return Object(_helpers__WEBPACK_IMPORTED_MODULE_6__["inLayout"])(this.steps[this.currStep].root, this.selection.adding);
    };
    /**
     * Select something at (x, y)
     * @param x X-ordinate of mouse.
     * @param y Y-ordinate of mouse.
     */
    CreatorCanvasController.prototype.select = function (x, y) {
        var _this = this;
        var selectedLayout = this.getClickedLayout(x, y);
        if (!selectedLayout) {
            return;
        }
        var selectedComponent = selectedLayout.component;
        var select = function (ref) {
            _this.selectedLayout = selectedLayout;
            _this.selection.selectedOnCanvas = ref;
        };
        if (selectedComponent instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            if (selectedComponent instanceof _CreatorTightHBox__WEBPACK_IMPORTED_MODULE_18__["default"]) {
                select('c2');
            }
            else if (selectedComponent instanceof _shared_layout_HBox__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                select('c0');
            }
            else if (selectedComponent instanceof _shared_layout_Quiz__WEBPACK_IMPORTED_MODULE_9__["default"]) {
                select('c5');
            }
            else if (selectedComponent instanceof _shared_layout_VBox__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                select('c1');
            }
            else if (selectedComponent instanceof _shared_layout_SubSuper__WEBPACK_IMPORTED_MODULE_4__["default"]) {
                select('c4');
            }
            else if (selectedComponent instanceof _shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_7__["default"]) {
                select('c3');
            }
            else if (selectedComponent instanceof _shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_10__["default"]) {
                select('c6');
            }
            else {
                throw new Error('Unrecognized container selected.');
            }
        }
        else if (selectedComponent instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            select(selectedComponent.getRef());
        }
    };
    /**
     * Delete the currently selected component.
     * @param state The layout state generated by a component.
     */
    CreatorCanvasController.prototype.delete = function () {
        var parent = this.selectedLayout.layoutParent.component;
        parent.delete(this.selectedLayout.component);
        var newLayout = this.getLayoutForPublish(function () { });
        this.undoRedo.publishChange(newLayout);
    };
    /**
     * Return whether something is selected
     * and it can be deleted.
     */
    CreatorCanvasController.prototype.canDelete = function () {
        return this.selectedLayout &&
            this.selectedLayout.layoutParent &&
            !(this.selectedLayout.layoutParent.component instanceof _shared_layout_SubSuper__WEBPACK_IMPORTED_MODULE_4__["default"]) &&
            !(this.selectedLayout.layoutParent.component instanceof _shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_7__["default"] && this.selectedLayout.component instanceof _shared_layout_HBox__WEBPACK_IMPORTED_MODULE_3__["default"]);
    };
    /**
     * Returns the thing to add as a component.
     */
    CreatorCanvasController.prototype.getAddComponent = function () {
        if (this.selection.addingContainer()) {
            // Adding a container
            return this.components.parseContainer(this.selection.getContainer(), 0);
        }
        else {
            return this.components.getContent(this.selection.adding);
        }
    };
    /**
     * Apply color and opacity to the currently
     * selected component. If content is selected,
     * just applies to that content. If a container
     * is selected, applies to all content contained
     * within it.
     * @param opacity The opacity to apply.
     * @param colorName The name of the color to apply.
     */
    CreatorCanvasController.prototype.applyColorAndOpacity = function (opacity, colorName) {
        var _this = this;
        var selected = this.selectedLayout.component;
        var newState = this.undoRedo.getStateClone();
        var step = newState.steps[this.currStep];
        if (selected instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            this.applyColor(selected, colorName, step);
            this.applyOpacity(selected, opacity, step);
        }
        else if (selected instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            selected.forEachUnder(function (content) {
                _this.applyColor(content, colorName, step);
                _this.applyOpacity(content, opacity, step);
            });
        }
        this.undoRedo.publishChange(newState);
    };
    /**
     * Applies color to a particular piece of content.
     * @param content The content to apply color to.
     * @param colorName The name of the color.
     * @param stepObj The step object to apply to.
     */
    CreatorCanvasController.prototype.applyColor = function (content, colorName, stepObj) {
        if (stepObj.color === undefined) {
            stepObj.color = {};
        }
        var ref = content.getRef();
        if (colorName === 'default') {
            // Remove any color already set for this content
            delete stepObj.color[ref];
            if (Object.keys(stepObj.color).length === 0) {
                // Empty colors, delete as well
                delete stepObj.color;
            }
        }
        else {
            stepObj.color[ref] = colorName;
        }
    };
    /**
     * Applies opacity to a particular piece of content.
     * @param content The content to apply opacity to.
     * @param opacity The opacity to apply.
     * @param stepObj The step object to apply to.
     */
    CreatorCanvasController.prototype.applyOpacity = function (content, opacity, stepObj) {
        if (stepObj.opacity === undefined) {
            stepObj.opacity = {};
        }
        var ref = content.getRef();
        if (opacity === _shared_main_consts__WEBPACK_IMPORTED_MODULE_11__["normalOpacity"]) {
            // Remove any opacity already set for this content
            delete stepObj.opacity[ref];
            if (Object.keys(stepObj.opacity).length === 0) {
                // Empty opacity, delete as well
                delete stepObj.opacity;
            }
        }
        else {
            stepObj.opacity[ref] = opacity;
        }
    };
    /**
     * Change the currently showing step.
     * @param newStep The new step to show.
     */
    CreatorCanvasController.prototype.showStep = function (newStep) {
        this.currStep = newStep;
        this.recalc();
    };
    /**
     * Return the step layout of the currently
     * selected container.
     */
    CreatorCanvasController.prototype.getStepLayoutOfSelected = function () {
        var container = this.selectedLayout.component;
        return container.toStepLayout(this);
    };
    /**
     * Get the currently selected layout state.
     */
    CreatorCanvasController.prototype.getSelectedLayout = function () {
        return this.selectedLayout;
    };
    /**
     * Create a new state with the changes
     * made to this canvas saved.
     */
    CreatorCanvasController.prototype.save = function () {
        var newState = this.undoRedo.getStateClone();
        newState.steps[this.step.selected].root = this.rootContainer.toStepLayout(this);
        newState.hDividers = this.components.numHDividers();
        newState.vDividers = this.components.numVDividers();
        this.undoRedo.publishChange(newState);
    };
    return CreatorCanvasController;
}(_shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorCanvasController);


/***/ }),

/***/ "./src/app/central-area/CreatorComponentModel.ts":
/*!*******************************************************!*\
  !*** ./src/app/central-area/CreatorComponentModel.ts ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/layout/HDivider */ "../src/layout/HDivider.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/layout/VDivider */ "../src/layout/VDivider.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var CreatorComponentModel = /** @class */ (function (_super) {
    __extends(CreatorComponentModel, _super);
    function CreatorComponentModel(file) {
        var _this = _super.call(this, file) || this;
        var hDividers = _this.content.get('h');
        var numHDividers = hDividers.length;
        hDividers.length = 0;
        for (var i = 0; i < numHDividers; i++) {
            hDividers.push(new _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_1__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorHDividerPadding"], 'h' + i));
        }
        var vDividers = _this.content.get('v');
        var numVDividers = vDividers.length;
        vDividers.length = 0;
        for (var i = 0; i < numVDividers; i++) {
            vDividers.push(new _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_3__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorVDividerPadding"], 'v' + i));
        }
        return _this;
    }
    CreatorComponentModel.prototype.addVDivider = function () {
        var vDividers = this.content.get('v');
        var newDivider = new _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_3__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["vDividerPadding"], 'v' + vDividers.length);
        vDividers.push(newDivider);
        return newDivider;
    };
    CreatorComponentModel.prototype.addHDivider = function () {
        var hDividers = this.content.get('h');
        var newDivider = new _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_1__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["hDividerPadding"], 'h' + hDividers.length);
        hDividers.push(newDivider);
        return newDivider;
    };
    /**
     * Return the amount of radicals there are currently.
     */
    CreatorComponentModel.prototype.numRadicals = function () {
        return this.content.get('r').length;
    };
    /**
     * Return the amount of v dividers there are currently.
     */
    CreatorComponentModel.prototype.numVDividers = function () {
        return this.content.get('v').length;
    };
    /**
     * Return the amount of h dividers there are currently.
     */
    CreatorComponentModel.prototype.numHDividers = function () {
        return this.content.get('h').length;
    };
    /**
     * Parse a container object recursively and return its
     * class representation.
     * Override to prefix the type with 'creator-' to
     * allow customization of behavior.
     * @param containerObj The container object to parse.
     * @param depth The depth in the container hierarchy.
     */
    CreatorComponentModel.prototype.parseContainer = function (containerObj, depth) {
        return _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_0__["containerParsers"]['creator-' + containerObj.type](containerObj, depth, this.getContent, this.parseContainer, this.genInfo);
    };
    return CreatorComponentModel;
}(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_0__["ComponentModel"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorComponentModel);


/***/ }),

/***/ "./src/app/central-area/CreatorContainerMethods.ts":
/*!*********************************************************!*\
  !*** ./src/app/central-area/CreatorContainerMethods.ts ***!
  \*********************************************************/
/*! exports provided: creatorContainerAddClick, creatorContainerCreatorDraw, childrenToStepLayout, linearContainerAddBefore, linearContainerAddAfter, linearContainerForEachUnder, linearContainerDelete */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorContainerAddClick", function() { return creatorContainerAddClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "creatorContainerCreatorDraw", function() { return creatorContainerCreatorDraw; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "childrenToStepLayout", function() { return childrenToStepLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearContainerAddBefore", function() { return linearContainerAddBefore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearContainerAddAfter", function() { return linearContainerAddAfter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearContainerForEachUnder", function() { return linearContainerForEachUnder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "linearContainerDelete", function() { return linearContainerDelete; });
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/layout/EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");




/**
 * Default methods for those declared in CreatorContainer.
 */
function creatorContainerAddClick(clickedLayout, x, y, toAdd) {
    var parentLayout = clickedLayout.layoutParent;
    if (!parentLayout) {
        // Can't add, no parent container
        return;
    }
    var container = parentLayout.component;
    if (container.addVertically()) {
        // Add on top or bottom
        if (clickedLayout.onTop(y)) {
            // Add before this
            container.addBefore(toAdd, this);
        }
        else {
            // Add after this
            container.addAfter(toAdd, this);
        }
    }
    else if (container.addHorizontally()) {
        // Add on left or right
        if (clickedLayout.onLeft(x)) {
            // Add before this
            container.addBefore(toAdd, this);
        }
        else {
            // Add after this
            container.addAfter(toAdd, this);
        }
    }
    else {
        // Can't add inside this type of container
        return;
    }
}
function creatorContainerCreatorDraw(l, ctx) {
    var parentLayout = l.layoutParent;
    if (!parentLayout) {
        return;
    }
    var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorContainerPadding"].scale(l.scale);
    var container = parentLayout.component;
    if (container.addVertically()) {
        // Add carets on top and bottom facing outwards
        ctx.save();
        ctx.fillStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretFillStyleLighter"];
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top / 4);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_0__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.bottom / 4);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_0__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.restore();
    }
    else if (container.addHorizontally()) {
        // Add carets on left and right facing outwards
        ctx.save();
        ctx.fillStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretFillStyleLighter"];
        ctx.save();
        ctx.translate(l.tlx + pad.left / 4, l.tly + l.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_0__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(l.tlx + l.width - pad.right / 4, l.tly + l.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_0__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.restore();
    }
}
/**
 * Returns an array of children of a container
 * as used in the step layout.
 * @param children The children array.
 * @param controller The canvas controller possessing this container.
 */
function childrenToStepLayout(children, controller) {
    var toReturn = [];
    children.forEach(function (comp) {
        if (comp instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            toReturn.push(comp.toStepLayout(controller));
        }
        else if (comp instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            toReturn.push(comp.getRef());
        }
        else {
            throw new Error('unrecognized type');
        }
    });
    return toReturn;
}
function linearContainerAddBefore(toAdd, before) {
    this.addValid(toAdd);
    var index = this.children.indexOf(before);
    this.children.splice(index, 0, toAdd);
}
function linearContainerAddAfter(toAdd, after) {
    this.addValid(toAdd);
    var index = this.children.indexOf(after);
    this.children.splice(index + 1, 0, toAdd);
}
function linearContainerForEachUnder(forEach) {
    this.children.forEach(function (child) {
        if (child instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__["default"]) {
            // Run the function
            forEach(child);
        }
        else if (child instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_1__["default"]) {
            child.forEachUnder(forEach);
        }
        else {
            throw new Error('unrecognized component type');
        }
    });
}
function linearContainerDelete(toDelete) {
    this.children.splice(this.children.indexOf(toDelete), 1);
}


/***/ }),

/***/ "./src/app/central-area/CreatorHBox.ts":
/*!*********************************************!*\
  !*** ./src/app/central-area/CreatorHBox.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_HBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/HBox */ "../src/layout/HBox.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/HDivider */ "../src/layout/HDivider.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var CreatorHBox = /** @class */ (function (_super) {
    __extends(CreatorHBox, _super);
    function CreatorHBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerDelete"];
        _this.forEachUnder = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerForEachUnder"];
        _this.addBefore = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerAddBefore"];
        _this.addAfter = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerAddAfter"];
        return _this;
    }
    CreatorHBox_1 = CreatorHBox;
    CreatorHBox.prototype.addVertically = function () {
        return false;
    };
    CreatorHBox.prototype.addHorizontally = function () {
        return true;
    };
    CreatorHBox.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerStroke"];
        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();
        var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"].scale(l.scale);
        // Horizontal lines
        var x1 = l.tlx + pad.left / 2;
        var x2 = l.tlx + l.width - pad.right / 2;
        var y1 = l.tly + pad.top / 2;
        var y2 = l.tly + l.height - pad.bottom / 2;
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(x1, y1, x2, y1, ctx);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(x1, y2, x2, y2, ctx);
        // Carets
        ctx.fillStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretFillStyle"];
        ctx.save();
        ctx.translate(l.tlx + pad.left * 0.75, l.tly + l.height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(l.tlx + l.width - pad.right * 0.75, l.tly + l.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], ctx);
        ctx.restore();
        // Carets that depend on parent
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerCreatorDraw"].call(this, l, ctx);
        ctx.restore();
    };
    CreatorHBox.prototype.addClick = function (l, x, y, toAdd) {
        var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"].scale(l.scale);
        // Make fake layout states to use like rectangles
        var innerLeft = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, l.tlx + pad.left / 2, l.tly + pad.top / 2, pad.width() / 4, l.height - pad.height() / 2, 1);
        var innerRight = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, l.tlx + l.width - pad.right, l.tly + pad.top / 2, pad.width() / 4, l.height - pad.height() / 2, 1);
        if (innerLeft.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        }
        else if (innerRight.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        }
        else {
            _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerAddClick"].call(this, l, x, y, toAdd);
        }
    };
    CreatorHBox.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        this.addValid(toAdd);
        if (clickedLayout.onLeft(x)) {
            // Add left
            this.addBefore(toAdd, clickedLayout.component);
        }
        else {
            // Add right
            this.addAfter(toAdd, clickedLayout.component);
        }
    };
    CreatorHBox.prototype.addValid = function (toAdd) {
        if (toAdd instanceof _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__["default"]) {
            throw new Error('Fraction lines can only be added inside a vertical container.');
        }
        if (toAdd instanceof _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            throw new Error('Radicals can only be added inside a root container.');
        }
    };
    CreatorHBox.prototype.toStepLayout = function (controller) {
        return {
            type: 'hbox',
            children: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["childrenToStepLayout"])(this.children, controller)
        };
    };
    var CreatorHBox_1;
    CreatorHBox = CreatorHBox_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__["Container"])({
            typeString: 'creator-hbox',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                // Return HBox from file
                var format = containerObj;
                return new CreatorHBox_1(Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["parseContainerChildren"])(format.children, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"]);
            }
        })
    ], CreatorHBox);
    return CreatorHBox;
}(_shared_layout_HBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorHBox);


/***/ }),

/***/ "./src/app/central-area/CreatorQuiz.ts":
/*!*********************************************!*\
  !*** ./src/app/central-area/CreatorQuiz.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_Quiz__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/Quiz */ "../src/layout/Quiz.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/layout/HDivider */ "../src/layout/HDivider.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var CreatorQuiz = /** @class */ (function (_super) {
    __extends(CreatorQuiz, _super);
    function CreatorQuiz() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.forEachUnder = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["linearContainerForEachUnder"];
        _this.addBefore = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["linearContainerAddBefore"];
        _this.addAfter = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["linearContainerAddAfter"];
        return _this;
    }
    CreatorQuiz_1 = CreatorQuiz;
    // Re-override to not account for extra spacing
    CreatorQuiz.prototype.calcHeight = function () {
        var totalHeight = 0;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var currChild = _a[_i];
            totalHeight += currChild.getHeight();
        }
        return totalHeight + this.padding.height();
    };
    CreatorQuiz.prototype.addHorizontally = function () {
        return false;
    };
    CreatorQuiz.prototype.addVertically = function () {
        return true;
    };
    CreatorQuiz.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerStroke"];
        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();
        var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"].scale(l.scale);
        // Vertical lines
        var y1 = l.tly + pad.top / 2;
        var y2 = l.tly + l.height - pad.bottom / 2;
        var x1 = l.tlx + pad.left / 2;
        var x2 = l.tlx + l.width - pad.right / 2;
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__["line"])(x1, y1, x1, y2, ctx);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__["line"])(x2, y1, x2, y2, ctx);
        // Carets
        ctx.fillStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretFillStyle"];
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top * 0.75);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.top * 0.75);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorCaretSize"], ctx);
        ctx.restore();
        // Carets that depend on parent
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["creatorContainerCreatorDraw"].call(this, l, ctx);
        ctx.restore();
    };
    CreatorQuiz.prototype.addClick = function (l, x, y, toAdd) {
        var realPad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"].scale(l.scale);
        // Create mock layout states to use like rectangles
        var innerTop = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](undefined, undefined, l.tlx + realPad.left / 2, l.tly + realPad.top / 2, l.width - realPad.width() / 2, realPad.height() / 4, 1);
        var innerBot = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](undefined, undefined, l.tlx + realPad.left / 2, l.tly + l.height - realPad.bottom, l.width - realPad.width() / 2, realPad.height() / 4, 1);
        if (innerTop.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
            this.answers = [];
        }
        else if (innerBot.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
            this.answers = [];
        }
        else {
            // Click wasn't on inner part, add adjacent to parent container.
            Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["creatorContainerAddClick"])(l, x, y, toAdd);
        }
    };
    CreatorQuiz.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        this.addValid(toAdd);
        if (clickedLayout.onTop(y)) {
            // Add top
            this.addBefore(toAdd, clickedLayout.component);
        }
        else {
            // Add bottom
            this.addAfter(toAdd, clickedLayout.component);
        }
        // Invalidate answers
        this.answers = [];
    };
    CreatorQuiz.prototype.addValid = function (toAdd) {
        if (toAdd instanceof _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_4__["default"]) {
            throw new Error('Radicals can only be added inside a root container.');
        }
        if (toAdd instanceof _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            throw new Error('Fraction Lines can only be added inside a vertical container.');
        }
    };
    CreatorQuiz.prototype.toStepLayout = function (controller) {
        // Convert back to saved answer format
        var saveAnswers = [];
        (this.saveAnswersAs ? this.saveAnswersAs : this.answers).forEach(function (val, index) {
            if (val) {
                saveAnswers.push(index);
            }
        });
        if (this.saveAnswersAs) {
            this.saveAnswersAs = undefined;
        }
        return {
            type: 'quiz',
            children: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["childrenToStepLayout"])(this.children, controller),
            answers: saveAnswers
        };
    };
    CreatorQuiz.prototype.delete = function (toDelete) {
        // Invalidate answers
        this.answers = [];
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["linearContainerDelete"].call(this, toDelete);
    };
    // Override to not add outlines or extra spacing
    CreatorQuiz.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_2__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var innerWidth = (this.getWidth() - this.padding.width()) * currScale;
        var upToY = tly + this.padding.top * currScale;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var currChild = _a[_i];
            var childWidth = currChild.getWidth() * currScale;
            // Position child in the middle horizontally
            var childTLX = (innerWidth - childWidth) / 2 + this.padding.left * currScale + tlx;
            var childLayout = currChild.addLayout(state, layouts, childTLX, upToY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
            upToY += childLayout.height;
        }
        layouts.set(this, state);
        return state;
    };
    /**
     * Save a value of answers the next time
     * toStepLayout is called.
     * @param answers The value to save.
     */
    CreatorQuiz.prototype.saveAnswers = function (answers) {
        this.saveAnswersAs = answers;
    };
    var CreatorQuiz_1;
    CreatorQuiz = CreatorQuiz_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_7__["Container"])({
            typeString: 'creator-quiz',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                var format = containerObj;
                return new CreatorQuiz_1(Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_3__["parseContainerChildren"])(format.children, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["creatorContainerPadding"], format.answers, _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["curvedOutlineDefaultOpacity"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["curvedOutlineColor"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["radioButtonDefaultOpacity"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["radioButtonColor"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["quizCorrectColor"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["quizIncorrectColor"]);
            }
        })
    ], CreatorQuiz);
    return CreatorQuiz;
}(_shared_layout_Quiz__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorQuiz);


/***/ }),

/***/ "./src/app/central-area/CreatorRootContainer.ts":
/*!******************************************************!*\
  !*** ./src/app/central-area/CreatorRootContainer.ts ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/RootContainer */ "../src/layout/RootContainer.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _CreatorHBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CreatorHBox */ "./src/app/central-area/CreatorHBox.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var CreatorRootContainer = /** @class */ (function (_super) {
    __extends(CreatorRootContainer, _super);
    function CreatorRootContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreatorRootContainer_1 = CreatorRootContainer;
    /**
     * When this container is clicked,
     * add a component to it at some
     * position. This default implementation
     * adds the component adjacent to this one
     * in the parent container of this container.
     * @param clickedLayout The layout state (generated by this container) that was clicked.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    CreatorRootContainer.prototype.addClick = function (l, x, y, toAdd) {
        var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerPadding"].scale(l.scale);
        // Make fake layout state to use like rectangles
        var inner = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, l.tlx + pad.left, l.tly + pad.top, l.width - pad.width(), l.height - pad.height(), 1);
        if (inner.contains(x, y)) {
            if (!(toAdd instanceof _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_2__["default"])) {
                throw new Error('Only Radicals can be added to a Root Container.');
            }
            this.radical = toAdd;
        }
        else {
            _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerAddClick"].call(this, l, x, y, toAdd);
        }
    };
    CreatorRootContainer.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerStroke"];
        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();
        ctx.restore();
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerCreatorDraw"].call(this, l, ctx);
    };
    /**
     * When one of this container's direct
     * children is clicked, add a component
     * adjacent to the clicked child.
     * @param clickedLayout The layout state generated by the child.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    CreatorRootContainer.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        return;
    };
    /**
     * Returns an object representing
     * the step layout that would generate
     * this container.
     */
    CreatorRootContainer.prototype.toStepLayout = function (controller) {
        var toReturn = {};
        toReturn.type = 'root';
        toReturn.idx = Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["childrenToStepLayout"])(this.index.getChildren(), controller);
        toReturn.arg = Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["childrenToStepLayout"])(this.argument.getChildren(), controller);
        if (this.radical) {
            toReturn.rad = this.radical.getRef();
        }
        return toReturn;
    };
    /**
     * Delete a child of this container.
     * @param toDelete The child to delete.
     */
    CreatorRootContainer.prototype.delete = function (toDelete) {
        if (toDelete === this.radical) {
            this.radical = undefined;
        }
    };
    /**
     * Runs a function for every piece of
     * content under this container.
     * @param forEach The function to run for content.
     */
    CreatorRootContainer.prototype.forEachUnder = function (forEach) {
        this.index.forEachUnder(forEach);
        this.argument.forEachUnder(forEach);
        if (this.radical) {
            forEach(this.radical);
        }
    };
    CreatorRootContainer.prototype.setRadical = function (newRadical) {
        this.radical = newRadical;
    };
    /**
     * Whether this container lays out components vertically
     * and more can be added.
     */
    CreatorRootContainer.prototype.addVertically = function () {
        return false;
    };
    /**
     * Whether this container lays out components horizontally
     * and more can be added.
     */
    CreatorRootContainer.prototype.addHorizontally = function () {
        return false;
    };
    /**
     * Add a child before another.
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    CreatorRootContainer.prototype.addBefore = function (toAdd, before) {
        return;
    };
    /**
     * Add a child after another.
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    CreatorRootContainer.prototype.addAfter = function (toAdd, after) {
        return;
    };
    var CreatorRootContainer_1;
    CreatorRootContainer = CreatorRootContainer_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__["Container"])({
            typeString: 'creator-root',
            parse: function (containerObj, depth, contentGetter, containerGetter, genInfo) {
                var format = containerObj;
                var idx = new _CreatorHBox__WEBPACK_IMPORTED_MODULE_6__["default"](Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_7__["parseContainerChildren"])(format.idx, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerPadding"]);
                var arg = new _CreatorHBox__WEBPACK_IMPORTED_MODULE_6__["default"](Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_7__["parseContainerChildren"])(format.arg, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerPadding"]);
                var radical;
                if (format.rad) {
                    radical = contentGetter(format.rad);
                }
                return new CreatorRootContainer_1(idx, arg, radical, _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerPadding"], genInfo.termHeights);
            }
        })
    ], CreatorRootContainer);
    return CreatorRootContainer;
}(_shared_layout_RootContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorRootContainer);


/***/ }),

/***/ "./src/app/central-area/CreatorSubSuper.ts":
/*!*************************************************!*\
  !*** ./src/app/central-area/CreatorSubSuper.ts ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_SubSuper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/SubSuper */ "../src/layout/SubSuper.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _CreatorHBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CreatorHBox */ "./src/app/central-area/CreatorHBox.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _CreatorTightHBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CreatorTightHBox */ "./src/app/central-area/CreatorTightHBox.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var CreatorSubSuper = /** @class */ (function (_super) {
    __extends(CreatorSubSuper, _super);
    function CreatorSubSuper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreatorSubSuper_1 = CreatorSubSuper;
    CreatorSubSuper.prototype.addVertically = function () {
        return false;
    };
    CreatorSubSuper.prototype.addHorizontally = function () {
        return false;
    };
    CreatorSubSuper.prototype.addBefore = function (e, b) {
        return;
    };
    CreatorSubSuper.prototype.addAfter = function (e, b) {
        return;
    };
    CreatorSubSuper.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorContainerStroke"];
        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();
        ctx.restore();
        Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["creatorContainerCreatorDraw"])(l, ctx);
    };
    CreatorSubSuper.prototype.addClick = function (clickedLayout, x, y, toAdd) {
        if (x - clickedLayout.tlx < this.padding.left * clickedLayout.scale) {
            var container = clickedLayout.layoutParent.component;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        }
        else if (clickedLayout.tlx + clickedLayout.width - x < this.padding.right * clickedLayout.scale) {
            var container = clickedLayout.layoutParent.component;
            container.addClickOnChild(clickedLayout, x, y, toAdd);
        }
        else {
            return;
        }
    };
    CreatorSubSuper.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        return;
    };
    CreatorSubSuper.prototype.toStepLayout = function (controller) {
        var toReturn = {
            type: 'subSuper',
            top: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["childrenToStepLayout"])(this.top.getChildren(), controller),
            middle: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["childrenToStepLayout"])(this.middle.getChildren(), controller),
            bottom: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["childrenToStepLayout"])(this.bottom.getChildren(), controller)
        };
        if (this.savePortrusionAs) {
            if (this.savePortrusionAs !== _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["defaultExpPortrusion"]) {
                toReturn.portrusion = this.savePortrusionAs;
            }
            this.savePortrusionAs = undefined;
        }
        else if (this.portrusionProportion !== _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["defaultExpPortrusion"]) {
            toReturn.portrusion = this.portrusionProportion;
        }
        return toReturn;
    };
    CreatorSubSuper.prototype.delete = function (toDelete) {
        throw new Error('Cannot delete children from a SubSuper container.');
    };
    CreatorSubSuper.prototype.forEachUnder = function (forEach) {
        this.top.forEachUnder(forEach);
        this.middle.forEachUnder(forEach);
        this.bottom.forEachUnder(forEach);
    };
    /**
     * Save this SubSuper as having
     * a particular portrusion proportion. The
     * next time toStepLayout is called, this
     * number will be saved, but this container
     * isn't considered to have the proportion.
     * @param saveAs What to save portrusion as.
     */
    CreatorSubSuper.prototype.savePortrusion = function (saveAs) {
        this.savePortrusionAs = saveAs;
    };
    var CreatorSubSuper_1;
    CreatorSubSuper = CreatorSubSuper_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_3__["Container"])({
            typeString: 'creator-subSuper',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                // Return subSuper from file
                var format = containerObj;
                var top = new _CreatorHBox__WEBPACK_IMPORTED_MODULE_4__["default"](Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.top, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorContainerPadding"]);
                var middle = new _CreatorTightHBox__WEBPACK_IMPORTED_MODULE_6__["default"](Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.middle, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorContainerPadding"]);
                var bottom = new _CreatorHBox__WEBPACK_IMPORTED_MODULE_4__["default"](Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["parseContainerChildren"])(format.bottom, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorContainerPadding"]);
                var portrusion = format.portrusion ? format.portrusion : _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["defaultExpPortrusion"];
                return new CreatorSubSuper_1(top, middle, bottom, portrusion, _shared_main_consts__WEBPACK_IMPORTED_MODULE_2__["creatorContainerPadding"]);
            }
        })
    ], CreatorSubSuper);
    return CreatorSubSuper;
}(_shared_layout_SubSuper__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorSubSuper);


/***/ }),

/***/ "./src/app/central-area/CreatorTable.ts":
/*!**********************************************!*\
  !*** ./src/app/central-area/CreatorTable.ts ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/TableContainer */ "../src/layout/TableContainer.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/layout/EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/HDivider */ "../src/layout/HDivider.ts");
/* harmony import */ var _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/layout/VDivider */ "../src/layout/VDivider.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _shared_layout_Padding__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @shared/layout/Padding */ "../src/layout/Padding.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};












var CreatorTable = /** @class */ (function (_super) {
    __extends(CreatorTable, _super);
    function CreatorTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreatorTable_1 = CreatorTable;
    /**
     * Return the mimimum dimension in either axis
     * for a table cell.
     */
    CreatorTable.prototype.getMinCellDimen = function () {
        return _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorTableMinCellDimen"];
    };
    CreatorTable.prototype.getHLines = function () {
        return this.hLines;
    };
    CreatorTable.prototype.getVLines = function () {
        return this.vLines;
    };
    CreatorTable.prototype.getChildren = function () {
        return this.children;
    };
    /**
     * When one of this container's direct
     * children is clicked, add a component
     * adjacent to the clicked child.
     * @param clickedLayout The layout state generated by the child.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    CreatorTable.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        // Not valid in any case
        return;
    };
    /**
     * Returns an object representing
     * the step layout that would generate
     * this container.
     */
    CreatorTable.prototype.toStepLayout = function (controller) {
        var _this = this;
        // Convert 2d array of components to 2d array to save
        var saveChildren = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var row = _a[_i];
            var rowArr = [];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var currChild = row_1[_b];
                if (currChild) {
                    if (currChild instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                        var stepLayout = currChild.toStepLayout(controller);
                        rowArr.push(stepLayout);
                    }
                    else if (currChild instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                        rowArr.push(currChild.getRef());
                    }
                }
                else {
                    rowArr.push(null);
                }
            }
            saveChildren.push(rowArr);
        }
        // Convert vLines to step format
        var saveVLines = {};
        Object.keys(this.vLines).forEach(function (index) {
            var component = _this.vLines[index];
            saveVLines[index] = component.getRef();
        });
        // Convert hLines to step format
        var saveHLines = {};
        Object.keys(this.hLines).forEach(function (index) {
            var component = _this.hLines[index];
            saveHLines[index] = component.getRef();
        });
        var toReturn = {
            type: 'table',
            children: saveChildren,
            vLines: saveVLines,
            hLines: saveHLines
        };
        return toReturn;
    };
    /**
     * Delete a child of this container.
     * @param toDelete The child to delete.
     */
    CreatorTable.prototype.delete = function (toDelete) {
        // Deleting always valid
        if (toDelete instanceof _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__["default"]) {
            // Find the hDivider and delete it
            for (var _i = 0, _a = Object.keys(this.hLines); _i < _a.length; _i++) {
                var index = _a[_i];
                var hDivider = this.hLines[index];
                if (hDivider === toDelete) {
                    // Found it
                    delete this.hLines[index];
                    return;
                }
            }
            throw new Error('HDivider not found');
        }
        else if (toDelete instanceof _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_5__["default"]) {
            // Find the vDivider and delete it
            for (var _b = 0, _c = Object.keys(this.vLines); _b < _c.length; _b++) {
                var index = _c[_b];
                var vDivider = this.vLines[index];
                if (vDivider === toDelete) {
                    // Found it
                    delete this.vLines[index];
                    return;
                }
            }
            throw new Error('VDivider not found');
        }
        else {
            // Must be in children array
            for (var _d = 0, _e = this.children; _d < _e.length; _d++) {
                var row = _e[_d];
                for (var c = 0; c < row.length; c++) {
                    var currChild = row[c];
                    if (currChild === toDelete) {
                        // Found it
                        row[c] = null;
                        return;
                    }
                }
            }
            throw new Error('Child not found');
        }
    };
    /**
     * Runs a function for every piece of
     * content under this container.
     * @param forEach The function to run for content.
     */
    CreatorTable.prototype.forEachUnder = function (forEach) {
        var _this = this;
        Object.keys(this.hLines).forEach(function (index) {
            // tslint:disable-next-line:no-shadowed-variable
            var line = _this.hLines[index];
            forEach(line);
        });
        Object.keys(this.vLines).forEach(function (index) {
            // tslint:disable-next-line:no-shadowed-variable
            var line = _this.vLines[index];
            forEach(line);
        });
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_2 = row; _b < row_2.length; _b++) {
                var currChild = row_2[_b];
                if (currChild) {
                    if (currChild instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                        forEach(currChild);
                    }
                    else if (currChild instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_3__["default"]) {
                        currChild.forEachUnder(forEach);
                    }
                }
            }
        }
    };
    /**
     * Whether this container lays out components vertically
     * and more can be added.
     */
    CreatorTable.prototype.addVertically = function () {
        return false;
    };
    /**
     * Whether this container lays out components horizontally
     * and more can be added.
     */
    CreatorTable.prototype.addHorizontally = function () {
        return false;
    };
    /**
     * Add a child before another.
     * @param toAdd The child to add.
     * @param before Add before this child.
     */
    CreatorTable.prototype.addBefore = function (toAdd, before) {
        return;
    };
    /**
     * Add a child after another.
     * @param toAdd The child to add.
     * @param after Add after this child.
     */
    CreatorTable.prototype.addAfter = function (toAdd, after) {
        return;
    };
    /**
     * When this container is clicked,
     * add a component to it at some
     * position. This default implementation
     * adds the component adjacent to this one
     * in the parent container of this container.
     * @param clickedLayout The layout state (generated by this container) that was clicked.
     * @param x The x-ordinate clicked.
     * @param y The y-ordinate clicked.
     * @param toAdd The component to add.
     */
    CreatorTable.prototype.addClick = function (clickedLayout, x, y, toAdd) {
        // Generate some fake layout states where children
        // or lines were NOT created.
        var emptyChildLayouts = [];
        var emptyVLineLayouts = [];
        var emptyHLineLayouts = [];
        var upToY = clickedLayout.tly + this.padding.top + this.getLineStroke();
        for (var r = 0; r < this.children.length; r++) {
            // Do the row
            var upToX = clickedLayout.tlx + this.padding.left + this.getLineStroke();
            var rowHeight = this.heights[r];
            // Add hline placeholder before row if there is one
            if (!this.hLines[r]) {
                emptyHLineLayouts[r] = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, clickedLayout.tlx + this.padding.left, upToY - this.getLineStroke(), clickedLayout.width - this.padding.width(), this.getLineStroke(), 1);
            }
            emptyChildLayouts[r] = [];
            for (var c = 0; c < this.children[r].length; c++) {
                // Do each column
                var colWidth = this.widths[c];
                // Add vline placeholder before column if there is one
                if (!this.vLines[c]) {
                    emptyVLineLayouts[c] = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, upToX - this.getLineStroke(), clickedLayout.tly + this.padding.top, this.getLineStroke(), clickedLayout.height - this.padding.height(), 1);
                }
                var currChild = this.children[r][c];
                if (!currChild) {
                    // Add child layout placeholder
                    emptyChildLayouts[r][c] = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, upToX, upToY, colWidth, rowHeight, 1);
                }
                upToX += colWidth + this.getLineStroke();
                // Add vline placeholder after last column if there is one
                if (c === this.children[r].length - 1 && !this.vLines[c + 1]) {
                    emptyVLineLayouts[c + 1] = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, upToX - this.getLineStroke(), clickedLayout.tly + this.padding.top, this.getLineStroke(), clickedLayout.height - this.padding.height(), 1);
                }
            }
            upToY += rowHeight + this.getLineStroke();
            // Add hline placeholder before row if there is one
            if (r === this.children.length - 1 && !this.hLines[r + 1]) {
                emptyHLineLayouts[r + 1] = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, clickedLayout.tlx + this.padding.left, upToY - this.getLineStroke(), clickedLayout.width - this.padding.width(), this.getLineStroke(), 1);
            }
        }
        // Check if the click was on any of the placeholders
        for (var r = 0; r < this.children.length; r++) {
            for (var c = 0; c < this.children[r].length; c++) {
                if (emptyChildLayouts[r][c] && emptyChildLayouts[r][c].contains(x, y)) {
                    // Click was on this placeholder
                    // Some content types not allowed
                    if (toAdd instanceof _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_8__["default"]) {
                        throw new Error('Cannot add that here');
                    }
                    else if (toAdd instanceof _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__["default"]) {
                        throw new Error('Cannot add that here');
                    }
                    else if (toAdd instanceof _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_5__["default"]) {
                        throw new Error('Cannot add that here');
                    }
                    this.children[r][c] = toAdd;
                    return;
                }
            }
        }
        // Check if the click was on any h lines
        for (var r = 0; r <= this.children.length; r++) {
            if (emptyHLineLayouts[r] && emptyHLineLayouts[r].contains(x, y)) {
                // Click was on this placeholder
                // Only an hLine is allowed to be added
                if (!(toAdd instanceof _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_4__["default"])) {
                    throw new Error('Only Horizontal Lines can be added here.');
                }
                this.hLines[r] = toAdd;
                return;
            }
        }
        // Check if the click was on any v lines
        for (var c = 0; c <= this.children[0].length; c++) {
            if (emptyVLineLayouts[c] && emptyVLineLayouts[c].contains(x, y)) {
                // Click was on this placeholder
                // Only an hLine is allowed to be added
                if (!(toAdd instanceof _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_5__["default"])) {
                    throw new Error('Only Vertical Lines can be added here.');
                }
                this.vLines[c] = toAdd;
                return;
            }
        }
        // If get to here, couldn't find anything else.
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_7__["creatorContainerAddClick"].call(this, clickedLayout, x, y, toAdd);
    };
    /**
     * Draws the container on the canvas,
     * only used in the creator. This default
     * implementation draws carets on the outer
     * half of the padding, depending on the
     * parent container.
     * @param l The layout of this container.
     * @param ctx The graphics context to draw to.
     */
    CreatorTable.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        // Draw an outline
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorContainerStroke"];
        ctx.strokeRect(l.tlx, l.tly, l.width, l.height);
        // If any lines are not present, draw them as dotted lines
        var hLinesToDraw = new Set();
        for (var r = 0; r <= this.children.length; r++) {
            if (!this.hLines[r]) {
                hLinesToDraw.add(r);
            }
        }
        var vLinesToDraw = new Set();
        for (var c = 0; c <= this.children[0].length; c++) {
            if (!this.vLines[c]) {
                vLinesToDraw.add(c);
            }
        }
        // Draw h lines
        ctx.save();
        ctx.setLineDash(_shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorLineDash"]);
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorContainerStroke"];
        var upToY = l.tly + this.padding.top;
        for (var r = 0; r <= this.children.length; r++) {
            if (hLinesToDraw.has(r)) {
                Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["line"])(l.tlx + this.padding.left, upToY + this.getLineStroke() / 2, l.tlx + l.width - this.padding.right, upToY + this.getLineStroke() / 2, ctx);
            }
            upToY += this.getLineStroke() + this.heights[r];
        }
        // Draw v lines
        var upToX = l.tlx + this.padding.left;
        for (var c = 0; c <= this.children[0].length; c++) {
            if (vLinesToDraw.has(c)) {
                Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["line"])(upToX + this.getLineStroke() / 2, l.tly + this.padding.top, upToX + this.getLineStroke() / 2, l.tly + l.height - this.padding.bottom, ctx);
            }
            upToX += this.getLineStroke() + this.widths[c];
        }
        ctx.restore();
        // Draw a small plus in the center of any cell not
        // occupied.
        upToY = l.tly + this.padding.top + this.getLineStroke();
        for (var r = 0; r < this.children.length; r++) {
            // Do the row
            upToX = l.tlx + this.padding.left + this.getLineStroke();
            var rowHeight = this.heights[r];
            for (var c = 0; c < this.children[r].length; c++) {
                // Do each column
                var colWidth = this.widths[c];
                var currChild = this.children[r][c];
                if (!currChild) {
                    // Draw plus
                    ctx.save();
                    ctx.translate(upToX + colWidth / 2, upToY + rowHeight / 2);
                    ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorContainerStroke"];
                    Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["line"])(-_shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorPlusLineHalfLength"], 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorPlusLineHalfLength"], 0, ctx);
                    Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["line"])(0, -_shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorPlusLineHalfLength"], 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorPlusLineHalfLength"], ctx);
                    ctx.restore();
                }
                upToX += colWidth + this.getLineStroke();
            }
            upToY += rowHeight + this.getLineStroke();
        }
        ctx.restore();
        // Carets that depend on parent
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_7__["creatorContainerCreatorDraw"].call(this, l, ctx);
    };
    var CreatorTable_1;
    CreatorTable = CreatorTable_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_10__["Container"])({
            typeString: 'creator-table',
            parse: function (containerObj, depth, contentGetter, containerGetter, inf) {
                // Not selectable
                var format = containerObj;
                return new CreatorTable_1(_shared_main_consts__WEBPACK_IMPORTED_MODULE_9__["creatorContainerPadding"], Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_0__["parseChildren2D"])(format.children, containerGetter, contentGetter), Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_0__["parseChildrenObj"])(format.hLines, contentGetter), Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_0__["parseChildrenObj"])(format.vLines, contentGetter), 11, _shared_layout_Padding__WEBPACK_IMPORTED_MODULE_11__["default"].even(0));
            }
        })
    ], CreatorTable);
    return CreatorTable;
}(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorTable);


/***/ }),

/***/ "./src/app/central-area/CreatorTightHBox.ts":
/*!**************************************************!*\
  !*** ./src/app/central-area/CreatorTightHBox.ts ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreatorHBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatorHBox */ "./src/app/central-area/CreatorHBox.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_layout_Term__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/Term */ "../src/layout/Term.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var widthDiff = _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["termPadding"].width() - _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["tightTermPadding"].width();
var CreatorTightHBox = /** @class */ (function (_super) {
    __extends(CreatorTightHBox, _super);
    function CreatorTightHBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CreatorTightHBox_1 = CreatorTightHBox;
    // Override to have right type
    CreatorTightHBox.prototype.toStepLayout = function (controller) {
        return {
            type: 'tightHBox',
            children: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_1__["childrenToStepLayout"])(this.children, controller)
        };
    };
    // Override to account for reduced width of tight terms.
    CreatorTightHBox.prototype.calcWidth = function () {
        var totalWidth = 0;
        var numTerms = 0;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var currChild = _a[_i];
            totalWidth += currChild.getWidth();
            if (currChild instanceof _shared_layout_Term__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                numTerms++;
            }
        }
        return totalWidth + this.padding.width() - numTerms * widthDiff;
    };
    // Override to reduce term padding.
    CreatorTightHBox.prototype.addLayout = function (parentLayout, layouts, tlx, tly, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent) {
        var state = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_3__["default"](parentLayout, this, tlx, tly, this.getWidth() * currScale, this.getHeight() * currScale, currScale);
        var innerHeight = (this.getHeight() - this.padding.height()) * currScale;
        var upToX = tlx + this.padding.left * currScale;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var currChild = _a[_i];
            var childHeight = currChild.getHeight() * currScale;
            // Position child in the middle vertically
            var childTLY = (innerHeight - childHeight) / 2 + this.padding.top * currScale + tly;
            var childLayout = currChild.addLayout(state, layouts, upToX, childTLY, currScale, opacityObj, colorsObj, mouseEnter, mouseExit, mouseClick, tempContent);
            if (currChild instanceof _shared_layout_Term__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                childLayout.tighten(widthDiff * currScale);
            }
            upToX += childLayout.width;
        }
        layouts.set(this, state);
        return state;
    };
    var CreatorTightHBox_1;
    CreatorTightHBox = CreatorTightHBox_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_5__["Container"])({
            typeString: 'creator-tightHBox',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                var format = containerObj;
                // Return HBox from file
                return new CreatorTightHBox_1(Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["parseContainerChildren"])(format.children, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_4__["creatorContainerPadding"]);
            }
        })
    ], CreatorTightHBox);
    return CreatorTightHBox;
}(_CreatorHBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorTightHBox);


/***/ }),

/***/ "./src/app/central-area/CreatorVBox.ts":
/*!*********************************************!*\
  !*** ./src/app/central-area/CreatorVBox.ts ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_layout_VBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/layout/VBox */ "../src/layout/VBox.ts");
/* harmony import */ var _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/animation/LayoutState */ "../src/animation/LayoutState.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreatorContainerMethods */ "./src/app/central-area/CreatorContainerMethods.ts");
/* harmony import */ var _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/Radical */ "../src/layout/Radical.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var CreatorVBox = /** @class */ (function (_super) {
    __extends(CreatorVBox, _super);
    function CreatorVBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.delete = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerDelete"];
        _this.forEachUnder = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerForEachUnder"];
        _this.addBefore = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerAddBefore"];
        _this.addAfter = _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["linearContainerAddAfter"];
        return _this;
    }
    CreatorVBox_1 = CreatorVBox;
    CreatorVBox.prototype.addHorizontally = function () {
        return false;
    };
    CreatorVBox.prototype.addVertically = function () {
        return true;
    };
    CreatorVBox.prototype.creatorDraw = function (l, ctx) {
        ctx.save();
        ctx.strokeStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorContainerStroke"];
        // Outer border
        ctx.beginPath();
        ctx.rect(l.tlx, l.tly, l.width, l.height);
        ctx.stroke();
        var pad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorContainerPadding"].scale(l.scale);
        // Vertical lines
        var y1 = l.tly + pad.top / 2;
        var y2 = l.tly + l.height - pad.bottom / 2;
        var x1 = l.tlx + pad.left / 2;
        var x2 = l.tlx + l.width - pad.right / 2;
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(x1, y1, x1, y2, ctx);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["line"])(x2, y1, x2, y2, ctx);
        // Carets
        ctx.fillStyle = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorCaretFillStyle"];
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + pad.top * 0.75);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorCaretSize"], ctx);
        ctx.restore();
        ctx.save();
        ctx.translate(l.tlx + l.width / 2, l.tly + l.height - pad.top * 0.75);
        ctx.rotate(Math.PI);
        ctx.scale(l.scale, l.scale);
        Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["tri"])(0, 0, _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorCaretSize"], _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorCaretSize"], ctx);
        ctx.restore();
        // Carets that depend on parent
        _CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerCreatorDraw"].call(this, l, ctx);
        ctx.restore();
    };
    CreatorVBox.prototype.addClick = function (l, x, y, toAdd) {
        var realPad = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorContainerPadding"].scale(l.scale);
        // Create mock layout states to use like rectangles
        var innerTop = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, l.tlx + realPad.left / 2, l.tly + realPad.top / 2, l.width - realPad.width() / 2, realPad.height() / 4, 1);
        var innerBot = new _shared_animation_LayoutState__WEBPACK_IMPORTED_MODULE_1__["default"](undefined, undefined, l.tlx + realPad.left / 2, l.tly + l.height - realPad.bottom, l.width - realPad.width() / 2, realPad.height() / 4, 1);
        if (innerTop.contains(x, y)) {
            // Add at start
            this.addValid(toAdd);
            this.children.unshift(toAdd);
        }
        else if (innerBot.contains(x, y)) {
            // Add at end
            this.addValid(toAdd);
            this.children.push(toAdd);
        }
        else {
            // Click wasn't on inner part, add adjacent to parent container.
            Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["creatorContainerAddClick"])(l, x, y, toAdd);
        }
    };
    CreatorVBox.prototype.addClickOnChild = function (clickedLayout, x, y, toAdd) {
        this.addValid(toAdd);
        if (clickedLayout.onTop(y)) {
            // Add top
            this.addBefore(toAdd, clickedLayout.component);
        }
        else {
            // Add bottom
            this.addAfter(toAdd, clickedLayout.component);
        }
    };
    CreatorVBox.prototype.addValid = function (toAdd) {
        if (toAdd instanceof _shared_layout_Radical__WEBPACK_IMPORTED_MODULE_4__["default"]) {
            throw new Error('Radicals can only be added inside a root container.');
        }
    };
    CreatorVBox.prototype.toStepLayout = function (controller) {
        return {
            type: 'vbox',
            children: Object(_CreatorContainerMethods__WEBPACK_IMPORTED_MODULE_3__["childrenToStepLayout"])(this.children, controller)
        };
    };
    var CreatorVBox_1;
    CreatorVBox = CreatorVBox_1 = __decorate([
        Object(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_6__["Container"])({
            typeString: 'creator-vbox',
            parse: function (containerObj, depth, contentGetter, containerGetter) {
                var format = containerObj;
                // Return VBox from file
                return new CreatorVBox_1(Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["parseContainerChildren"])(format.children, depth, containerGetter, contentGetter), _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["creatorContainerPadding"]);
            }
        })
    ], CreatorVBox);
    return CreatorVBox;
}(_shared_layout_VBox__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (CreatorVBox);


/***/ }),

/***/ "./src/app/central-area/central-area.component.css":
/*!*********************************************************!*\
  !*** ./src/app/central-area/central-area.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    overflow-y: scroll;\r\n    overflow-x: auto;\r\n    max-width: calc(100vw - 250px);\r\n    height: 100%;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2VudHJhbC1hcmVhL2NlbnRyYWwtYXJlYS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQiw4QkFBOEI7SUFDOUIsWUFBWTtBQUNoQiIsImZpbGUiOiJzcmMvYXBwL2NlbnRyYWwtYXJlYS9jZW50cmFsLWFyZWEuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNvdXRlciB7XHJcbiAgICBvdmVyZmxvdy15OiBzY3JvbGw7XHJcbiAgICBvdmVyZmxvdy14OiBhdXRvO1xyXG4gICAgbWF4LXdpZHRoOiBjYWxjKDEwMHZ3IC0gMjUwcHgpO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/central-area/central-area.component.html":
/*!**********************************************************!*\
  !*** ./src/app/central-area/central-area.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #outer id=\"outer\">\r\n    <app-step-text></app-step-text>\r\n    <div #eqContainer></div>\r\n</div>"

/***/ }),

/***/ "./src/app/central-area/central-area.component.ts":
/*!********************************************************!*\
  !*** ./src/app/central-area/central-area.component.ts ***!
  \********************************************************/
/*! exports provided: CentralAreaComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CentralAreaComponent", function() { return CentralAreaComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _CreatorCanvasController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CreatorCanvasController */ "./src/app/central-area/CreatorCanvasController.ts");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../error.service */ "./src/app/error.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CentralAreaComponent = /** @class */ (function () {
    function CentralAreaComponent(undoRedo, selection, step, error) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.step = step;
        this.error = error;
        this.undoRedo.subscribe(this.updateState.bind(this));
        this.step.subscribe(function (newStep) {
            _this.controller.showStep(newStep);
        });
        this.selection.addAddListener(function () {
            _this.controller.redraw();
        });
    }
    CentralAreaComponent.prototype.ngOnInit = function () {
    };
    CentralAreaComponent.prototype.ngAfterViewInit = function () {
        this.updateState(this.undoRedo.getState());
    };
    /**
     * Update the canvas when the state changes.
     * @param newState The new state to show.
     */
    CentralAreaComponent.prototype.updateState = function (newState) {
        var scrollBefore = this.containerEl.nativeElement.scrollTop;
        this.containerEl.nativeElement.innerHTML = '';
        this.selection.resetSelectedOnCanvasListeners();
        this.controller = new _CreatorCanvasController__WEBPACK_IMPORTED_MODULE_2__["default"](this.containerEl.nativeElement, newState, this.undoRedo, this.selection, this.step, this.error);
        this.containerEl.nativeElement.scrollTop = scrollBefore;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('eqContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], CentralAreaComponent.prototype, "containerEl", void 0);
    CentralAreaComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-central-area',
            template: __webpack_require__(/*! ./central-area.component.html */ "./src/app/central-area/central-area.component.html"),
            styles: [__webpack_require__(/*! ./central-area.component.css */ "./src/app/central-area/central-area.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _content_selection_service__WEBPACK_IMPORTED_MODULE_3__["ContentSelectionService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_4__["SelectedStepService"],
            _error_service__WEBPACK_IMPORTED_MODULE_5__["ErrorService"]])
    ], CentralAreaComponent);
    return CentralAreaComponent;
}());



/***/ }),

/***/ "./src/app/color-picker/color-picker.component.css":
/*!*********************************************************!*\
  !*** ./src/app/color-picker/color-picker.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#bottom-row {\r\n    display: flex;\r\n}\r\n\r\n.selector span {\r\n    line-height: 22px;\r\n    font-size: 18px;\r\n    vertical-align: middle;\r\n}\r\n\r\n.white {\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\n.black {\r\n    color: rgba(0, 0, 0, 0.8);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtBQUNqQjs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixlQUFlO0lBQ2Ysc0JBQXNCO0FBQzFCOztBQUVBO0lBQ0ksK0JBQStCO0FBQ25DOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCIiwiZmlsZSI6InNyYy9hcHAvY29sb3ItcGlja2VyL2NvbG9yLXBpY2tlci5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI2JvdHRvbS1yb3cge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxufVxyXG5cclxuLnNlbGVjdG9yIHNwYW4ge1xyXG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59XHJcblxyXG4ud2hpdGUge1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcclxufVxyXG5cclxuLmJsYWNrIHtcclxuICAgIGNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuOCk7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/color-picker/color-picker.component.html":
/*!**********************************************************!*\
  !*** ./src/app/color-picker/color-picker.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">OPACITY</div>\r\n<div>\r\n  <span class=\"selector\" *ngFor=\"let data of opacityData; let idx = index;\" [style.color]=\"data.color\" (click)=\"selectO(idx)\">\r\n    <span *ngIf=\"selectedOpacityIdx === idx\" class=\"material-icons tick white\">\r\n      check_circle_outline\r\n    </span>\r\n    {{ data.text }}\r\n  </span>\r\n</div>\r\n<div class=\"title\">COLOR</div>\r\n<div>\r\n  <span class=\"selector white\" *ngFor=\"let data of colorData; let idx = index;\" [style.backgroundColor]=\"data.color\" (click)=\"selectC(idx)\">\r\n    <span *ngIf=\"selectedColorIdx === idx\" class=\"material-icons tick\" [class.black]=\"data.text === 'Default'\">\r\n      check_circle_outline\r\n    </span>\r\n    <span [class.black]=\"data.text === 'Default'\">\r\n      {{ data.text }}\r\n    </span>\r\n  </span>\r\n</div>\r\n<div id=\"bottom-row\">\r\n  <div class=\"button\" (click)=\"apply();\">Apply</div>\r\n</div>"

/***/ }),

/***/ "./src/app/color-picker/color-picker.component.ts":
/*!********************************************************!*\
  !*** ./src/app/color-picker/color-picker.component.ts ***!
  \********************************************************/
/*! exports provided: ColorPickerComponent, SelectorData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ColorPickerComponent", function() { return ColorPickerComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectorData", function() { return SelectorData; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ColorPickerComponent = /** @class */ (function () {
    function ColorPickerComponent(selection, undoRedo, modal) {
        this.selection = selection;
        this.undoRedo = undoRedo;
        this.modal = modal;
        this.opacityData = [];
        this.colorData = [];
        this.opacityData = [
            new SelectorData('rgba(255, 255, 255, ' + _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["fadedOpacity"] + ')', 'Faded'),
            new SelectorData('rgba(255, 255, 255, ' + _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["normalOpacity"] + ')', 'Normal'),
            new SelectorData('rgba(255, 255, 255, ' + _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["focusedOpacity"] + ')', 'Focused')
        ];
        var colNames = Object.keys(_shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["colors"]);
        this.colorData = colNames
            .map(function (colName) {
            var colVal = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["colors"][colName];
            return new SelectorData('rgb(' + colVal[0] + ',' + colVal[1] + ',' + colVal[2] + ')', Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["cap"])(colName));
        });
        this.defaultColorIdx = colNames.indexOf('default');
        // Find the color and opacity of what's selected
        var selectedRef = this.selection.selectedOnCanvas;
        var state = this.undoRedo.getState();
        var step = state.steps[0];
        // If selected already has opacity, show it as selected
        if (step.opacity && step.opacity[selectedRef]) {
            var opacity = step.opacity[selectedRef];
            if (opacity === _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["fadedOpacity"]) {
                this.selectedOpacityIdx = 0;
            }
            else if (opacity === _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["focusedOpacity"]) {
                this.selectedOpacityIdx = 2;
            }
        }
        else {
            this.selectDefaultOpacity();
        }
        // If selected already has color, show it as selected
        if (step.color && step.color[selectedRef]) {
            var colName = step.color[selectedRef];
            this.selectedColorIdx = colNames.indexOf(colName);
        }
        else {
            this.selectDefaultColor();
        }
    }
    ColorPickerComponent.prototype.ngOnInit = function () {
    };
    /**
     * Select the default opacity.
     */
    ColorPickerComponent.prototype.selectDefaultOpacity = function () {
        this.selectedOpacityIdx = 1;
    };
    /**
     * Select an opacity using an index.
     * @param idx The index.
     */
    ColorPickerComponent.prototype.selectO = function (idx) {
        this.selectedOpacityIdx = idx;
    };
    /**
     * Select the default color.
     */
    ColorPickerComponent.prototype.selectDefaultColor = function () {
        this.selectedColorIdx = this.defaultColorIdx;
    };
    /**
     * Select a color using an index.
     * Automatically focus color, unless
     * the default color is selected.
     * @param idx The index.
     */
    ColorPickerComponent.prototype.selectC = function (idx) {
        this.selectedColorIdx = idx;
        if (idx === this.defaultColorIdx) {
            this.selectedOpacityIdx = 1;
        }
        else {
            this.selectedOpacityIdx = 2;
        }
    };
    /**
     * Apply the selected color
     * and opacity to whatever is
     * selected on the canvas.
     */
    ColorPickerComponent.prototype.apply = function () {
        var opacity;
        switch (this.selectedOpacityIdx) {
            case 0:
                opacity = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["fadedOpacity"];
                break;
            case 1:
                opacity = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["normalOpacity"];
                break;
            case 2:
                opacity = _shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["focusedOpacity"];
                break;
            default: throw new Error('Illegal selected opacity index.');
        }
        var colorName = Object.keys(_shared_main_consts__WEBPACK_IMPORTED_MODULE_5__["colors"])[this.selectedColorIdx];
        this.selection.canvasInstance.applyColorAndOpacity(opacity, colorName);
        this.modal.remove();
    };
    ColorPickerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-color-picker',
            template: __webpack_require__(/*! ./color-picker.component.html */ "./src/app/color-picker/color-picker.component.html"),
            styles: [__webpack_require__(/*! ./color-picker.component.css */ "./src/app/color-picker/color-picker.component.css")]
        }),
        __metadata("design:paramtypes", [_content_selection_service__WEBPACK_IMPORTED_MODULE_1__["ContentSelectionService"], _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__["UndoRedoService"], _modal_service__WEBPACK_IMPORTED_MODULE_3__["ModalService"]])
    ], ColorPickerComponent);
    return ColorPickerComponent;
}());

var SelectorData = /** @class */ (function () {
    function SelectorData(color, text) {
        this.color = color;
        this.text = text;
    }
    return SelectorData;
}());



/***/ }),

/***/ "./src/app/content-pane/content-pane.component.css":
/*!*********************************************************!*\
  !*** ./src/app/content-pane/content-pane.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    width: 250px;\r\n    border-left: 1px solid rgba(255, 255, 255, 0.1);\r\n    max-height: 100%;\r\n    overflow-x: auto;\r\n    color: rgba(255,255,255,0.9);\r\n}\r\n\r\n#inner {\r\n    padding: 7.5px;\r\n}\r\n\r\np {\r\n    font-size: 10px;\r\n    color: rgba(255,255,255,0.6);\r\n    text-align: center;\r\n    padding-top: 10px;\r\n    margin-bottom: -10px;\r\n}\r\n\r\n.selector span {\r\n    line-height: 22px;\r\n    font-size: 18px;\r\n    vertical-align: middle;\r\n}\r\n\r\n.selector span:hover {\r\n    background-color: rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.color {\r\n    border: 1px solid #2196F3;\r\n}\r\n\r\n.selected {\r\n    background-color: rgba(255, 255, 255, 0.25);\r\n}\r\n\r\n.grab {\r\n    cursor: -webkit-grab;\r\n    cursor: grab;\r\n}\r\n\r\n.more {\r\n    margin-left: 5px;\r\n}\r\n\r\n.material-icons {\r\n    cursor: pointer;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29udGVudC1wYW5lL2NvbnRlbnQtcGFuZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksWUFBWTtJQUNaLCtDQUErQztJQUMvQyxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLDRCQUE0QjtBQUNoQzs7QUFFQTtJQUNJLGNBQWM7QUFDbEI7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsNEJBQTRCO0lBQzVCLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0ksaUJBQWlCO0lBQ2pCLGVBQWU7SUFDZixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxvQ0FBb0M7QUFDeEM7O0FBRUE7SUFDSSx5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSwyQ0FBMkM7QUFDL0M7O0FBRUE7SUFDSSxvQkFBWTtJQUFaLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxlQUFlO0FBQ25CIiwiZmlsZSI6InNyYy9hcHAvY29udGVudC1wYW5lL2NvbnRlbnQtcGFuZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI291dGVyIHtcclxuICAgIHdpZHRoOiAyNTBweDtcclxuICAgIGJvcmRlci1sZWZ0OiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xyXG4gICAgbWF4LWhlaWdodDogMTAwJTtcclxuICAgIG92ZXJmbG93LXg6IGF1dG87XHJcbiAgICBjb2xvcjogcmdiYSgyNTUsMjU1LDI1NSwwLjkpO1xyXG59XHJcblxyXG4jaW5uZXIge1xyXG4gICAgcGFkZGluZzogNy41cHg7XHJcbn1cclxuXHJcbnAge1xyXG4gICAgZm9udC1zaXplOiAxMHB4O1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LDI1NSwyNTUsMC42KTtcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgIHBhZGRpbmctdG9wOiAxMHB4O1xyXG4gICAgbWFyZ2luLWJvdHRvbTogLTEwcHg7XHJcbn1cclxuXHJcbi5zZWxlY3RvciBzcGFuIHtcclxuICAgIGxpbmUtaGVpZ2h0OiAyMnB4O1xyXG4gICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxufVxyXG5cclxuLnNlbGVjdG9yIHNwYW46aG92ZXIge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG59XHJcblxyXG4uY29sb3Ige1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzIxOTZGMztcclxufVxyXG5cclxuLnNlbGVjdGVkIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4yNSk7XHJcbn1cclxuXHJcbi5ncmFiIHtcclxuICAgIGN1cnNvcjogZ3JhYjtcclxufVxyXG5cclxuLm1vcmUge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDVweDtcclxufVxyXG5cclxuLm1hdGVyaWFsLWljb25zIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/content-pane/content-pane.component.html":
/*!**********************************************************!*\
  !*** ./src/app/content-pane/content-pane.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n  <p>{{ getHelpText() }}</p>\r\n  <div id=\"inner\">\r\n    <div class=\"title\">CONTAINERS</div>\r\n    <span class=\"selector grab\" \r\n          *ngFor=\"let container of containers; let cIndex = index;\"\r\n          (click)=\"select('c' + cIndex, $event)\"\r\n          (dragstart)=\"deselect(); setAdding('c' + cIndex); dragging = true;\"\r\n          [ngClass]=\"{'selected': selection.adding === 'c' + cIndex,\r\n                      'color': selection.selectedOnCanvas === 'c' + cIndex}\"\r\n          draggable=\"true\">\r\n      {{ container }}\r\n    </span>\r\n    <div class=\"title\">TERMS</div>\r\n    <span class=\"selector grab\" \r\n          *ngFor=\"let term of terms; let tIndex = index;\"\r\n          (click)=\"select('t' + tIndex, $event)\"\r\n          [ngClass]=\"{'selected': selection.adding === 't' + tIndex,\r\n                      'color': selection.selectedOnCanvas === 't' + tIndex}\"\r\n          draggable=\"true\"\r\n          (dragstart)=\"deselect(); dragging = true; setAdding('t' + tIndex);\">\r\n      {{ term }}\r\n      <span *ngIf=\"selection.adding === 't' + tIndex && !dragging\"\r\n            class=\"material-icons\"\r\n            (click)=\"delete($event)\">\r\n          delete\r\n      </span>\r\n    </span>\r\n    <span class=\"selector material-icons color\" \r\n          (click)=\"addTerm()\"\r\n          *ngIf=\"!addingTerm\">\r\n          add\r\n    </span>\r\n    <span class=\"selector color\" *ngIf=\"addingTerm\">\r\n      <input  type=\"text\" \r\n              (keyup)=\"addTermTyped($event)\" \r\n              (blur)=\"finishAddingTerm(false)\"\r\n              #termInput>\r\n      <span class=\"material-icons more\" (mousedown)=\"showTermTemplate()\">more_horiz</span>\r\n    </span>\r\n    <div class=\"title\">HORIZONTAL LINES</div>\r\n    <span class=\"selector grab\" \r\n          *ngFor=\"let hDivider of getCountArray(hDividers); let hIndex = index;\"\r\n          (click)=\"select('h' + hIndex, $event)\"\r\n          (dragstart)=\"deselect(); dragging = true; setAdding('h' + hIndex);\"\r\n          [ngClass]=\"{'selected': selection.adding === 'h' + hIndex,\r\n                      'color': selection.selectedOnCanvas === 'h' + hIndex}\"\r\n          draggable=\"true\">\r\n      {{ hDivider }}\r\n      <span *ngIf=\"selection.adding === 'h' + hIndex && !dragging\"\r\n            class=\"material-icons\"\r\n            (click)=\"delete($event)\">\r\n          delete\r\n      </span>\r\n    </span>\r\n    <span class=\"selector material-icons color\" \r\n          (click)=\"addHDivider($event)\">\r\n          add\r\n    </span>\r\n    <div class=\"title\">VERTICAL LINES</div>\r\n    <span class=\"selector grab\" \r\n          *ngFor=\"let vDivider of getCountArray(vDividers); let vIndex = index;\"\r\n          (click)=\"select('v' + vIndex, $event)\"\r\n          (dragstart)=\"deselect(); dragging = true; setAdding('v' + vIndex);\"\r\n          [ngClass]=\"{'selected': selection.adding === 'v' + vIndex,\r\n                      'color': selection.selectedOnCanvas === 'v' + vIndex}\"\r\n          draggable=\"true\">\r\n      {{ vDivider }}\r\n      <span *ngIf=\"selection.adding === 'v' + vIndex && !dragging\"\r\n            class=\"material-icons\"\r\n            (click)=\"delete($event)\">\r\n          delete\r\n      </span>\r\n    </span>\r\n    <span class=\"selector material-icons color\" \r\n          (click)=\"addVDivider($event)\">\r\n          add\r\n    </span>\r\n    <div class=\"title\">RADICALS</div>\r\n    <span class=\"selector grab\" \r\n          *ngFor=\"let radical of getCountArray(radicals); let rIndex = index;\"\r\n          (click)=\"select('r' + rIndex, $event)\"\r\n          (dragstart)=\"deselect(); dragging = true; setAdding('r' + rIndex);\"\r\n          [ngClass]=\"{'selected': selection.adding === 'r' + rIndex,\r\n                      'color': selection.selectedOnCanvas === 'r' + rIndex}\"\r\n          draggable=\"true\">\r\n      {{ radical }}\r\n      <span *ngIf=\"selection.adding === 'r' + rIndex && !dragging\"\r\n            class=\"material-icons\"\r\n            (click)=\"delete($event)\">\r\n          delete\r\n      </span>\r\n    </span>\r\n    <span class=\"selector material-icons color\" \r\n          (click)=\"addRadical($event)\">\r\n          add\r\n    </span>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/content-pane/content-pane.component.ts":
/*!********************************************************!*\
  !*** ./src/app/content-pane/content-pane.component.ts ***!
  \********************************************************/
/*! exports provided: ContentPaneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentPaneComponent", function() { return ContentPaneComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error.service */ "./src/app/error.service.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _term_template_term_template_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../term-template/term-template.component */ "./src/app/term-template/term-template.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ContentPaneComponent = /** @class */ (function () {
    function ContentPaneComponent(undoRedo, selection, error, modal) {
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.error = error;
        this.modal = modal;
        this.lastTermAddText = '';
        this.hDividers = 0;
        this.vDividers = 0;
        this.radicals = 0;
        this.dragging = false;
        this.containers = [
            'Horizontal',
            'Vertical',
            'Tight Horizontal',
            'Root',
            'Exponent/Subscript',
            'Quiz',
            'Table'
        ];
        this.updateState = this.updateState.bind(this);
        undoRedo.subscribe(this.updateState);
        this.updateState(undoRedo.getState());
    }
    ContentPaneComponent.prototype.ngAfterViewInit = function () {
        // Focus the term input whenever it appears
        this.termInputEl.changes.subscribe({
            next: function (ql) {
                if (ql.first) {
                    ql.first.nativeElement.focus();
                }
            }
        });
    };
    /**
     * Get the help text that is displayed
     * on the top of the content pane.
     */
    ContentPaneComponent.prototype.getHelpText = function () {
        if (this.addingTerm) {
            return 'Press Enter to Add.';
        }
        else if (this.dragging) {
            return 'Drag to the Left to Add.';
        }
        else if (this.selection.adding !== undefined) {
            return 'Click on the Left to Add.';
        }
        else {
            return 'Click to Select.';
        }
    };
    /**
     * Turn the 'add term' button into
     * a text box to add a term.
     */
    ContentPaneComponent.prototype.addTerm = function () {
        this.addingTerm = true;
    };
    /**
     * Called when the keyboard is typed when adding a term.
     * @param e The event.
     */
    ContentPaneComponent.prototype.addTermTyped = function (e) {
        if (e.key === 'Enter') {
            this.finishAddingTerm(true);
            return;
        }
        this.lastTermAddText = e.target.value;
    };
    /**
     * Typing the term is finished, add it to the state.
     * @param fromKey Whether this function is called as a result of a key press.
     */
    ContentPaneComponent.prototype.finishAddingTerm = function (fromKey) {
        if (!this.addingTerm) {
            // Caused by input being removed activating blur
            return;
        }
        var termText = this.lastTermAddText.trim();
        if (termText === '') {
            if (fromKey) {
                // User pressed enter to add, let them know invalid
                this.error.text = 'Blank terms are not allowed.';
                return;
            }
            else {
                // User pressed somewhere else, just cancel the adding.
                this.addingTerm = false;
                return;
            }
        }
        var newState = this.undoRedo.getStateClone();
        if (!newState.terms) {
            newState.terms = [];
        }
        var newIndex = newState.terms.length;
        newState.terms.push(termText);
        newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_4__["getMetrics"])(newState);
        this.undoRedo.publishChange(newState);
        this.lastTermAddText = '';
        this.addingTerm = false;
        this.select('t' + newIndex, undefined);
    };
    /**
     * Get a string array representing counting from 1
     * to a number.
     * @param countTo The number to count to.
     */
    ContentPaneComponent.prototype.getCountArray = function (countTo) {
        var toReturn = [];
        for (var i = 0; i < countTo; i++) {
            toReturn.push('' + (i + 1));
        }
        return toReturn;
    };
    /**
     * Add a new hDivider.
     * @param e The mouse event.
     */
    ContentPaneComponent.prototype.addHDivider = function (e) {
        e.stopPropagation();
        var newState = this.undoRedo.getStateClone();
        if (!newState.hDividers) {
            newState.hDividers = 0;
        }
        var newIndex = newState.hDividers;
        this.select('h' + newIndex, undefined);
        newState.hDividers++;
        this.undoRedo.publishChange(newState);
    };
    /**
     * Add a new vDivider.
     * @param e The mouse event.
     */
    ContentPaneComponent.prototype.addVDivider = function (e) {
        e.stopPropagation();
        var newState = this.undoRedo.getStateClone();
        if (!newState.vDividers) {
            newState.vDividers = 0;
        }
        var newIndex = newState.vDividers;
        this.select('v' + newIndex, undefined);
        newState.vDividers++;
        this.undoRedo.publishChange(newState);
    };
    /**
     * Add a new radical.
     * @param e The mouse event.
     */
    ContentPaneComponent.prototype.addRadical = function (e) {
        e.stopPropagation();
        var newState = this.undoRedo.getStateClone();
        if (!newState.radicals) {
            newState.radicals = 0;
        }
        var newIndex = newState.radicals;
        this.select('r' + newIndex, undefined);
        newState.radicals++;
        this.undoRedo.publishChange(newState);
    };
    /**
     * Select a container or some content.
     * @param ref The reference of the content.
     *            Here a 'c' prefix is used for containers, which isn't valid in the context of a canvas controller.
     * @param e The mouse event.
     */
    ContentPaneComponent.prototype.select = function (ref, e) {
        this.setAdding(ref);
        if (e) {
            e.stopPropagation();
        }
    };
    /**
     * Deselect whatever is selected.
     */
    ContentPaneComponent.prototype.deselect = function () {
        this.selection.adding = undefined;
        this.selection.selectedOnCanvas = undefined;
    };
    ContentPaneComponent.prototype.setAdding = function (toAdd) {
        this.selection.adding = toAdd;
    };
    /**
     * Delete the currently selected content.
     * @param e The Mouse event.
     */
    ContentPaneComponent.prototype.delete = function (e) {
        e.stopPropagation();
        var newState = this.undoRedo.getStateClone();
        // We know it's a string, delete button only shows up for content
        var ref = this.selection.adding;
        var type = ref.charAt(0);
        var index = parseInt(ref.substring(1, ref.length), 10);
        switch (type) {
            case 't':
                newState.terms.splice(index, 1);
                break;
            case 'h':
                newState.hDividers--;
                break;
            case 'r':
                newState.radicals--;
                break;
            case 'v':
                newState.vDividers--;
                break;
            default:
                throw new Error('Undefined content type.');
        }
        // We've just removed the content from the arrays,
        // so now any reference to content later in the
        // array will be incorrect.
        if (newState.steps) {
            newState.steps.forEach(function (step) {
                removeAndShiftContent(step.root);
                // Color info also invalidated
                if (step.color) {
                    removeDeletedKeys(step.color);
                }
                if (step.opacity) {
                    removeDeletedKeys(step.opacity);
                }
            });
        }
        // Remove the object from step options
        if (newState.stepOpts) {
            Object.keys(newState.stepOpts).forEach(function (stepNum) {
                var stepOpts = newState.stepOpts[stepNum];
                if (stepOpts.clones) {
                    stepOpts.clones = removeDeletedKeysOrValues(stepOpts.clones);
                }
                if (stepOpts.evals) {
                    stepOpts.evals = removeDeletedKeysOrValues(stepOpts.evals);
                }
                if (stepOpts.merges) {
                    stepOpts.merges = removeDeletedKeysOrValues(stepOpts.merges);
                }
            });
        }
        this.deselect();
        newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_4__["getMetrics"])(newState);
        this.undoRedo.publishChange(newState);
        // For a container/content hierarchy, remove any reference
        // to the content being removed, and shift other content
        // so it still refers to the same thing.
        function removeAndShiftContent(container) {
            if (container.type === 'hbox' || container.type === 'vbox' || container.type === 'tightHBox') {
                var cont = container;
                removeOrShiftValues(cont.children, false);
                // Doing this leaves 'holes' in the array, get rid of them:
                cont.children = cont.children.filter(function (child) { return child !== null; });
            }
            else if (container.type === 'subSuper') {
                var cont = container;
                // Just recursively check the three components
                removeAndShiftContent({ type: 'hbox', children: cont.top });
                removeAndShiftContent({ type: 'hbox', children: cont.middle });
                removeAndShiftContent({ type: 'hbox', children: cont.bottom });
            }
            else if (container.type === 'quiz') {
                var cont = container;
                // Just like a vbox, but answers is no longer valid:
                cont.answers = [];
                removeAndShiftContent({ type: 'hbox', children: cont.children });
            }
            else if (container.type === 'root') {
                var cont = container;
                // Check radical
                if (ref === cont.rad) {
                    delete cont.rad;
                }
                else if (type === 'r') {
                    // Check if need to shift radical down
                    var radIndex = parseInt(cont.rad.substring(1, cont.rad.length), 10);
                    if (radIndex > index) {
                        cont.rad = 'r' + (radIndex - 1);
                    }
                }
            }
            else if (container.type === 'table') {
                var cont = container;
                // Remove/shift lines
                removeOrShiftValues(cont.hLines, false);
                removeOrShiftValues(cont.vLines, false);
                // Remove/shift child array
                // tslint:disable-next-line:prefer-for-of
                for (var r = 0; r < cont.children.length; r++) {
                    removeOrShiftValues(cont.children[r], true);
                }
            }
        }
        // Looks through the keys of an object to
        // find deleted references.
        function removeDeletedKeys(deleteIn) {
            Object.keys(deleteIn).forEach(function (key) {
                var val = deleteIn[key];
                if (key.charAt(0) === type) {
                    // Same content type
                    var keyIndex = parseFloat(key.substring(1, key.length));
                    if (keyIndex === index) {
                        // Reference to deleted content, delete it
                        delete deleteIn[key];
                    }
                    else if (keyIndex > index) {
                        // Deletion affected array, shift this key index down
                        var newKey = key.charAt(0) + (keyIndex - 1);
                        delete deleteIn[key];
                        deleteIn[newKey] = val;
                    }
                }
            });
        }
        // Delete the ref or shift down when necessary,
        // looking in the keys of an object.
        function removeOrShiftValues(lookIn, leaveNull) {
            // Treat array as key/val pair
            Object.keys(lookIn).forEach(function (childNum) {
                var child = lookIn[childNum];
                if (typeof child === 'string') {
                    // Is content, could be what we deleted
                    var childType = child.charAt(0);
                    var childIndex = parseInt(child.substring(1, child.length), 10);
                    if (child === ref) {
                        // Is what we deleted
                        if (leaveNull) {
                            lookIn[childNum] = null;
                        }
                        else {
                            delete lookIn[childNum];
                        }
                    }
                    else if (childType === type) {
                        // Is same type of content
                        if (childIndex > index) {
                            // Is above in array, need to shift down
                            lookIn[childNum] = childType + (childIndex - 1);
                        }
                    }
                }
                else if (typeof child === 'object' && child !== null) {
                    // Is object, recursively check
                    removeAndShiftContent(child);
                }
            });
        }
        // Look through an object, removing the deleted reference
        // whether it's in a key or value, moving others down into
        // the removed space. Return the new object.
        function removeDeletedKeysOrValues(deleteIn) {
            var toReturn = {};
            // Transform to an array of arrays for easier processing
            var asArray = Object.keys(deleteIn).map(function (key) { return [key, deleteIn[key]]; });
            // Find deleted values or ones that need to be shifted
            asArray.forEach(function (keyValuePair) {
                // Seperate key and value into their parts
                var key = keyValuePair[0];
                var value = keyValuePair[1];
                var keyType = key.charAt(0);
                var valType = key.charAt(0);
                var keyIndex = parseInt(key.substring(1, key.length), 10);
                var valIndex = parseInt(value.substring(1, value.length), 10);
                if (key === ref || value === ref) {
                    // Do nothing, doesn't get transferred to new object
                    return;
                }
                // Check if key needs to be moved down
                if (keyType === type && keyIndex > index) {
                    key = keyType + (keyIndex - 1);
                }
                // Check if value needs to be moved down
                if (valType === type && valIndex > index) {
                    value = valType + (valIndex - 1);
                }
                // Add to the new object
                toReturn[key] = value;
            });
            return toReturn;
        }
    };
    /**
     * Show the term template with commonly used
     * text.
     */
    ContentPaneComponent.prototype.showTermTemplate = function () {
        this.modal.show(_term_template_term_template_component__WEBPACK_IMPORTED_MODULE_6__["TermTemplateComponent"]);
    };
    /**
     * Update the view when the state changes.
     * @param newState The new state.
     */
    ContentPaneComponent.prototype.updateState = function (newState) {
        this.terms = newState.terms ? newState.terms : [];
        this.hDividers = newState.hDividers ? newState.hDividers : 0;
        this.vDividers = newState.vDividers ? newState.vDividers : 0;
        this.radicals = newState.radicals ? newState.radicals : 0;
        this.addingTerm = false;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('termInput'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], ContentPaneComponent.prototype, "termInputEl", void 0);
    ContentPaneComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-content-pane',
            template: __webpack_require__(/*! ./content-pane.component.html */ "./src/app/content-pane/content-pane.component.html"),
            styles: [__webpack_require__(/*! ./content-pane.component.css */ "./src/app/content-pane/content-pane.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _content_selection_service__WEBPACK_IMPORTED_MODULE_2__["ContentSelectionService"],
            _error_service__WEBPACK_IMPORTED_MODULE_3__["ErrorService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_5__["ModalService"]])
    ], ContentPaneComponent);
    return ContentPaneComponent;
}());



/***/ }),

/***/ "./src/app/content-selection.service.ts":
/*!**********************************************!*\
  !*** ./src/app/content-selection.service.ts ***!
  \**********************************************/
/*! exports provided: ContentSelectionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContentSelectionService", function() { return ContentSelectionService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ContentSelectionService = /** @class */ (function () {
    function ContentSelectionService() {
        this.containerObjGetters = [
            function () {
                return {
                    type: 'hbox',
                    children: []
                };
            },
            function () {
                return {
                    type: 'vbox',
                    children: []
                };
            },
            function () {
                return {
                    type: 'tightHBox',
                    children: []
                };
            },
            function () {
                return {
                    type: 'root',
                    idx: [],
                    arg: []
                };
            },
            function () {
                return {
                    type: 'subSuper',
                    top: [],
                    middle: [],
                    bottom: []
                };
            },
            function () {
                return {
                    type: 'quiz',
                    children: [],
                    answers: []
                };
            },
            function () {
                return {
                    type: 'table',
                    children: [
                        [null]
                    ],
                    hLines: {},
                    vLines: {}
                };
            }
        ];
        // The listeners that will be run when the above
        // variable
        this.addingListeners = [];
        this.selectedOnCanvasListeners = [];
    }
    Object.defineProperty(ContentSelectionService.prototype, "selectedOnCanvas", {
        get: function () {
            return this.selectedOnCanvasVar;
        },
        set: function (newSelectedOnCanvas) {
            this.selectedOnCanvasVar = newSelectedOnCanvas;
            this.selectedOnCanvasListeners.forEach(function (listener) {
                listener();
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ContentSelectionService.prototype, "adding", {
        get: function () {
            return this.addingVar;
        },
        set: function (newAdding) {
            this.addingVar = newAdding;
            this.selectedOnCanvas = undefined;
            this.addingListeners.forEach(function (listener) {
                listener();
            });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add a new listener that will be run when the
     * 'adding' variable changes.
     * @param listener The new listener.
     */
    ContentSelectionService.prototype.addAddListener = function (listener) {
        this.addingListeners.push(listener);
    };
    /**
     * Add a new listener that will be run when the
     * 'selectedOnCanvas' variable changes.
     * @param listener The new listener.
     */
    ContentSelectionService.prototype.addSelectedOnCanvasListener = function (listener) {
        this.selectedOnCanvasListeners.push(listener);
    };
    /**
     * Remove all current selected on canvas listeners.
     */
    ContentSelectionService.prototype.resetSelectedOnCanvasListeners = function () {
        this.addingListeners = [];
    };
    /**
     * Returns whether we are adding a container.
     */
    ContentSelectionService.prototype.addingContainer = function () {
        return this.adding.charAt(0) === 'c';
    };
    /**
     * Returns the object representation of the
     * container we are adding.
     */
    ContentSelectionService.prototype.getContainer = function () {
        var type = this.adding.charAt(0);
        if (type !== 'c') {
            throw new Error('Cannot add container. The type of adding is not a container.');
        }
        var idx = parseFloat(this.adding.substring(1, this.adding.length));
        return this.containerObjGetters[idx]();
    };
    /**
     * Whether a container is selected on the
     * canvas.
     */
    ContentSelectionService.prototype.containerSelected = function () {
        return this.selectedOnCanvas.charAt(0) === 'c';
    };
    ContentSelectionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ContentSelectionService);
    return ContentSelectionService;
}());



/***/ }),

/***/ "./src/app/custom-font-load-fail/custom-font-load-fail.component.css":
/*!***************************************************************************!*\
  !*** ./src/app/custom-font-load-fail/custom-font-load-fail.component.css ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    padding: 10px;\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\nul {\r\n    list-style: disc inside none;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY3VzdG9tLWZvbnQtbG9hZC1mYWlsL2N1c3RvbS1mb250LWxvYWQtZmFpbC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLCtCQUErQjtBQUNuQzs7QUFFQTtJQUNJLDRCQUE0QjtBQUNoQyIsImZpbGUiOiJzcmMvYXBwL2N1c3RvbS1mb250LWxvYWQtZmFpbC9jdXN0b20tZm9udC1sb2FkLWZhaWwuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNvdXRlciB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcclxufVxyXG5cclxudWwge1xyXG4gICAgbGlzdC1zdHlsZTogZGlzYyBpbnNpZGUgbm9uZTtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/custom-font-load-fail/custom-font-load-fail.component.html":
/*!****************************************************************************!*\
  !*** ./src/app/custom-font-load-fail/custom-font-load-fail.component.html ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n    <p>\r\n        Couldn't load the custom font. The animation will still be saved with this font,\r\n        and the player will also attempt to load it. There are a few reasons the creator\r\n        may not be able to load the custom font:\r\n      </p>\r\n      <ul>\r\n        <li>\r\n          The URL given is relative to where the animation file will be hosted, and the\r\n          creator is not hosted from the same place.\r\n        </li>\r\n        <li>\r\n          The website where the font is hosted does not allow cross-origin requests to\r\n          the font.\r\n        </li>\r\n        <li>\r\n          The URL given is incorrect, or the font is not available in the chosen style.\r\n        </li>\r\n      </ul>\r\n      <div style=\"display: flex\">\r\n        <span class=\"button\" (click)=\"modal.remove()\">\r\n          Ok\r\n        </span>\r\n      </div>      \r\n</div>"

/***/ }),

/***/ "./src/app/custom-font-load-fail/custom-font-load-fail.component.ts":
/*!**************************************************************************!*\
  !*** ./src/app/custom-font-load-fail/custom-font-load-fail.component.ts ***!
  \**************************************************************************/
/*! exports provided: CustomFontLoadFailComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomFontLoadFailComponent", function() { return CustomFontLoadFailComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var CustomFontLoadFailComponent = /** @class */ (function () {
    function CustomFontLoadFailComponent(modal) {
        this.modal = modal;
    }
    CustomFontLoadFailComponent.prototype.ngOnInit = function () {
    };
    CustomFontLoadFailComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-custom-font-load-fail',
            template: __webpack_require__(/*! ./custom-font-load-fail.component.html */ "./src/app/custom-font-load-fail/custom-font-load-fail.component.html"),
            styles: [__webpack_require__(/*! ./custom-font-load-fail.component.css */ "./src/app/custom-font-load-fail/custom-font-load-fail.component.css")]
        }),
        __metadata("design:paramtypes", [_modal_service__WEBPACK_IMPORTED_MODULE_1__["ModalService"]])
    ], CustomFontLoadFailComponent);
    return CustomFontLoadFailComponent;
}());



/***/ }),

/***/ "./src/app/error.service.ts":
/*!**********************************!*\
  !*** ./src/app/error.service.ts ***!
  \**********************************/
/*! exports provided: ErrorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorService", function() { return ErrorService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ErrorService = /** @class */ (function () {
    function ErrorService() {
    }
    Object.defineProperty(ErrorService.prototype, "text", {
        get: function () {
            return this.textVar;
        },
        set: function (newText) {
            var _this = this;
            this.textVar = newText;
            this.active = true;
            if (this.timeoutID) {
                clearInterval(this.timeoutID);
            }
            this.timeoutID = setTimeout(function () {
                _this.active = false;
            }, _shared_main_consts__WEBPACK_IMPORTED_MODULE_1__["creatorErrorTimeout"]);
        },
        enumerable: true,
        configurable: true
    });
    ErrorService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], ErrorService);
    return ErrorService;
}());



/***/ }),

/***/ "./src/app/font-settings/font-settings.component.css":
/*!***********************************************************!*\
  !*** ./src/app/font-settings/font-settings.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p {\r\n    padding: 10px 0px;\r\n    color: rgba(255, 255, 255, 0.8);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZm9udC1zZXR0aW5ncy9mb250LXNldHRpbmdzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxpQkFBaUI7SUFDakIsK0JBQStCO0FBQ25DIiwiZmlsZSI6InNyYy9hcHAvZm9udC1zZXR0aW5ncy9mb250LXNldHRpbmdzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJwIHtcclxuICAgIHBhZGRpbmc6IDEwcHggMHB4O1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/font-settings/font-settings.component.html":
/*!************************************************************!*\
  !*** ./src/app/font-settings/font-settings.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">Font Type</div>\r\n<select #fontType (select)=\"fontTypeChanged($event.target.value);\">\r\n  <option value=\"default\">Default Font</option>\r\n  <option value=\"google fonts\">Font from Google Fonts</option>\r\n  <option value=\"custom font\">Custom Font</option>\r\n</select>\r\n\r\n<!-- Options for Google fonts -->\r\n<div *ngIf=\"fontType.value === 'google fonts'\">\r\n  <p>Browse Google Fonts <a href=\"https://fonts.google.com\" target=\"blank\">here</a> and find a font and style.</p>\r\n  <div class=\"title\">Font Name</div>\r\n  <p>For example: 'Lato'</p>\r\n  <input type=\"text\" #gfName>\r\n  <div class=\"title\">Font Weight</div>\r\n  <p>Not all of the weights below may be available. To check, select the font on Google Fonts and navigate to 'customize'.</p>\r\n  <select #gfFontWeight>\r\n    <option value=\"100\">100 (Thin)</option>\r\n    <option value=\"200\">200</option>\r\n    <option value=\"300\">300 (Light)</option>\r\n    <option value=\"400\">400 (Regular)</option>\r\n    <option value=\"500\">500 (Medium)</option>\r\n    <option value=\"600\">600</option>\r\n    <option value=\"700\">700 (Bold)</option>\r\n    <option value=\"800\">800 (Black)</option>\r\n  </select>\r\n  <div class=\"title\">Font Style</div>\r\n  <input type=\"checkbox\" #gfItalic>Make this font italic.<br>\r\n</div>\r\n\r\n<!-- Options for Custom fonts -->\r\n<div *ngIf=\"fontType.value === 'custom font'\">\r\n  <div class=\"title\">Name</div>\r\n  <p>\r\n    Can be anything, as long as it isn't the name of another font used on the same page.\r\n  </p>\r\n  <input type=\"text\" #cfName>\r\n  <div class=\"title\">Weight</div>\r\n  <select #cfFontWeight>\r\n      <option value=\"100\">100 (Thin)</option>\r\n      <option value=\"200\">200</option>\r\n      <option value=\"300\">300 (Light)</option>\r\n      <option value=\"400\">400 (Regular)</option>\r\n      <option value=\"500\">500 (Medium)</option>\r\n      <option value=\"600\">600</option>\r\n      <option value=\"700\">700 (Bold)</option>\r\n      <option value=\"800\">800 (Black)</option>\r\n    </select>\r\n    <div class=\"title\">Style</div>\r\n    <input type=\"checkbox\" #cfItalic>Make this font italic.<br>\r\n    <div class=\"title\">URL</div>\r\n    <p>\r\n      The relative path or URL to where your font can be found.\r\n      For example:<br>\r\n      fonts/my-font.otf<br>\r\n      Or:<br>\r\n      www.mywebsite.com/fonts/my-font.ttf\r\n    </p>\r\n    <input type=\"text\" #cfURL>\r\n</div>\r\n\r\n<div style=\"display: flex;\">\r\n  <span class=\"button\" (click)=\"apply()\">Apply</span>\r\n</div>\r\n\r\n<p *ngIf=\"loadingText\">\r\n  loading...\r\n</p>\r\n\r\n<p *ngIf=\"errorText\">\r\n  Couldn't find that font. Double check the font name, and make sure it's available in the\r\n  selected style.\r\n</p>"

/***/ }),

/***/ "./src/app/font-settings/font-settings.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/font-settings/font-settings.component.ts ***!
  \**********************************************************/
/*! exports provided: FontSettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontSettingsComponent", function() { return FontSettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _font_update_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../font-update.service */ "./src/app/font-update.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _custom_font_load_fail_custom_font_load_fail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../custom-font-load-fail/custom-font-load-fail.component */ "./src/app/custom-font-load-fail/custom-font-load-fail.component.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FontSettingsComponent = /** @class */ (function () {
    function FontSettingsComponent(undoRedo, cd, fontLoader, modal) {
        this.undoRedo = undoRedo;
        this.cd = cd;
        this.fontLoader = fontLoader;
        this.modal = modal;
        this.loadingText = false;
        this.errorText = false;
    }
    FontSettingsComponent.prototype.ngOnInit = function () {
    };
    FontSettingsComponent.prototype.ngAfterViewInit = function () {
        // Initialize UI with the current font
        var currState = this.undoRedo.getState();
        if (currState.font || currState.saveLaterFont) {
            var font = currState.saveLaterFont ? currState.saveLaterFont : currState.font;
            if (font.type === 'g') {
                this.fontType.nativeElement.value = 'google fonts';
                this.cd.detectChanges();
                // Name contains actual name, weight, and italic
                var fullName = font.name;
                var nameSplit = fullName.split(':');
                var name_1 = nameSplit[0];
                this.googleFontName.nativeElement.value = name_1;
                // Check if italic
                var weightAndItalic = nameSplit[1];
                if (weightAndItalic.charAt(weightAndItalic.length - 1) === 'i') {
                    // Italic
                    this.googleFontItalic.nativeElement.checked = true;
                    // Trim to be just the weight
                    weightAndItalic = weightAndItalic.substring(0, weightAndItalic.length - 1);
                }
                else {
                    this.googleFontItalic.nativeElement.checked = false;
                }
                this.googleFontWeight.nativeElement.value = weightAndItalic;
            }
            else if (font.type === 'c') {
                // Current font is custom
                this.fontType.nativeElement.value = 'custom font';
                this.cd.detectChanges();
                this.customFontName.nativeElement.value = font.name;
                this.customFontItalic.nativeElement.checked = font.style === 'italic';
                this.customFontWeight.nativeElement.value = font.weight;
                this.customFontURL.nativeElement.value = font.src;
            }
        }
        this.cd.detectChanges();
    };
    /**
     * Load the font, showing an error if it can't be loaded.
     */
    FontSettingsComponent.prototype.apply = function () {
        var _this = this;
        var fontType = this.fontType.nativeElement.value;
        if (fontType === 'default') {
            // Don't need to load anything.
            // Erase any custom font.
            var newState = this.undoRedo.getStateClone();
            delete newState.font;
            delete newState.saveLaterFont;
            newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["getMetrics"])(newState);
            this.undoRedo.publishChange(newState);
            this.modal.remove();
        }
        else if (fontType === 'google fonts') {
            // Load the google font
            this.loadingText = true;
            var name_2 = this.googleFontName.nativeElement.value;
            var weight = this.googleFontWeight.nativeElement.value;
            var italic = this.googleFontItalic.nativeElement.checked ? 'i' : '';
            var fontObj_1 = {
                type: 'g',
                name: name_2 + ':' + weight + italic
            };
            // If successful
            var onSuccess = function () {
                var newState = _this.undoRedo.getStateClone();
                delete newState.saveLaterFont;
                newState.font = fontObj_1;
                newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["getMetrics"])(newState);
                _this.undoRedo.publishChange(newState);
                _this.modal.remove();
            };
            // If unsuccessful
            var onFail = function () {
                _this.loadingText = false;
                _this.errorText = true;
            };
            this.fontLoader.load(fontObj_1, onSuccess, onFail);
        }
        else if (fontType === 'custom font') {
            // Load the custom font
            var fontName = this.customFontName.nativeElement.value;
            var fontStyle = this.customFontItalic.nativeElement.checked ? 'italic' : 'normal';
            var fontWeight = this.customFontWeight.nativeElement.value;
            var fontSrc = this.customFontURL.nativeElement.value;
            var fontObj_2 = {
                type: 'c',
                name: fontName,
                style: fontStyle,
                weight: fontWeight,
                src: fontSrc
            };
            // If successful
            var onSuccess = function () {
                var newState = _this.undoRedo.getStateClone();
                delete newState.saveLaterFont;
                newState.font = fontObj_2;
                newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["getMetrics"])(newState);
                _this.undoRedo.publishChange(newState);
                _this.modal.remove();
            };
            // If fail
            var onFail = function () {
                var newState = _this.undoRedo.getStateClone();
                delete newState.font;
                newState.saveLaterFont = fontObj_2;
                newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_5__["getMetrics"])(newState);
                _this.undoRedo.publishChange(newState);
                _this.modal.remove();
                setTimeout(function () {
                    _this.modal.show(_custom_font_load_fail_custom_font_load_fail_component__WEBPACK_IMPORTED_MODULE_4__["CustomFontLoadFailComponent"]);
                }, 10);
            };
            this.fontLoader.load(fontObj_2, onSuccess, onFail);
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('fontType'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "fontType", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('gfName'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "googleFontName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('gfFontWeight'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "googleFontWeight", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('gfItalic'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "googleFontItalic", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('cfName'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "customFontName", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('cfFontWeight'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "customFontWeight", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('cfItalic'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "customFontItalic", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('cfURL'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], FontSettingsComponent.prototype, "customFontURL", void 0);
    FontSettingsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-font-settings',
            template: __webpack_require__(/*! ./font-settings.component.html */ "./src/app/font-settings/font-settings.component.html"),
            styles: [__webpack_require__(/*! ./font-settings.component.css */ "./src/app/font-settings/font-settings.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"],
            _font_update_service__WEBPACK_IMPORTED_MODULE_2__["FontUpdateService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_3__["ModalService"]])
    ], FontSettingsComponent);
    return FontSettingsComponent;
}());



/***/ }),

/***/ "./src/app/font-update.service.ts":
/*!****************************************!*\
  !*** ./src/app/font-update.service.ts ***!
  \****************************************/
/*! exports provided: FontUpdateService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontUpdateService", function() { return FontUpdateService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var webfontloader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! webfontloader */ "./node_modules/webfontloader/webfontloader.js");
/* harmony import */ var webfontloader__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(webfontloader__WEBPACK_IMPORTED_MODULE_1__);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FontUpdateService = /** @class */ (function () {
    function FontUpdateService() {
        this.styleEl = document.createElement('style');
        document.head.appendChild(this.styleEl);
    }
    FontUpdateService.prototype.ngOnInit = function () {
    };
    /**
     * Attempt to load a font, call a callback
     * on success or failure.
     * @param fontObj An object representing the font to load. In the same format as
     *                that of the JSON files.
     * @param onSuccess Called when the loading of the font was successful. After this,
     *                  the font is loaded and can be used in Canvas instances.
     * @param onFail Called when the loading of the font was unsuccessful.
     */
    FontUpdateService.prototype.load = function (fontObj, onSuccess, onFail) {
        // Parse the font object
        var loadObj;
        if (fontObj.type === 'g') {
            // Load google font
            var font = fontObj;
            loadObj = {
                google: {
                    families: [font.name]
                }
            };
        }
        else if (fontObj.type === 'c') {
            // Load custom font
            // Add a font face declaration
            var font = fontObj;
            var fontFaceText = '@font-face {' +
                'font-family: ' + font.name + ';' +
                'font-style: ' + font.style + ';' +
                'font-weight: ' + font.weight + ';' +
                'src: url(' + font.src + ');' +
                '}';
            this.styleEl.appendChild(document.createTextNode(fontFaceText));
            // Create the object for the loader
            var loaderString = font.name + ':';
            if (font.style === 'normal') {
                loaderString += 'n';
            }
            else if (font.style === 'italic') {
                loaderString += 'i';
            }
            else {
                throw new Error('Unrecognized custom font style');
            }
            loaderString += font.weight;
            loadObj = {
                custom: {
                    families: [loaderString]
                }
            };
        }
        else {
            throw new Error('Unrecognized font object type');
        }
        // Load the font
        loadObj.active = onSuccess;
        loadObj.inactive = onFail;
        webfontloader__WEBPACK_IMPORTED_MODULE_1__["load"](loadObj);
    };
    FontUpdateService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], FontUpdateService);
    return FontUpdateService;
}());



/***/ }),

/***/ "./src/app/helpers.ts":
/*!****************************!*\
  !*** ./src/app/helpers.ts ***!
  \****************************/
/*! exports provided: inLayout, deepClone, cap, deCap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "inLayout", function() { return inLayout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepClone", function() { return deepClone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cap", function() { return cap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deCap", function() { return deCap; });
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Recursively checks if a reference
 * exists inside a step layout.
 * @param toCheck The step layout to check.
 * @param ref The ref to look for.
 */
function inLayout(toCheck, ref) {
    var found = false;
    if (!toCheck) {
        return found;
    }
    Object.keys(toCheck).forEach(function (key) {
        var value = toCheck[key];
        if (typeof value === 'object') {
            if (inLayout(value, ref)) {
                found = true;
            }
        }
        else if (typeof value === 'string') {
            if (value === ref) {
                found = true;
            }
        }
    });
    return found;
}
/**
 * Deeply clones an object, ie clones it
 * and all of its child objects.
 * @param toClone The object to clone.
 */
function deepClone(toClone) {
    return lodash__WEBPACK_IMPORTED_MODULE_0___default.a.cloneDeep(toClone);
}
/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 */
var cap = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };
/**
 * Decapitalize the first letter of a string.
 * @param str String to de-capitalize.
 */
var deCap = function (str) { return str.charAt(0).toLowerCase() + str.slice(1); };


/***/ }),

/***/ "./src/app/load/load.component.css":
/*!*****************************************!*\
  !*** ./src/app/load/load.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p {\r\n    font-size: 12px;\r\n    text-align: center;\r\n    color: rgba(229,57,53, 1);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbG9hZC9sb2FkLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLHlCQUF5QjtBQUM3QiIsImZpbGUiOiJzcmMvYXBwL2xvYWQvbG9hZC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsicCB7XHJcbiAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICBjb2xvcjogcmdiYSgyMjksNTcsNTMsIDEpO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/load/load.component.html":
/*!******************************************!*\
  !*** ./src/app/load/load.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">FILE</div>\r\n<input #input type=\"file\" accept=\".json\">\r\n<div class=\"title\">PASTE</div>\r\n<textarea #textArea rows=\"6\" cols=\"55\"></textarea>\r\n<div style=\"display: flex; flex-direction: column; align-items: center;\">\r\n  <p>Loading will erase the current project! If you want to keep it, save first.</p>\r\n  <span class=\"button\" (click)=\"load();\">Load</span>\r\n</div>\r\n<p *ngIf=\"showLoading\">\r\n  loading...\r\n</p>"

/***/ }),

/***/ "./src/app/load/load.component.ts":
/*!****************************************!*\
  !*** ./src/app/load/load.component.ts ***!
  \****************************************/
/*! exports provided: LoadComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadComponent", function() { return LoadComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../error.service */ "./src/app/error.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _font_update_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../font-update.service */ "./src/app/font-update.service.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var LoadComponent = /** @class */ (function () {
    function LoadComponent(undoRedo, modal, error, step, fontLoader) {
        this.undoRedo = undoRedo;
        this.modal = modal;
        this.error = error;
        this.step = step;
        this.fontLoader = fontLoader;
        this.showLoading = false;
    }
    LoadComponent.prototype.ngOnInit = function () {
    };
    /**
     * Load the uploaded file/pasted text.
     */
    LoadComponent.prototype.load = function () {
        var _this = this;
        if (this.inputEl.nativeElement.files.length > 0) {
            // File has been uploaded
            var reader_1 = new FileReader();
            reader_1.addEventListener('load', function () {
                _this.loadFile(reader_1.result);
            });
            reader_1.readAsText(this.inputEl.nativeElement.files[0]);
        }
        else {
            // No file, check textarea instead
            this.loadFile(this.textAreaEl.nativeElement.value);
        }
    };
    /**
     * Once the file has been retrieved as a
     * string, loads it.
     * @param fileStr The file as a string.
     */
    LoadComponent.prototype.loadFile = function (fileStr) {
        var _this = this;
        var oldHistory = this.undoRedo.getHistory();
        var oldStep = this.step.selected;
        try {
            var fileObj_1 = JSON.parse(fileStr);
            // Load the font that the animation uses
            this.showLoading = true;
            var defaultFontObj = {
                type: 'g',
                name: _shared_main_consts__WEBPACK_IMPORTED_MODULE_7__["defaultFontFamily"] + ':' + _shared_main_consts__WEBPACK_IMPORTED_MODULE_7__["defaultFontWeight"]
            };
            var fontToLoad = fileObj_1.font ? fileObj_1.font : defaultFontObj;
            // Function to actually load
            var finishLoad_1 = function () {
                _this.undoRedo.erase();
                fileObj_1.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_6__["getMetrics"])(fileObj_1);
                _this.undoRedo.publishChange(fileObj_1);
                _this.modal.remove();
            };
            // If font fails to load
            var loadFail = function () {
                finishLoad_1();
                _this.error.text = 'Failed to Load Font';
            };
            this.fontLoader.load(fontToLoad, finishLoad_1, loadFail);
        }
        catch (e) {
            console.log(e);
            this.undoRedo.setHistory(oldHistory);
            this.step.selected = oldStep;
            this.error.text = 'Invalid File';
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('input'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], LoadComponent.prototype, "inputEl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('textArea'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], LoadComponent.prototype, "textAreaEl", void 0);
    LoadComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-load',
            template: __webpack_require__(/*! ./load.component.html */ "./src/app/load/load.component.html"),
            styles: [__webpack_require__(/*! ./load.component.css */ "./src/app/load/load.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_2__["ModalService"],
            _error_service__WEBPACK_IMPORTED_MODULE_3__["ErrorService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_4__["SelectedStepService"],
            _font_update_service__WEBPACK_IMPORTED_MODULE_5__["FontUpdateService"]])
    ], LoadComponent);
    return LoadComponent;
}());



/***/ }),

/***/ "./src/app/modal.directive.ts":
/*!************************************!*\
  !*** ./src/app/modal.directive.ts ***!
  \************************************/
/*! exports provided: ModalDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalDirective", function() { return ModalDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ModalDirective = /** @class */ (function () {
    function ModalDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    ModalDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appModalHost]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewContainerRef"]])
    ], ModalDirective);
    return ModalDirective;
}());



/***/ }),

/***/ "./src/app/modal.service.ts":
/*!**********************************!*\
  !*** ./src/app/modal.service.ts ***!
  \**********************************/
/*! exports provided: ModalService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModalService", function() { return ModalService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

/**
 * Provides methods for any component to
 * add a component inside a modal and
 * display it.
 */
var ModalService = /** @class */ (function () {
    function ModalService(compFactRes) {
        this.compFactRes = compFactRes;
    }
    Object.defineProperty(ModalService.prototype, "appComponent", {
        set: function (newAppComponent) {
            this.appComponentVar = newAppComponent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Show the modal and display
     * a component inside it.
     * @param The TYPE of the component to display.
     */
    ModalService.prototype.show = function (component) {
        var _this = this;
        this.appComponentVar.onModalShow = function (modalHost) {
            var factory = _this.compFactRes.resolveComponentFactory(component);
            var viewContainer = modalHost.viewContainerRef;
            viewContainer.clear();
            _this.innerComponentRef = viewContainer.createComponent(factory);
            _this.appComponentVar.cd.detectChanges();
        };
        this.appComponentVar.displayingModal = true;
    };
    /**
     * Remove the modal.
     */
    ModalService.prototype.remove = function () {
        this.innerComponentRef.destroy();
        this.appComponentVar.modalHost.viewContainerRef.clear();
        this.appComponentVar.displayingModal = false;
    };
    ModalService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ComponentFactoryResolver"]])
    ], ModalService);
    return ModalService;
}());



/***/ }),

/***/ "./src/app/preview/preview.component.css":
/*!***********************************************!*\
  !*** ./src/app/preview/preview.component.css ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3ByZXZpZXcvcHJldmlldy5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/preview/preview.component.html":
/*!************************************************!*\
  !*** ./src/app/preview/preview.component.html ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"eqContainer\" #eqContainer></div>\r\n"

/***/ }),

/***/ "./src/app/preview/preview.component.ts":
/*!**********************************************!*\
  !*** ./src/app/preview/preview.component.ts ***!
  \**********************************************/
/*! exports provided: PreviewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreviewComponent", function() { return PreviewComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PreviewComponent = /** @class */ (function () {
    function PreviewComponent(undoRedo) {
        this.undoRedo = undoRedo;
    }
    PreviewComponent.prototype.ngAfterViewInit = function () {
        var canv = new _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_2__["default"](this.eqContainerEl.nativeElement, this.undoRedo.getState());
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('eqContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], PreviewComponent.prototype, "eqContainerEl", void 0);
    PreviewComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-preview',
            template: __webpack_require__(/*! ./preview.component.html */ "./src/app/preview/preview.component.html"),
            styles: [__webpack_require__(/*! ./preview.component.css */ "./src/app/preview/preview.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"]])
    ], PreviewComponent);
    return PreviewComponent;
}());



/***/ }),

/***/ "./src/app/project-options/project-options.component.css":
/*!***************************************************************!*\
  !*** ./src/app/project-options/project-options.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".durationRow {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.durationTitle {\r\n    font-style: italic;\r\n}\r\n\r\n.slider {\r\n    margin-right: 10px;\r\n}\r\n\r\n.textBox {\r\n    width: 50px;\r\n    margin-right: 10px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcHJvamVjdC1vcHRpb25zL3Byb2plY3Qtb3B0aW9ucy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLDhCQUE4QjtJQUM5QixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsa0JBQWtCO0FBQ3RCIiwiZmlsZSI6InNyYy9hcHAvcHJvamVjdC1vcHRpb25zL3Byb2plY3Qtb3B0aW9ucy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmR1cmF0aW9uUm93IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uZHVyYXRpb25UaXRsZSB7XHJcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbn1cclxuXHJcbi5zbGlkZXIge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG59XHJcblxyXG4udGV4dEJveCB7XHJcbiAgICB3aWR0aDogNTBweDtcclxuICAgIG1hcmdpbi1yaWdodDogMTBweDtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/project-options/project-options.component.html":
/*!****************************************************************!*\
  !*** ./src/app/project-options/project-options.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span>Play as one animation </span><input type=\"checkbox\" [(ngModel)]=\"isAutoplay\">\n<div class=\"durationRow\" *ngIf=\"isAutoplay\">\n  <span class=\"durationTitle\">Delay Before Ending: </span>\n  <span class=\"durationRow\">\n    <input class=\"textBox\" type=\"number\" [(ngModel)]=\"endDelay\">\n    <input class=\"slider\" type=\"range\" min=\"0\" max=\"2000\" [(ngModel)]=\"endDelay\">\n  </span>\n</div>\n<div style=\"display: flex\">\n  <span class=\"button\" (click)=\"apply()\">Apply</span>\n</div>"

/***/ }),

/***/ "./src/app/project-options/project-options.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/project-options/project-options.component.ts ***!
  \**************************************************************/
/*! exports provided: ProjectOptionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectOptionsComponent", function() { return ProjectOptionsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ProjectOptionsComponent = /** @class */ (function () {
    function ProjectOptionsComponent(undoRedo, modal) {
        this.undoRedo = undoRedo;
        this.modal = modal;
    }
    ProjectOptionsComponent.prototype.ngOnInit = function () {
        var currState = this.undoRedo.getState();
        this.isAutoplay = currState.autoplay !== undefined;
        if (currState.autoplay && currState.autoplay.delays && currState.autoplay.delays[currState.steps.length - 1] !== undefined) {
            // End delay already defined
            this.endDelay = currState.autoplay.delays[currState.steps.length - 1];
        }
        else {
            // Use default
            this.endDelay = 500;
        }
    };
    /**
     * Apply the changes.
     */
    ProjectOptionsComponent.prototype.apply = function () {
        var newState = this.undoRedo.getStateClone();
        if (newState.autoplay !== undefined && !this.isAutoplay) {
            // Remove autoplay
            delete newState.autoplay;
        }
        else if (newState.autoplay === undefined && this.isAutoplay) {
            // Add autoplay
            newState.autoplay = {};
            newState.autoplay.delays = {};
            if (this.endDelay !== 0) {
                newState.autoplay.delays[newState.steps.length - 1] = this.endDelay;
            }
        }
        else if (newState.autoplay !== undefined) {
            // Autoplay on before, and still on now.
            // Update delay
            if (!newState.autoplay.delays) {
                // No delays defined at all
                newState.autoplay.delays = {};
            }
            newState.autoplay.delays[newState.steps.length - 1] = this.endDelay;
        } // Other case is autoplay off before and after, in which case do nothing
        // Save change and close
        this.undoRedo.publishChange(newState);
        this.modal.remove();
    };
    ProjectOptionsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-project-options',
            template: __webpack_require__(/*! ./project-options.component.html */ "./src/app/project-options/project-options.component.html"),
            styles: [__webpack_require__(/*! ./project-options.component.css */ "./src/app/project-options/project-options.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_2__["ModalService"]])
    ], ProjectOptionsComponent);
    return ProjectOptionsComponent;
}());



/***/ }),

/***/ "./src/app/quiz-configuration/quiz-configuration.component.css":
/*!*********************************************************************!*\
  !*** ./src/app/quiz-configuration/quiz-configuration.component.css ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".selectRow {\r\n    display: flex;\r\n    align-items: center;\r\n    margin-bottom: 10px;\r\n}\r\n\r\ninput {\r\n    margin: 10px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcXVpei1jb25maWd1cmF0aW9uL3F1aXotY29uZmlndXJhdGlvbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxZQUFZO0FBQ2hCIiwiZmlsZSI6InNyYy9hcHAvcXVpei1jb25maWd1cmF0aW9uL3F1aXotY29uZmlndXJhdGlvbi5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNlbGVjdFJvdyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbn1cclxuXHJcbmlucHV0IHtcclxuICAgIG1hcmdpbjogMTBweDtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/quiz-configuration/quiz-configuration.component.html":
/*!**********************************************************************!*\
  !*** ./src/app/quiz-configuration/quiz-configuration.component.html ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">SELECT ANSWERS</div>\n<div class=\"selectRow\" *ngFor=\"let answer of answers; index as idx; trackBy: trackByIndex\">\n  <input type=\"checkbox\" [(ngModel)]=\"answers[idx]\">\n  <div #eqContainer class=\"eqContainer\"></div>\n</div>\n<div style=\"display: flex\">\n  <div class=\"button\" (click)=\"apply()\">Apply</div>\n</div>\n"

/***/ }),

/***/ "./src/app/quiz-configuration/quiz-configuration.component.ts":
/*!********************************************************************!*\
  !*** ./src/app/quiz-configuration/quiz-configuration.component.ts ***!
  \********************************************************************/
/*! exports provided: QuizConfigurationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuizConfigurationComponent", function() { return QuizConfigurationComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var QuizConfigurationComponent = /** @class */ (function () {
    function QuizConfigurationComponent(selection, undoRedo, modal) {
        var _this = this;
        this.selection = selection;
        this.undoRedo = undoRedo;
        this.modal = modal;
        this.quizObj = selection.canvasInstance.getStepLayoutOfSelected();
        this.answers = new Array(this.quizObj.children.length).fill(false);
        this.quizObj.answers.forEach(function (index) {
            _this.answers[index] = true;
        });
        // Create an empty template to put children of the quiz into
        this.formatTemplate = undoRedo.getStateClone();
        this.formatTemplate.steps = [{ root: ({ type: 'vbox', children: [] }) }];
        delete this.formatTemplate.autoplay;
    }
    QuizConfigurationComponent.prototype.ngAfterViewInit = function () {
        this.initContainers();
        this.containers.changes.subscribe(this.initContainers.bind(this));
    };
    /**
     * Display each option in the containers.
     */
    QuizConfigurationComponent.prototype.initContainers = function () {
        var _this = this;
        this.containers.forEach(function (container, i) {
            // Create a container for each child of the quiz
            container.nativeElement.innerHTML = '';
            var childEl = _this.quizObj.children[i];
            var template = Object(_helpers__WEBPACK_IMPORTED_MODULE_4__["deepClone"])(_this.formatTemplate);
            template.steps[0].root.children[0] = childEl;
            var canv = new _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_5__["default"](container.nativeElement, template);
        });
    };
    /**
     * Save changes and close.
     */
    QuizConfigurationComponent.prototype.apply = function () {
        var quiz = this.selection.canvasInstance.getSelectedLayout().component;
        quiz.saveAnswers(this.answers);
        this.selection.canvasInstance.save();
        this.modal.remove();
    };
    QuizConfigurationComponent.prototype.trackByIndex = function (index) {
        return index;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('eqContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], QuizConfigurationComponent.prototype, "containers", void 0);
    QuizConfigurationComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-quiz-configuration',
            template: __webpack_require__(/*! ./quiz-configuration.component.html */ "./src/app/quiz-configuration/quiz-configuration.component.html"),
            styles: [__webpack_require__(/*! ./quiz-configuration.component.css */ "./src/app/quiz-configuration/quiz-configuration.component.css")]
        }),
        __metadata("design:paramtypes", [_content_selection_service__WEBPACK_IMPORTED_MODULE_1__["ContentSelectionService"],
            _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__["UndoRedoService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_3__["ModalService"]])
    ], QuizConfigurationComponent);
    return QuizConfigurationComponent;
}());



/***/ }),

/***/ "./src/app/save/save.component.css":
/*!*****************************************!*\
  !*** ./src/app/save/save.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n}\r\n\r\np {\r\n    padding: 10px;\r\n}\r\n\r\n.margin-top {\r\n    margin-top: 10px;\r\n}\r\n\r\na {\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc2F2ZS9zYXZlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSwrQkFBK0I7QUFDbkMiLCJmaWxlIjoic3JjL2FwcC9zYXZlL3NhdmUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNvdXRlciB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbnAge1xyXG4gICAgcGFkZGluZzogMTBweDtcclxufVxyXG5cclxuLm1hcmdpbi10b3Age1xyXG4gICAgbWFyZ2luLXRvcDogMTBweDtcclxufVxyXG5cclxuYSB7XHJcbiAgICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/save/save.component.html":
/*!******************************************!*\
  !*** ./src/app/save/save.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n  <a class=\"button\" download=\"anim0.json\" [href]=\"downloadHref\">Download</a>\r\n  <span class=\"button\" (click)=\"copy();\">Copy to clipboard</span>\r\n  <p *ngIf=\"copied\">Copied!</p>\r\n  <textarea #textArea rows=\"6\" cols=\"55\" [ngClass]=\"{'margin-top': !copied}\"></textarea>\r\n</div>"

/***/ }),

/***/ "./src/app/save/save.component.ts":
/*!****************************************!*\
  !*** ./src/app/save/save.component.ts ***!
  \****************************************/
/*! exports provided: SaveComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SaveComponent", function() { return SaveComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _shared_main_HeightComputeCanvasController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/main/HeightComputeCanvasController */ "../src/main/HeightComputeCanvasController.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SaveComponent = /** @class */ (function () {
    function SaveComponent(undoRedo, sanitizer) {
        this.undoRedo = undoRedo;
        this.sanitizer = sanitizer;
        var currState = this.undoRedo.getStateClone();
        // Check if there is an unloaded custom font
        if (currState.saveLaterFont) {
            currState.font = currState.saveLaterFont;
            delete currState.saveLaterFont;
            // Metrics are for default font, no longer valid
            delete currState.metrics;
            delete currState.maxHeights;
        }
        else {
            // Computing max heights is only valid if the font is correct
            currState.maxHeights = new _shared_main_HeightComputeCanvasController__WEBPACK_IMPORTED_MODULE_3__["default"](currState).compute();
        }
        this.fileString = JSON.stringify(currState);
        var blob = new Blob([this.fileString], { type: 'text/plain' });
        this.downloadHref = sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
    }
    /**
     * Copy the file to the clipboard as a string.
     */
    SaveComponent.prototype.copy = function () {
        this.textAreaEl.nativeElement.select();
        this.copied = true;
        document.execCommand('copy');
    };
    SaveComponent.prototype.ngAfterViewInit = function () {
        this.textAreaEl.nativeElement.value = this.fileString;
    };
    SaveComponent.prototype.ngOnDestroy = function () {
        // Prevent resource leak.
        window.URL.revokeObjectURL(this.downloadHref);
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('textArea'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], SaveComponent.prototype, "textAreaEl", void 0);
    SaveComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-save',
            template: __webpack_require__(/*! ./save.component.html */ "./src/app/save/save.component.html"),
            styles: [__webpack_require__(/*! ./save.component.css */ "./src/app/save/save.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]])
    ], SaveComponent);
    return SaveComponent;
}());



/***/ }),

/***/ "./src/app/selected-step.service.ts":
/*!******************************************!*\
  !*** ./src/app/selected-step.service.ts ***!
  \******************************************/
/*! exports provided: SelectedStepService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectedStepService", function() { return SelectedStepService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./undo-redo.service */ "./src/app/undo-redo.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SelectedStepService = /** @class */ (function () {
    function SelectedStepService(undoRedo) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.selectedVar = 0;
        this.subscribers = [];
        undoRedo.subscribe(function (newState) {
            // If state changes, selected step may need to change.
            if (_this.selected >= newState.steps.length) {
                _this.selected = newState.steps.length - 1;
            }
        });
    }
    Object.defineProperty(SelectedStepService.prototype, "selected", {
        get: function () {
            return this.selectedVar;
        },
        set: function (newSelected) {
            this.selectedVar = newSelected;
            this.subscribers.forEach(function (sub) { return sub(newSelected); });
        },
        enumerable: true,
        configurable: true
    });
    SelectedStepService.prototype.subscribe = function (listener) {
        this.subscribers.push(listener);
    };
    SelectedStepService.prototype.resetSubscriptions = function () {
        this.subscribers = [];
    };
    SelectedStepService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"]])
    ], SelectedStepService);
    return SelectedStepService;
}());



/***/ }),

/***/ "./src/app/step-options/SelectableCanvasController.ts":
/*!************************************************************!*\
  !*** ./src/app/step-options/SelectableCanvasController.ts ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
/* harmony import */ var _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/EqContainer */ "../src/layout/EqContainer.ts");
/* harmony import */ var _SelectableComponentModel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectableComponentModel */ "./src/app/step-options/SelectableComponentModel.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var SelectableCanvasController = /** @class */ (function (_super) {
    __extends(SelectableCanvasController, _super);
    function SelectableCanvasController(container, instructions, selectedRef, index, onChange, changeValid) {
        var _this = _super.call(this, container, instructions) || this;
        _this.components = new _SelectableComponentModel__WEBPACK_IMPORTED_MODULE_3__["default"](instructions);
        // Remove autoplay overlay if present
        if (_this.isAutoplay) {
            container.removeChild(container.children[container.childElementCount - 1]);
        }
        _this.selectedRef = selectedRef;
        _this.index = index;
        _this.onChange = onChange;
        _this.changeValid = changeValid;
        _this.canvas.addEventListener('click', _this.select.bind(_this));
        _this.recalc(true);
        return _this;
    }
    // Override to draw selected differently
    SelectableCanvasController.prototype.redraw = function () {
        var _this = this;
        _super.prototype.redraw.call(this);
        this.currStates.forEach(function (layout, component) {
            if (component instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                if (component.getRef() === _this.selectedRef) {
                    _this.ctx.save();
                    _this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    _this.ctx.fillRect(layout.tlx, layout.tly, layout.width, layout.height);
                    _this.ctx.restore();
                }
            }
        });
    };
    /**
     * Deselect what is currently selected,
     * and select what is clicked.
     * @param e The click mouse event.
     */
    SelectableCanvasController.prototype.select = function (e) {
        var x = e.offsetX;
        var y = e.offsetY;
        var layoutsArr = [];
        this.currStates.forEach(function (layout, component) {
            layoutsArr.push([layout, component]);
        });
        var newRef = this.selectedRef;
        for (var _i = 0, layoutsArr_1 = layoutsArr; _i < layoutsArr_1.length; _i++) {
            var _a = layoutsArr_1[_i], layout = _a[0], component = _a[1];
            if (layout.contains(x, y)) {
                if (component instanceof _shared_layout_EqContainer__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                    // Clicking on container deselects.
                    newRef = '';
                }
                else if (component instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_1__["default"]) {
                    // Select the new content
                    newRef = component.getRef();
                    break;
                }
            }
        }
        try {
            this.changeValid(newRef, this.index);
            this.selectedRef = newRef;
            this.onChange(this.selectedRef, this.index);
            this.redraw();
        }
        catch (e) { }
        finally { }
    };
    return SelectableCanvasController;
}(_shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (SelectableCanvasController);


/***/ }),

/***/ "./src/app/step-options/SelectableComponentModel.ts":
/*!**********************************************************!*\
  !*** ./src/app/step-options/SelectableComponentModel.ts ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/ComponentModel */ "../src/main/ComponentModel.ts");
/* harmony import */ var _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/layout/HDivider */ "../src/layout/HDivider.ts");
/* harmony import */ var _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/VDivider */ "../src/layout/VDivider.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
/* harmony import */ var _shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/layout/TableContainer */ "../src/layout/TableContainer.ts");
/* harmony import */ var _shared_layout_Padding__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/layout/Padding */ "../src/layout/Padding.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var SelectableComponentModel = /** @class */ (function (_super) {
    __extends(SelectableComponentModel, _super);
    function SelectableComponentModel(file) {
        var _this = _super.call(this, file) || this;
        // Give dividers more padding to be selectable
        var hDividers = _this.content.get('h');
        var numHDividers = hDividers.length;
        hDividers.length = 0;
        for (var i = 0; i < numHDividers; i++) {
            hDividers.push(new _shared_layout_HDivider__WEBPACK_IMPORTED_MODULE_1__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorSelectableHDividerPadding"], 'h' + i));
        }
        var vDividers = _this.content.get('v');
        var numVDividers = vDividers.length;
        vDividers.length = 0;
        for (var i = 0; i < numVDividers; i++) {
            vDividers.push(new _shared_layout_VDivider__WEBPACK_IMPORTED_MODULE_2__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["creatorSelectableVDividerPadding"], 'v' + i));
        }
        // For customizing table display
        _this.genInfo.isSelectable = true;
        return _this;
    }
    // Override to make tables display differently
    SelectableComponentModel.prototype.parseContainer = function (containerObj, depth) {
        if (containerObj.type === 'table') {
            // Selectable table, make line stroke bigger
            var format = containerObj;
            var children = Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_4__["parseChildren2D"])(format.children, this.parseContainer, this.getContent);
            return new _shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_4__["default"](_shared_main_consts__WEBPACK_IMPORTED_MODULE_3__["defaultTablePadding"], children, Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_4__["parseChildrenObj"])(format.hLines, this.getContent), Object(_shared_layout_TableContainer__WEBPACK_IMPORTED_MODULE_4__["parseChildrenObj"])(format.vLines, this.getContent), 11, _shared_layout_Padding__WEBPACK_IMPORTED_MODULE_5__["default"].even(0));
        }
        else {
            return _super.prototype.parseContainer.call(this, containerObj, depth);
        }
    };
    return SelectableComponentModel;
}(_shared_main_ComponentModel__WEBPACK_IMPORTED_MODULE_0__["ComponentModel"]));
/* harmony default export */ __webpack_exports__["default"] = (SelectableComponentModel);


/***/ }),

/***/ "./src/app/step-options/step-options.component.css":
/*!*********************************************************!*\
  !*** ./src/app/step-options/step-options.component.css ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    max-height: calc(100vh - 20px);\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n#top {\r\n    overflow-y: scroll;\r\n}\r\n\r\n.selection-container {\r\n    padding: 10px 20px 10px 20px;\r\n    margin-top: 20px;\r\n    margin-bottom: 20px;\r\n    border-radius: 5px;\r\n    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);\r\n}\r\n\r\n.top-row {\r\n    display: flex;\r\n}\r\n\r\n.top-row p {\r\n    flex-grow: 1;\r\n}\r\n\r\np {\r\n    padding: 5px;\r\n}\r\n\r\n.title-row {\r\n    display: flex;\r\n    align-items: center;\r\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1);\r\n    cursor: pointer;\r\n}\r\n\r\n.title {\r\n    flex-grow: 1;\r\n}\r\n\r\n.material-icons {\r\n    cursor: pointer;\r\n}\r\n\r\n.add {\r\n    border-left: 1px solid rgba(0, 0, 0, 0.1);\r\n    padding-left: 10px;\r\n    padding-right: 10px;\r\n}\r\n\r\n.buttonContainer {\r\n    flex-basis: 55px;\r\n    border-top: 1px solid rgba(0, 0, 0, 0.1);\r\n}\r\n\r\n.durationRow {\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n}\r\n\r\n.durationTitle {\r\n    font-style: italic;\r\n}\r\n\r\n.slider {\r\n    margin-right: 10px;\r\n}\r\n\r\n.textBox {\r\n    width: 50px;\r\n    margin-right: 10px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3RlcC1vcHRpb25zL3N0ZXAtb3B0aW9ucy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksOEJBQThCO0lBQzlCLGFBQWE7SUFDYixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSw0QkFBNEI7SUFDNUIsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsK0NBQStDO0FBQ25EOztBQUVBO0lBQ0ksYUFBYTtBQUNqQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiwyQ0FBMkM7SUFDM0MsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxlQUFlO0FBQ25COztBQUVBO0lBQ0kseUNBQXlDO0lBQ3pDLGtCQUFrQjtJQUNsQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsd0NBQXdDO0FBQzVDOztBQUVBO0lBQ0ksYUFBYTtJQUNiLDhCQUE4QjtJQUM5QixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsa0JBQWtCO0FBQ3RCIiwiZmlsZSI6InNyYy9hcHAvc3RlcC1vcHRpb25zL3N0ZXAtb3B0aW9ucy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI291dGVyIHtcclxuICAgIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAyMHB4KTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG59XHJcblxyXG4jdG9wIHtcclxuICAgIG92ZXJmbG93LXk6IHNjcm9sbDtcclxufVxyXG5cclxuLnNlbGVjdGlvbi1jb250YWluZXIge1xyXG4gICAgcGFkZGluZzogMTBweCAyMHB4IDEwcHggMjBweDtcclxuICAgIG1hcmdpbi10b3A6IDIwcHg7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG4gICAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gICAgYm94LXNoYWRvdzogMHB4IDBweCAxMHB4IDBweCByZ2JhKDAsIDAsIDAsIDAuNSk7XHJcbn1cclxuXHJcbi50b3Atcm93IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbn1cclxuXHJcbi50b3Atcm93IHAge1xyXG4gICAgZmxleC1ncm93OiAxO1xyXG59XHJcblxyXG5wIHtcclxuICAgIHBhZGRpbmc6IDVweDtcclxufVxyXG5cclxuLnRpdGxlLXJvdyB7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi50aXRsZSB7XHJcbiAgICBmbGV4LWdyb3c6IDE7XHJcbn1cclxuXHJcbi5tYXRlcmlhbC1pY29ucyB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5hZGQge1xyXG4gICAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbiAgICBwYWRkaW5nLWxlZnQ6IDEwcHg7XHJcbiAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xyXG59XHJcblxyXG4uYnV0dG9uQ29udGFpbmVyIHtcclxuICAgIGZsZXgtYmFzaXM6IDU1cHg7XHJcbiAgICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG59XHJcblxyXG4uZHVyYXRpb25Sb3cge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5kdXJhdGlvblRpdGxlIHtcclxuICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcclxufVxyXG5cclxuLnNsaWRlciB7XHJcbiAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XHJcbn1cclxuXHJcbi50ZXh0Qm94IHtcclxuICAgIHdpZHRoOiA1MHB4O1xyXG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/step-options/step-options.component.html":
/*!**********************************************************!*\
  !*** ./src/app/step-options/step-options.component.html ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n  <div id=\"top\">\r\n    <!--Transition bit-->\r\n    <div class=\"title\">TRANSITION PREVIEW</div>\r\n    <div class=\"eqContainer\" #previewContainer data-fix-height></div>\r\n\r\n    <!--Durations bit-->\r\n    <div class=\"title\">DURATIONS</div>\r\n    <div class=\"durationRow\">\r\n      <span class=\"durationTitle\">Move: </span>\r\n      <span class=\"durationRow\">\r\n        <input class=\"textBox\" type=\"number\" [(ngModel)]=\"moveDuration\" (ngModelChange)=\"updateDurations()\">\r\n        <input class=\"slider\" type=\"range\" min=\"1\" max=\"2000\" [(ngModel)]=\"moveDuration\"\r\n          (ngModelChange)=\"updateDurations()\">\r\n        <span class=\"selector\" (click)=\"setDefaultMoveDuration()\">Default</span>\r\n      </span>\r\n    </div>\r\n    <div class=\"durationRow\">\r\n      <span class=\"durationTitle\">Add: </span>\r\n      <span class=\"durationRow\">\r\n        <input class=\"textBox\" type=\"number\" [(ngModel)]=\"addDuration\" (ngModelChange)=\"updateDurations()\">\r\n        <input class=\"slider\" type=\"range\" min=\"1\" max=\"2000\" [(ngModel)]=\"addDuration\"\r\n          (ngModelChange)=\"updateDurations()\">\r\n        <span class=\"selector\" (click)=\"setDefaultAddDuration()\">Default</span>\r\n      </span>\r\n    </div>\r\n    <div class=\"durationRow\">\r\n      <span class=\"durationTitle\">Remove: </span>\r\n      <span class=\"durationRow\">\r\n        <input class=\"textBox\" type=\"number\" [(ngModel)]=\"removeDuration\" (ngModelChange)=\"updateDurations()\">\r\n        <input class=\"slider\" type=\"range\" min=\"1\" max=\"2000\" [(ngModel)]=\"removeDuration\"\r\n          (ngModelChange)=\"updateDurations()\">\r\n        <span class=\"selector\" (click)=\"setDefaultRemoveDuration()\">Default</span>\r\n      </span>\r\n    </div>\r\n    <div class=\"durationRow\" *ngIf=\"isAutoplay()\">\r\n      <span class=\"durationTitle\">Delay: </span>\r\n      <span class=\"durationRow\">\r\n        <input class=\"textBox\" type=\"number\" [(ngModel)]=\"delay\">\r\n        <input class=\"slider\" type=\"range\" min=\"0\" max=\"2000\" [(ngModel)]=\"delay\">\r\n        <span class=\"selector\" (click)=\"setDefaultDelay()\">Default</span>\r\n      </span>\r\n    </div>\r\n\r\n    <!--Clones bit-->\r\n    <div class=\"title-row\" (click)=\"showingClones = !showingClones;\">\r\n      <span class=\"material-icons\">{{ showingClones ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</span>\r\n      <div class=\"title\">\r\n        CLONES ({{ cloneToFrom.length }})\r\n      </div>\r\n      <span class=\"material-icons add\" (click)=\"addClone($event)\">add</span>\r\n    </div>\r\n    <div *ngIf=\"showingClones\">\r\n      <div class=\"selection-container\" *ngFor=\"let clone of cloneToFrom; let idx = index;\">\r\n        <div class=\"top-row\">\r\n          <p>FROM</p>\r\n          <span class=\"material-icons\" (click)=\"removeClone(idx)\">clear</span>\r\n        </div>\r\n        <div appCloneContainer [index]=\"idx\"></div>\r\n        <p>TO</p>\r\n        <div appCloneContainer [index]=\"idx\"></div>\r\n      </div>\r\n    </div>\r\n\r\n    <!--Merges bit-->\r\n    <div class=\"title-row\" (click)=\"showingMerges = !showingMerges;\">\r\n      <span class=\"material-icons\">{{ showingMerges ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</span>\r\n      <div class=\"title\">\r\n        MERGES ({{ mergeFromTo.length }})\r\n      </div>\r\n      <span class=\"material-icons add\" (click)=\"addMerge($event)\">add</span>\r\n    </div>\r\n    <div *ngIf=\"showingMerges\">\r\n      <div class=\"selection-container\" *ngFor=\"let merge of mergeFromTo; let idx = index;\">\r\n        <div class=\"top-row\">\r\n          <p>FROM</p>\r\n          <span class=\"material-icons\" (click)=\"removeMerge(idx)\">clear</span>\r\n        </div>\r\n        <div appMergeContainer [index]=\"idx\"></div>\r\n        <p>TO</p>\r\n        <div appMergeContainer [index]=\"idx\"></div>\r\n      </div>\r\n    </div>\r\n\r\n    <!--Evaluations bit-->\r\n    <div class=\"title-row\" (click)=\"showingEvals = !showingEvals\">\r\n      <div class=\"material-icons\">{{ showingEvals ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</div>\r\n      <div class=\"title\">\r\n        EVALUATIONS ({{ evalFromTo.length }})\r\n      </div>\r\n      <span class=\"material-icons add\" (click)=\"addEval($event)\">add</span>\r\n    </div>\r\n    <div *ngIf=\"showingEvals\">\r\n      <div class=\"selection-container\" *ngFor=\"let eval of evalFromTo; let idx = index;\">\r\n        <div class=\"top-row\">\r\n          <p>FROM</p>\r\n          <span class=\"material-icons\" (click)=\"removeEval(idx)\">clear</span>\r\n        </div>\r\n        <div appEvalContainer [index]=\"idx\"></div>\r\n        <p>TO</p>\r\n        <div appEvalContainer [index]=\"idx\"></div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div class=\"buttonContainer\" style=\"display: flex\">\r\n    <div class=\"button\" (click)=\"apply()\">Apply</div>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/step-options/step-options.component.ts":
/*!********************************************************!*\
  !*** ./src/app/step-options/step-options.component.ts ***!
  \********************************************************/
/*! exports provided: CloneContainerDirective, MergeContainerDirective, EvalContainerDirective, StepOptionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CloneContainerDirective", function() { return CloneContainerDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MergeContainerDirective", function() { return MergeContainerDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EvalContainerDirective", function() { return EvalContainerDirective; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepOptionsComponent", function() { return StepOptionsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SelectableCanvasController */ "./src/app/step-options/SelectableCanvasController.ts");
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../error.service */ "./src/app/error.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var CloneContainerDirective = /** @class */ (function () {
    function CloneContainerDirective(el) {
        this.el = el;
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], CloneContainerDirective.prototype, "index", void 0);
    CloneContainerDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appCloneContainer]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], CloneContainerDirective);
    return CloneContainerDirective;
}());

var MergeContainerDirective = /** @class */ (function () {
    function MergeContainerDirective(el) {
        this.el = el;
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], MergeContainerDirective.prototype, "index", void 0);
    MergeContainerDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appMergeContainer]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], MergeContainerDirective);
    return MergeContainerDirective;
}());

var EvalContainerDirective = /** @class */ (function () {
    function EvalContainerDirective(el) {
        this.el = el;
    }
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Number)
    ], EvalContainerDirective.prototype, "index", void 0);
    EvalContainerDirective = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: '[appEvalContainer]'
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], EvalContainerDirective);
    return EvalContainerDirective;
}());

var StepOptionsComponent = /** @class */ (function () {
    function StepOptionsComponent(undoRedo, step, error, modal) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.step = step;
        this.error = error;
        this.modal = modal;
        this.cloneToFrom = [];
        this.showingClones = false;
        this.mergeFromTo = [];
        this.showingMerges = false;
        this.evalFromTo = [];
        this.showingEvals = false;
        // Bindings
        this.updateCloneFrom = this.updateCloneFrom.bind(this);
        this.updateCloneTo = this.updateCloneTo.bind(this);
        this.cloneToValid = this.cloneToValid.bind(this);
        this.updateMergeFrom = this.updateMergeFrom.bind(this);
        this.mergeFromValid = this.mergeFromValid.bind(this);
        this.updateMergeTo = this.updateMergeTo.bind(this);
        this.updateEvalFrom = this.updateEvalFrom.bind(this);
        this.evalFromValid = this.evalFromValid.bind(this);
        this.updateEvalTo = this.updateEvalTo.bind(this);
        this.updateDurations = this.updateDurations.bind(this);
        var currState = undoRedo.getState();
        if (currState.stepOpts && currState.stepOpts[step.selected]) {
            // Options already exist for this transition, load them.
            var stepOpts_1 = currState.stepOpts[step.selected];
            // Load clones
            if (stepOpts_1.clones) {
                Object.keys(stepOpts_1.clones).forEach(function (toRef) {
                    var fromRef = stepOpts_1.clones[toRef];
                    _this.cloneToFrom.push([toRef, fromRef]);
                });
            }
            // Load merges
            if (stepOpts_1.merges) {
                Object.keys(stepOpts_1.merges).forEach(function (fromRef) {
                    var toRef = stepOpts_1.merges[fromRef];
                    _this.mergeFromTo.push([fromRef, toRef]);
                });
            }
            // Load evals
            if (stepOpts_1.evals) {
                Object.keys(stepOpts_1.evals).forEach(function (fromRef) {
                    var toRef = stepOpts_1.evals[fromRef];
                    _this.evalFromTo.push([fromRef, toRef]);
                });
            }
            // Load durations
            this.moveDuration = stepOpts_1.moveDuration ? stepOpts_1.moveDuration : _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultMoveDuration"];
            this.addDuration = stepOpts_1.addDuration ? stepOpts_1.addDuration : _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultAddDuration"];
            this.removeDuration = stepOpts_1.removeDuration ? stepOpts_1.removeDuration : _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultRemoveDuration"];
        }
        else {
            // Durations need to be set default if no step options
            this.setDefaultMoveDuration();
            this.setDefaultAddDuration();
            this.setDefaultRemoveDuration();
        }
        // Load delay, if necessary
        if (this.isAutoplay() && currState.autoplay.delays && currState.autoplay.delays[step.selected] !== undefined) {
            this.delay = currState.autoplay.delays[step.selected];
        }
        else {
            this.setDefaultDelay();
        }
        // Extract current and next steps
        var currStep = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(currState.steps[step.selected]);
        this.currStepContentInstructions = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(currState);
        this.currStepContentInstructions.steps = [currStep];
        this.currStepText = this.currStepContentInstructions.steps[0].text;
        delete this.currStepContentInstructions.steps[0].text;
        var nextStep = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(currState.steps[step.selected + 1]);
        this.nextStepContentInstructions = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(currState);
        this.nextStepContentInstructions.steps = [nextStep];
        this.nextStepText = this.nextStepContentInstructions.steps[0].text;
        delete this.nextStepContentInstructions.steps[0].text;
    }
    /**
     * Whether the current animation is autoplay.
     */
    StepOptionsComponent.prototype.isAutoplay = function () {
        var currState = this.undoRedo.getState();
        return currState.autoplay !== undefined;
    };
    /**
     * Called when the slider for move duration changes.
     */
    StepOptionsComponent.prototype.updateDurations = function () {
        this.updatePreview();
    };
    /**
     * Reset move duration to default.
     */
    StepOptionsComponent.prototype.setDefaultMoveDuration = function () {
        this.moveDuration = _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultMoveDuration"];
        this.updateDurations();
    };
    /**
     * Reset add duration to default.
     */
    StepOptionsComponent.prototype.setDefaultAddDuration = function () {
        this.addDuration = _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultAddDuration"];
        this.updateDurations();
    };
    /**
     * Reset remove duration to default.
     */
    StepOptionsComponent.prototype.setDefaultRemoveDuration = function () {
        this.removeDuration = _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultRemoveDuration"];
        this.updateDurations();
    };
    /**
     * Reset delay to default.
     */
    StepOptionsComponent.prototype.setDefaultDelay = function () {
        this.delay = 0;
    };
    /**
     * Fills the eq containers with the right
     * content to display.
     */
    StepOptionsComponent.prototype.updateContainers = function () {
        this.updateCloneContainers();
        this.updateMergeContainers();
        this.updateEvalContainers();
        this.updatePreview();
    };
    /**
     * Fill clone containers with content.
     */
    StepOptionsComponent.prototype.updateCloneContainers = function () {
        var _this = this;
        // Create clone containers
        var i = 0;
        this.cloneContainers.forEach(function (cloneContainer) {
            cloneContainer.el.nativeElement.innerHTML = '';
            var cloneToFromIndex = Math.floor(i / 2);
            var from = i % 2 === 0;
            if (from) {
                // Show current step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](cloneContainer.el.nativeElement, _this.currStepContentInstructions, _this.cloneToFrom[cloneToFromIndex][1], cloneToFromIndex, _this.updateCloneFrom, function () { });
            }
            else {
                // Show next step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](cloneContainer.el.nativeElement, _this.nextStepContentInstructions, _this.cloneToFrom[cloneToFromIndex][0], cloneToFromIndex, _this.updateCloneTo, _this.cloneToValid);
            }
            i++;
        });
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the clone.
     */
    StepOptionsComponent.prototype.updateCloneFrom = function (newRef, index) {
        this.cloneToFrom[index][1] = newRef;
        this.updatePreview();
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the clone.
     */
    StepOptionsComponent.prototype.updateCloneTo = function (newRef, index) {
        this.cloneToFrom[index][0] = newRef;
        this.updatePreview();
    };
    /**
     * Throws if a ref can't be selected.
     * @param newRef The reference of the new selection.
     * @param index The index of the clone.
     */
    StepOptionsComponent.prototype.cloneToValid = function (newRef, index) {
        var _this = this;
        // A clone to is valid if:
        // 1. It does not exist on the first step.
        // 2. There isn't already a transition defined.
        if (newRef === '') {
            // Blank always valid
            return;
        }
        if (Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["inLayout"])(this.currStepContentInstructions.steps[0].root, newRef)) {
            this.error.text = 'Content to clone to must not exist beforehand.';
            throw new Error();
        }
        this.cloneToFrom.forEach(function (cloneToFrom) {
            if (cloneToFrom[0] === newRef) {
                _this.error.text = 'Content can only be cloned from one place.';
                throw new Error();
            }
        });
    };
    /**
     * Add a new clone.
     */
    StepOptionsComponent.prototype.addClone = function (e) {
        e.stopPropagation();
        this.cloneToFrom.unshift(['', '']);
        this.showingClones = true;
    };
    /**
     * Remove a clone.
     * @param idx The index of the clone to remove.
     */
    StepOptionsComponent.prototype.removeClone = function (idx) {
        this.cloneToFrom.splice(idx, 1);
    };
    /**
     * Fill merge containers with content.
     */
    StepOptionsComponent.prototype.updateMergeContainers = function () {
        var _this = this;
        // Create merge containers
        var i = 0;
        this.mergeContainers.forEach(function (mergeContainer) {
            mergeContainer.el.nativeElement.innerHTML = '';
            var mergeFromToIndex = Math.floor(i / 2);
            var from = i % 2 === 0;
            if (from) {
                // Show current step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](mergeContainer.el.nativeElement, _this.currStepContentInstructions, _this.mergeFromTo[mergeFromToIndex][0], mergeFromToIndex, _this.updateMergeFrom, _this.mergeFromValid);
            }
            else {
                // Show next step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](mergeContainer.el.nativeElement, _this.nextStepContentInstructions, _this.mergeFromTo[mergeFromToIndex][1], mergeFromToIndex, _this.updateMergeTo, function () { });
            }
            i++;
        });
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the merge.
     */
    StepOptionsComponent.prototype.updateMergeFrom = function (newRef, index) {
        this.mergeFromTo[index][0] = newRef;
        this.updatePreview();
    };
    /**
     * Throws if a ref can't be selected.
     * @param newRef The new ref.
     * @param index The index of the merge.
     */
    StepOptionsComponent.prototype.mergeFromValid = function (newRef, index) {
        var _this = this;
        // A merge from is valid if:
        // 1. It does not exist afterward.
        // 2. There isn't already a transition defined for it.
        if (newRef === '') {
            // Blank always valid
            return;
        }
        if (Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["inLayout"])(this.nextStepContentInstructions.steps[0].root, newRef)) {
            this.error.text = 'Content to merge from must not exist afterward.';
            throw new Error();
        }
        this.mergeFromTo.forEach(function (mergeFromTo) {
            if (mergeFromTo[0] === newRef) {
                _this.error.text = 'Content can only be merged to one place.';
                throw new Error();
            }
        });
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the merge.
     */
    StepOptionsComponent.prototype.updateMergeTo = function (newRef, index) {
        this.mergeFromTo[index][1] = newRef;
        this.updatePreview();
    };
    /**
     * Add a new merge.
     */
    StepOptionsComponent.prototype.addMerge = function (e) {
        e.stopPropagation();
        this.mergeFromTo.unshift(['', '']);
        this.showingMerges = true;
    };
    /**
     * Remove a merge.
     * @param idx The index of the merge.
     */
    StepOptionsComponent.prototype.removeMerge = function (idx) {
        this.mergeFromTo.splice(idx, 1);
    };
    /**
     * Fill eval containers with content.
     */
    StepOptionsComponent.prototype.updateEvalContainers = function () {
        var _this = this;
        // Create eval containers
        var i = 0;
        this.evalContainers.forEach(function (evalContainer) {
            evalContainer.el.nativeElement.innerHTML = '';
            var evalFromToIndex = Math.floor(i / 2);
            var from = i % 2 === 0;
            if (from) {
                // Show current step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](evalContainer.el.nativeElement, _this.currStepContentInstructions, _this.evalFromTo[evalFromToIndex][0], evalFromToIndex, _this.updateEvalFrom, _this.evalFromValid);
            }
            else {
                // Show next step
                var canv = new _SelectableCanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](evalContainer.el.nativeElement, _this.nextStepContentInstructions, _this.evalFromTo[evalFromToIndex][1], evalFromToIndex, _this.updateEvalTo, function () { });
            }
            i++;
        });
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the eval.
     */
    StepOptionsComponent.prototype.updateEvalFrom = function (newRef, index) {
        this.evalFromTo[index][0] = newRef;
        this.updatePreview();
    };
    /**
     * Throws if a ref can't be selected.
     * @param newRef The new ref.
     * @param index The index of the eval.
     */
    StepOptionsComponent.prototype.evalFromValid = function (newRef, index) {
        var _this = this;
        // An eval from is valid if:
        // 1. It does not exist afterward.
        // 2. There isn't already a transition defined for it.
        if (newRef === '') {
            // Blank always valid
            return;
        }
        if (Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["inLayout"])(this.nextStepContentInstructions.steps[0].root, newRef)) {
            this.error.text = 'Content to evaluate must not exist afterward.';
            throw new Error();
        }
        this.evalFromTo.forEach(function (evalFromTo) {
            if (evalFromTo[0] === newRef) {
                _this.error.text = 'Content can only evaluate to one thing.';
                throw new Error();
            }
        });
    };
    /**
     * Update the model with a new selection.
     * @param newRef The reference of the new selection.
     * @param index The index of the eval.
     */
    StepOptionsComponent.prototype.updateEvalTo = function (newRef, index) {
        this.evalFromTo[index][1] = newRef;
        this.updatePreview();
    };
    /**
     * Add a new evaluation.
     */
    StepOptionsComponent.prototype.addEval = function (e) {
        e.stopPropagation();
        this.evalFromTo.unshift(['', '']);
        this.showingEvals = true;
    };
    /**
     * Remove an eval.
     * @param idx The index of the eval.
     */
    StepOptionsComponent.prototype.removeEval = function (idx) {
        this.evalFromTo.splice(idx, 1);
    };
    /**
     * Update the preview of the step transition.
     */
    StepOptionsComponent.prototype.updatePreview = function () {
        // May fire before preview is ready
        if (!this.previewEl) {
            return;
        }
        this.previewEl.nativeElement.innerHTML = '';
        var instructions = this.undoRedo.getStateClone();
        var stepOne = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(this.currStepContentInstructions.steps[0]);
        stepOne.text = this.currStepText;
        var stepTwo = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(this.nextStepContentInstructions.steps[0]);
        stepTwo.text = this.nextStepText;
        instructions.steps = [stepOne, stepTwo];
        instructions.stepOpts = [
            this.getFinalStepOption()
        ];
        // Should not autoplay, even if the whole animation is
        delete instructions.autoplay;
        var canv = new _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_5__["default"](this.previewEl.nativeElement, instructions);
    };
    /**
     * Compile the clones, merges, and evals
     * into a step options object as used in
     * instructions.
     */
    StepOptionsComponent.prototype.getFinalStepOption = function () {
        var toReturn = {};
        // Add clones
        this.cloneToFrom.forEach(function (cloneToFrom) {
            var toRef = cloneToFrom[0];
            var fromRef = cloneToFrom[1];
            if (toRef === '' || fromRef === '') {
                // Ignore empty string representing unselected.
                return;
            }
            if (!toReturn.clones) {
                toReturn.clones = {};
            }
            toReturn.clones[toRef] = fromRef;
        });
        // Add merges
        this.mergeFromTo.forEach(function (mergeFromTo) {
            var toRef = mergeFromTo[1];
            var fromRef = mergeFromTo[0];
            if (toRef === '' || fromRef === '') {
                // Ignore empty string representing unselected.
                return;
            }
            if (!toReturn.merges) {
                toReturn.merges = {};
            }
            toReturn.merges[fromRef] = toRef;
        });
        // Add evals
        this.evalFromTo.forEach(function (evalFromTo) {
            var toRef = evalFromTo[1];
            var fromRef = evalFromTo[0];
            if (toRef === '' || fromRef === '') {
                // Ignore empty string representing unselected.
                return;
            }
            if (!toReturn.evals) {
                toReturn.evals = {};
            }
            toReturn.evals[fromRef] = toRef;
        });
        // Add durations
        if (this.moveDuration !== _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultMoveDuration"]) {
            toReturn.moveDuration = this.moveDuration;
        }
        if (this.addDuration !== _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultAddDuration"]) {
            toReturn.addDuration = this.addDuration;
        }
        if (this.removeDuration !== _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["defaultRemoveDuration"]) {
            toReturn.removeDuration = this.removeDuration;
        }
        return toReturn;
    };
    /**
     * Apply the changes that have been made.
     */
    StepOptionsComponent.prototype.apply = function () {
        var newState = this.undoRedo.getStateClone();
        // Add step options
        if (!newState.stepOpts) {
            newState.stepOpts = {};
        }
        newState.stepOpts[this.step.selected] = this.getFinalStepOption();
        // Add delay for autoplay
        if (newState.autoplay !== undefined && this.delay !== 0) {
            if (!newState.autoplay.delays) {
                newState.autoplay.delays = {};
            }
            newState.autoplay.delays[this.step.selected] = this.delay;
        }
        this.undoRedo.publishChange(newState);
        this.modal.remove();
    };
    StepOptionsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.updateContainers();
        this.updatePreview();
        this.cloneContainers.changes.subscribe(function () {
            _this.updateCloneContainers();
            _this.updatePreview();
        });
        this.mergeContainers.changes.subscribe(function () {
            _this.updateMergeContainers();
            _this.updatePreview();
        });
        this.evalContainers.changes.subscribe(function () {
            _this.updateEvalContainers();
            _this.updatePreview();
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])(CloneContainerDirective),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], StepOptionsComponent.prototype, "cloneContainers", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])(MergeContainerDirective),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], StepOptionsComponent.prototype, "mergeContainers", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])(EvalContainerDirective),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], StepOptionsComponent.prototype, "evalContainers", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('previewContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], StepOptionsComponent.prototype, "previewEl", void 0);
    StepOptionsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-step-options',
            template: __webpack_require__(/*! ./step-options.component.html */ "./src/app/step-options/step-options.component.html"),
            styles: [__webpack_require__(/*! ./step-options.component.css */ "./src/app/step-options/step-options.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_2__["SelectedStepService"],
            _error_service__WEBPACK_IMPORTED_MODULE_6__["ErrorService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_7__["ModalService"]])
    ], StepOptionsComponent);
    return StepOptionsComponent;
}());



/***/ }),

/***/ "./src/app/step-text/step-text.component.css":
/*!***************************************************!*\
  !*** ./src/app/step-text/step-text.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    display: flex;\r\n    justify-content: center;\r\n    padding: 10px;\r\n    align-items: center;\r\n    color: rgba(255, 255, 255, 0.9);\r\n}\r\n\r\n.italic {\r\n    font-style: italic;\r\n}\r\n\r\n.material-icons {\r\n    cursor: pointer;\r\n    padding: 5px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3RlcC10ZXh0L3N0ZXAtdGV4dC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksYUFBYTtJQUNiLHVCQUF1QjtJQUN2QixhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLCtCQUErQjtBQUNuQzs7QUFFQTtJQUNJLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGVBQWU7SUFDZixZQUFZO0FBQ2hCIiwiZmlsZSI6InNyYy9hcHAvc3RlcC10ZXh0L3N0ZXAtdGV4dC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiI291dGVyIHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcclxufVxyXG5cclxuLml0YWxpYyB7XHJcbiAgICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbn1cclxuXHJcbi5tYXRlcmlhbC1pY29ucyB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBwYWRkaW5nOiA1cHg7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/step-text/step-text.component.html":
/*!****************************************************!*\
  !*** ./src/app/step-text/step-text.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n  <span [ngClass]=\"{'italic': noText}\" [innerHTML]=\"noText ? 'No Text' : this.text\"></span>\r\n  <span class=\"material-icons\" (click)=\"edit($event)\">create</span>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/step-text/step-text.component.ts":
/*!**************************************************!*\
  !*** ./src/app/step-text/step-text.component.ts ***!
  \**************************************************/
/*! exports provided: StepTextComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepTextComponent", function() { return StepTextComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _text_editor_text_editor_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../text-editor/text-editor.component */ "./src/app/text-editor/text-editor.component.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var StepTextComponent = /** @class */ (function () {
    function StepTextComponent(undoRedo, step, modal, sanitizer) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.step = step;
        this.modal = modal;
        this.sanitizer = sanitizer;
        this.noText = true;
        this.undoRedo.subscribe(this.stateChange.bind(this));
        this.step.subscribe(function () {
            _this.stateChange(_this.undoRedo.getState());
        });
    }
    /**
     * Called when the global state changes.
     * @param newState The new state.
     */
    StepTextComponent.prototype.stateChange = function (newState) {
        // Bypass because the system for displaying colored text
        // relies on creating HTML inside the step text.
        var text = newState.steps[this.step.selected].text;
        if (!text) {
            this.noText = true;
            return;
        }
        this.text = this.sanitizer.bypassSecurityTrustHtml(newState.steps[this.step.selected].text);
        this.noText = false;
    };
    /**
     * Edit the text for this step.
     * @param e The mouse event.
     */
    StepTextComponent.prototype.edit = function (e) {
        e.stopPropagation();
        this.modal.show(_text_editor_text_editor_component__WEBPACK_IMPORTED_MODULE_4__["TextEditorComponent"]);
    };
    StepTextComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-step-text',
            template: __webpack_require__(/*! ./step-text.component.html */ "./src/app/step-text/step-text.component.html"),
            styles: [__webpack_require__(/*! ./step-text.component.css */ "./src/app/step-text/step-text.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_2__["SelectedStepService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_3__["ModalService"],
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["DomSanitizer"]])
    ], StepTextComponent);
    return StepTextComponent;
}());



/***/ }),

/***/ "./src/app/steps/RendererCanvasController.ts":
/*!***************************************************!*\
  !*** ./src/app/steps/RendererCanvasController.ts ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/layout/EqContent */ "../src/layout/EqContent.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



/**
 * A canvas controller which can render
 * all the steps it is passed for use
 * on another canvas.
 */
var RendererCanvasController = /** @class */ (function (_super) {
    __extends(RendererCanvasController, _super);
    function RendererCanvasController(instructions, renderWidth, renderHeight) {
        var _this = this;
        var fakeEl = document.createElement('div');
        _this = _super.call(this, fakeEl, instructions) || this;
        _this.renderWidth = renderWidth;
        _this.renderHeight = renderHeight;
        return _this;
    }
    // For performance, override: doesn't need to do anything.
    RendererCanvasController.prototype.recalc = function () { };
    /**
     * Render all the steps, returning an
     * array of canvases with dimensions
     * of renderWidth x renderHeight as
     * specified in the constructor.
     */
    RendererCanvasController.prototype.render = function () {
        var _this = this;
        var toReturn = [];
        this.steps.forEach(function (step) {
            // Get the layouts for the step
            console.log(step.root);
            var rootContainer = _this.components.parseContainer(step.root, 0);
            var colors = step.color;
            var opacities = step.opacity;
            var layouts = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_1__["newMap"])();
            var rootLayout = rootContainer.addLayout(undefined, layouts, 0, 0, 1, opacities, colors, Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_1__["newMap"])(), Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_1__["newMap"])(), Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_1__["newMap"])(), []);
            // Render the layout
            var overflowX = rootLayout.width - _this.renderWidth;
            var overflowY = rootLayout.height - _this.renderHeight;
            _this.canvas = document.createElement('canvas');
            _this.ctx = _this.canvas.getContext('2d');
            _this.setSize(_this.renderWidth, _this.renderHeight);
            _this.lastHeight = -1;
            _this.lastWidth = -1;
            var scale;
            if (overflowX > overflowY) {
                scale = _this.renderWidth / rootLayout.width;
            }
            else {
                scale = _this.renderHeight / rootLayout.height;
            }
            _this.ctx.scale(scale, scale);
            layouts.forEach(function (l) {
                _this.ctx.save();
                if (l.component instanceof _shared_layout_EqContent__WEBPACK_IMPORTED_MODULE_2__["default"]) {
                    l.component.interpColorOff();
                    l.component.draw(l, l, 0, _this.ctx);
                }
                _this.ctx.restore();
            });
            toReturn.push(_this.canvas);
        });
        return toReturn;
    };
    return RendererCanvasController;
}(_shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ __webpack_exports__["default"] = (RendererCanvasController);


/***/ }),

/***/ "./src/app/steps/steps.component.css":
/*!*******************************************!*\
  !*** ./src/app/steps/steps.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    border-top: 1px solid rgba(255, 255, 255, 0.3);\r\n    display: flex;\r\n    flex-direction: row;\r\n    flex-wrap: nowrap;\r\n    overflow: hidden;\r\n    color: rgba(255, 255, 255, 0.9);\r\n    align-items: stretch;\r\n}\r\n\r\n.thumbnail {\r\n    opacity: 0;\r\n    position: absolute;\r\n    top: 0px;\r\n    left: 0px;\r\n}\r\n\r\n.step-left {\r\n    width: 100px;\r\n    height: 100px;\r\n    position: relative;\r\n    line-height: 100px;\r\n    text-align: center;\r\n    flex-shrink: 0;\r\n    cursor: pointer;\r\n}\r\n\r\n.step-right {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n.step {\r\n    border-right: 1px solid rgba(255, 255, 255, 0.3);\r\n    display: flex;\r\n}\r\n\r\n.show {\r\n    opacity: 1;\r\n}\r\n\r\n.selected {\r\n    background-color: rgba(255, 255, 255, 0.25);\r\n}\r\n\r\n.material-icons {\r\n    cursor: pointer;\r\n    padding: 5px;\r\n    font-size: 20px;\r\n    line-height: 20px;\r\n}\r\n\r\n.unavailable {\r\n    color: rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.scrollInner {\r\n    flex-grow: 1;\r\n    display: flex;\r\n    max-width: calc(100vw - 60px);\r\n    overflow-x: scroll;\r\n}\r\n\r\n.scrollArrow {\r\n    vertical-align: middle;\r\n    background-color: #111;\r\n    position: relative;\r\n    z-index: 2;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3RlcHMvc3RlcHMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLDhDQUE4QztJQUM5QyxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsK0JBQStCO0lBQy9CLG9CQUFvQjtBQUN4Qjs7QUFFQTtJQUNJLFVBQVU7SUFDVixrQkFBa0I7SUFDbEIsUUFBUTtJQUNSLFNBQVM7QUFDYjs7QUFFQTtJQUNJLFlBQVk7SUFDWixhQUFhO0lBQ2Isa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsY0FBYztJQUNkLGVBQWU7QUFDbkI7O0FBRUE7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQix1QkFBdUI7QUFDM0I7O0FBRUE7SUFDSSxnREFBZ0Q7SUFDaEQsYUFBYTtBQUNqQjs7QUFFQTtJQUNJLFVBQVU7QUFDZDs7QUFFQTtJQUNJLDJDQUEyQztBQUMvQzs7QUFFQTtJQUNJLGVBQWU7SUFDZixZQUFZO0lBQ1osZUFBZTtJQUNmLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLCtCQUErQjtBQUNuQzs7QUFFQTtJQUNJLFlBQVk7SUFDWixhQUFhO0lBQ2IsNkJBQTZCO0lBQzdCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLHNCQUFzQjtJQUN0QixzQkFBc0I7SUFDdEIsa0JBQWtCO0lBQ2xCLFVBQVU7QUFDZCIsImZpbGUiOiJzcmMvYXBwL3N0ZXBzL3N0ZXBzLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjb3V0ZXIge1xyXG4gICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gICAgZmxleC13cmFwOiBub3dyYXA7XHJcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC45KTtcclxuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xyXG59XHJcblxyXG4udGh1bWJuYWlsIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDBweDtcclxuICAgIGxlZnQ6IDBweDtcclxufVxyXG5cclxuLnN0ZXAtbGVmdCB7XHJcbiAgICB3aWR0aDogMTAwcHg7XHJcbiAgICBoZWlnaHQ6IDEwMHB4O1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgbGluZS1oZWlnaHQ6IDEwMHB4O1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgZmxleC1zaHJpbms6IDA7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5zdGVwLXJpZ2h0IHtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4uc3RlcCB7XHJcbiAgICBib3JkZXItcmlnaHQ6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyk7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG59XHJcblxyXG4uc2hvdyB7XHJcbiAgICBvcGFjaXR5OiAxO1xyXG59XHJcblxyXG4uc2VsZWN0ZWQge1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjI1KTtcclxufVxyXG5cclxuLm1hdGVyaWFsLWljb25zIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgIHBhZGRpbmc6IDVweDtcclxuICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG59XHJcblxyXG4udW5hdmFpbGFibGUge1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKTtcclxufVxyXG5cclxuLnNjcm9sbElubmVyIHtcclxuICAgIGZsZXgtZ3JvdzogMTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBtYXgtd2lkdGg6IGNhbGMoMTAwdncgLSA2MHB4KTtcclxuICAgIG92ZXJmbG93LXg6IHNjcm9sbDtcclxufVxyXG5cclxuLnNjcm9sbEFycm93IHtcclxuICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMTExO1xyXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gICAgei1pbmRleDogMjtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/steps/steps.component.html":
/*!********************************************!*\
  !*** ./src/app/steps/steps.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\">\r\n  <div class=\"scrollArrow material-icons\" (click)=\"scrollLeft()\">keyboard_arrow_left</div>\r\n  <div class=\"scrollInner\" #scrollContainer>\r\n    <div  *ngFor=\"let s of Arr(numSteps).fill(1); let stepIdx = index;\" \r\n      class=\"step\"\r\n      [ngClass]=\"{'selected': step.selected === stepIdx}\">\r\n      <div class=\"step-left\"\r\n      (mouseenter)=\"showThumbnail[stepIdx] = true;\"\r\n      (mouseleave)=\"showThumbnail[stepIdx] = false;\"\r\n      (click)=\"select(stepIdx)\">\r\n      {{ showThumbnail[stepIdx] ? '' : stepIdx }}\r\n      <canvas #canvas class=\"thumbnail\" [ngClass]=\"{'show': showThumbnail[stepIdx]}\"></canvas>\r\n    </div>\r\n    <div class=\"step-right\" *ngIf=\"step.selected === stepIdx\">\r\n      <span class=\"material-icons\" (click)=\"add();\">add</span>\r\n      <span class=\"material-icons\" \r\n      (click)=\"delete()\" \r\n      [ngClass]=\"{'unavailable': !deleteAvailable()}\">delete</span>\r\n      <span class=\"material-icons\"\r\n      (click)=\"showStepOptions()\"\r\n      [ngClass]=\"{'unavailable': !stepOptionsAvailable()}\">settings</span>\r\n    </div>\r\n  </div>\r\n  </div>\r\n  <div class=\"scrollArrow material-icons\" (click)=\"scrollRight()\">keyboard_arrow_right</div>\r\n</div>"

/***/ }),

/***/ "./src/app/steps/steps.component.ts":
/*!******************************************!*\
  !*** ./src/app/steps/steps.component.ts ***!
  \******************************************/
/*! exports provided: StepsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepsComponent", function() { return StepsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _RendererCanvasController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RendererCanvasController */ "./src/app/steps/RendererCanvasController.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _step_options_step_options_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../step-options/step-options.component */ "./src/app/step-options/step-options.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var scrollXAmount = 200;
var StepsComponent = /** @class */ (function () {
    function StepsComponent(undoRedo, step, modal) {
        var _this = this;
        this.undoRedo = undoRedo;
        this.step = step;
        this.modal = modal;
        this.Arr = Array;
        this.numSteps = 0;
        this.stepWidth = 100;
        this.stepHeight = 100;
        undoRedo.subscribe(this.stateChange.bind(this));
        setTimeout(function () {
            _this.stateChange(_this.undoRedo.getState());
        }, 1);
    }
    /**
     * Update the image data for the thumbnails
     * on steps.
     * @param instructions The full instructions object to render with.
     */
    StepsComponent.prototype.updateThumbnails = function (instructions) {
        var renderer = new _RendererCanvasController__WEBPACK_IMPORTED_MODULE_2__["default"](instructions, this.stepWidth, this.stepHeight);
        this.thumbnails = renderer.render();
    };
    /**
     * Called when the state changes.
     * @param newState The new full state.
     */
    StepsComponent.prototype.stateChange = function (newState) {
        this.numSteps = newState.steps.length;
        this.showThumbnail = Array(this.numSteps).fill(false);
        this.updateThumbnails(newState);
        this.redrawThumbnails();
    };
    /**
     * Redraw the thumbnails.
     */
    StepsComponent.prototype.redrawThumbnails = function () {
        var _this = this;
        if (!this.canvasEls) {
            return;
        }
        this.canvasEls
            .map(function (el) { return [el.nativeElement, el.nativeElement.getContext('2d')]; })
            .forEach(function (canv, idx) {
            // Workaround: thumbnails may refresh before the view,
            // in which case there will be canvases without corresponding
            // thumbnails. This happens when the amount of steps reduces.
            if (!_this.thumbnails[idx]) {
                return;
            }
            _this.setCtxScale(canv[0], canv[1]);
            canv[1].clearRect(0, 0, _this.stepWidth, _this.stepHeight);
            canv[1].drawImage(_this.thumbnails[idx], 0, 0, _this.stepWidth, _this.stepHeight);
        });
    };
    /**
     * Set the scaling of a canvas to fit a
     * thumbnail.
     * @param canvas The canvas.
     * @param ctx The context of the canvas.
     */
    StepsComponent.prototype.setCtxScale = function (canvas, ctx) {
        canvas.style.width = this.stepWidth + 'px';
        canvas.style.height = this.stepHeight + 'px';
        var pixelRatio = window.devicePixelRatio || 1;
        canvas.width = this.stepWidth * pixelRatio;
        canvas.height = this.stepHeight * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
    };
    StepsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.canvasEls.changes.subscribe(function () {
            _this.redrawThumbnails();
        });
    };
    /**
     * Add a new slide after the selected one.
     */
    StepsComponent.prototype.add = function () {
        var newState = this.undoRedo.getStateClone();
        var addIndex = this.step.selected + 1;
        var newStep = Object(_helpers__WEBPACK_IMPORTED_MODULE_3__["deepClone"])(newState.steps[this.step.selected]);
        newState.steps.splice(addIndex, 0, newStep);
        // Step options from current step to next now invalid,
        // others above this need to be moved up.
        if (newState.stepOpts) {
            delete newState.stepOpts[addIndex - 1];
            for (var i = newState.steps.length - 2; i >= addIndex + 1; i--) {
                newState.stepOpts[i] = newState.stepOpts[i - 1];
            }
        }
        // Delays need to be updated too. Copy the delay from
        // current to added step, move the others up one.
        if (newState.autoplay && newState.autoplay.delays) {
            for (var i = newState.steps.length - 1; i >= addIndex; i--) {
                newState.autoplay.delays[i] = newState.autoplay.delays[i - 1];
            }
        }
        this.undoRedo.publishChange(newState);
        this.step.selected = addIndex;
    };
    /**
     * Delete the currently selected step.
     */
    StepsComponent.prototype.delete = function () {
        if (!this.deleteAvailable()) {
            return;
        }
        var newState = this.undoRedo.getStateClone();
        newState.steps.splice(this.step.selected, 1);
        // Remove associated step options
        if (newState.stepOpts) {
            delete newState.stepOpts[this.step.selected - 1];
            delete newState.stepOpts[this.step.selected];
        }
        // Step options for other steps are now invalid,
        // need to be moved down
        for (var i = this.step.selected + 1; i < newState.steps.length; i++) {
            newState.stepOpts[i - 1] = newState.stepOpts[i];
        }
        // If applicable, delays are invalid as well
        if (newState.autoplay && newState.autoplay.delays) {
            // Need different behavior for deleting last step:
            // need to preserve the delay of the deleted step,
            // as it is the delay before ending the animation.
            var startIndex = this.step.selected === newState.steps.length ? this.step.selected - 1 : this.step.selected;
            for (var i = startIndex; i <= newState.steps.length; i++) {
                newState.autoplay.delays[i] = newState.autoplay.delays[i + 1];
            }
        }
        if (this.step.selected !== 0) {
            this.step.selected--;
        }
        this.undoRedo.publishChange(newState);
    };
    /**
     * Select a step by its index.
     * @param newIdx The index of the step.
     */
    StepsComponent.prototype.select = function (newIdx) {
        this.step.selected = newIdx;
    };
    /**
     * Whether the selected step can be deleted.
     */
    StepsComponent.prototype.deleteAvailable = function () {
        return this.numSteps > 1;
    };
    /**
     * Whether step options can be edited for
     * the selected step.
     */
    StepsComponent.prototype.stepOptionsAvailable = function () {
        return this.numSteps > 1 && this.step.selected < this.numSteps - 1;
    };
    /**
     * Show a step options modal.
     */
    StepsComponent.prototype.showStepOptions = function () {
        if (!this.stepOptionsAvailable()) {
            return;
        }
        this.modal.show(_step_options_step_options_component__WEBPACK_IMPORTED_MODULE_6__["StepOptionsComponent"]);
    };
    /**
     * Scroll the steps left some amount.
     */
    StepsComponent.prototype.scrollLeft = function () {
        this.scrollContainer.nativeElement.scrollLeft -= scrollXAmount;
    };
    /**
     * Scroll the steps right some amount.
     */
    StepsComponent.prototype.scrollRight = function () {
        this.scrollContainer.nativeElement.scrollLeft += scrollXAmount;
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChildren"])('canvas'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["QueryList"])
    ], StepsComponent.prototype, "canvasEls", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('scrollContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], StepsComponent.prototype, "scrollContainer", void 0);
    StepsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-steps',
            template: __webpack_require__(/*! ./steps.component.html */ "./src/app/steps/steps.component.html"),
            styles: [__webpack_require__(/*! ./steps.component.css */ "./src/app/steps/steps.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_4__["SelectedStepService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_5__["ModalService"]])
    ], StepsComponent);
    return StepsComponent;
}());



/***/ }),

/***/ "./src/app/sub-super-alignment/sub-super-alignment.component.css":
/*!***********************************************************************!*\
  !*** ./src/app/sub-super-alignment/sub-super-alignment.component.css ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p {\r\n    padding: 10px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvc3ViLXN1cGVyLWFsaWdubWVudC9zdWItc3VwZXItYWxpZ25tZW50LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxhQUFhO0FBQ2pCIiwiZmlsZSI6InNyYy9hcHAvc3ViLXN1cGVyLWFsaWdubWVudC9zdWItc3VwZXItYWxpZ25tZW50LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJwIHtcclxuICAgIHBhZGRpbmc6IDEwcHg7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/sub-super-alignment/sub-super-alignment.component.html":
/*!************************************************************************!*\
  !*** ./src/app/sub-super-alignment/sub-super-alignment.component.html ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">EXPONENT/SUBSCRIPT ALIGNMENT</div>\r\n<div style=\"display: flex; justify-content: center;\">\r\n  <p>Lower</p>\r\n  <input #slider type=\"range\" min=\"0\" max=\"1\" step=\"0.01\" [(ngModel)]=\"portrusion\">\r\n  <p>Higher</p>\r\n</div>\r\n<div class=\"title\">PRESETS</div>\r\n<span class=\"selector\" (click)=\"portrusion = defaultPortrusion;\">Default</span>\r\n<span class=\"selector\" (click)=\"portrusion = '0.45';\">Fractional Exponent</span>\r\n<div class=\"title\">PREVIEW</div>\r\n<div class=\"eqContainer\" #eqContainer></div>\r\n<div style=\"display: flex\">\r\n  <span class=\"button\" (click)=\"apply()\">Apply</span>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/sub-super-alignment/sub-super-alignment.component.ts":
/*!**********************************************************************!*\
  !*** ./src/app/sub-super-alignment/sub-super-alignment.component.ts ***!
  \**********************************************************************/
/*! exports provided: SubSuperAlignmentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SubSuperAlignmentComponent", function() { return SubSuperAlignmentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SubSuperAlignmentComponent = /** @class */ (function () {
    function SubSuperAlignmentComponent(selection, undoRedo, step, modal) {
        this.selection = selection;
        this.undoRedo = undoRedo;
        this.step = step;
        this.modal = modal;
        this.defaultPortrusion = _shared_main_consts__WEBPACK_IMPORTED_MODULE_6__["defaultExpPortrusion"];
        this.portrusionVar = this.defaultPortrusion + '';
        // Create an instructions containing solely the
        // selected subSuper layout. Keep the color, remove
        // the text.
        this.subSuperLayout = selection.canvasInstance.getStepLayoutOfSelected();
        this.fullInstructions = undoRedo.getStateClone();
        this.fullInstructions.steps = [this.fullInstructions.steps[step.selected]];
        delete this.fullInstructions.steps[0].text;
        delete this.fullInstructions.autoplay;
        this.fullInstructions.steps[0].root = {
            type: 'vbox',
            children: [this.subSuperLayout]
        };
    }
    Object.defineProperty(SubSuperAlignmentComponent.prototype, "portrusion", {
        get: function () {
            return this.portrusionVar;
        },
        set: function (newPort) {
            this.portrusionVar = newPort;
            this.update();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update the current portrusion.
     */
    SubSuperAlignmentComponent.prototype.update = function () {
        this.subSuperLayout.portrusion = parseFloat(this.portrusion);
        this.refreshPreview();
    };
    /**
     * Update the preview canvas controller.
     */
    SubSuperAlignmentComponent.prototype.refreshPreview = function () {
        this.eqContainerEl.nativeElement.innerHTML = '';
        var canv = new _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_4__["default"](this.eqContainerEl.nativeElement, this.fullInstructions);
    };
    /**
     * Apply the changes.
     */
    SubSuperAlignmentComponent.prototype.apply = function () {
        var subSuper = this.selection.canvasInstance.getSelectedLayout().component;
        subSuper.savePortrusion(parseFloat(this.portrusion));
        this.selection.canvasInstance.save();
        this.modal.remove();
    };
    SubSuperAlignmentComponent.prototype.ngAfterViewInit = function () {
        this.refreshPreview();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('eqContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], SubSuperAlignmentComponent.prototype, "eqContainerEl", void 0);
    SubSuperAlignmentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-sub-super-alignment',
            template: __webpack_require__(/*! ./sub-super-alignment.component.html */ "./src/app/sub-super-alignment/sub-super-alignment.component.html"),
            styles: [__webpack_require__(/*! ./sub-super-alignment.component.css */ "./src/app/sub-super-alignment/sub-super-alignment.component.css")]
        }),
        __metadata("design:paramtypes", [_content_selection_service__WEBPACK_IMPORTED_MODULE_1__["ContentSelectionService"],
            _undo_redo_service__WEBPACK_IMPORTED_MODULE_2__["UndoRedoService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_3__["SelectedStepService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_5__["ModalService"]])
    ], SubSuperAlignmentComponent);
    return SubSuperAlignmentComponent;
}());



/***/ }),

/***/ "./src/app/table-add/table-add.component.css":
/*!***************************************************!*\
  !*** ./src/app/table-add/table-add.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RhYmxlLWFkZC90YWJsZS1hZGQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/table-add/table-add.component.html":
/*!****************************************************!*\
  !*** ./src/app/table-add/table-add.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">ADD</div>\n<div style=\"display: flex\">\n  <div class=\"button\" (click)=\"row()\">Row</div>\n</div>\n<div style=\"display: flex\">\n    <div class=\"button\" (click)=\"column()\">Column</div>\n  </div>\n"

/***/ }),

/***/ "./src/app/table-add/table-add.component.ts":
/*!**************************************************!*\
  !*** ./src/app/table-add/table-add.component.ts ***!
  \**************************************************/
/*! exports provided: TableAddComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TableAddComponent", function() { return TableAddComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TableAddComponent = /** @class */ (function () {
    function TableAddComponent(modal, selection) {
        this.modal = modal;
        this.selection = selection;
    }
    TableAddComponent.prototype.ngOnInit = function () {
    };
    /**
     * Add a new row to the table.
     */
    TableAddComponent.prototype.row = function () {
        // Get the table
        var table = this.selection.canvasInstance.getSelectedLayout().component;
        // Get the children of the table
        var children = table.getChildren();
        // Add another row filled with null and same amount of columns
        children.push(new Array(children[0].length).fill(null));
        // Save the change
        this.selection.canvasInstance.save();
        // Close
        this.modal.remove();
    };
    /**
     * Add a new column to the table.
     */
    TableAddComponent.prototype.column = function () {
        // Get the table
        var table = this.selection.canvasInstance.getSelectedLayout().component;
        // Get the children of the table
        var children = table.getChildren();
        // Add another column by adding null to the end of each row
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var row = children_1[_i];
            row.push(null);
        }
        // Save the change
        this.selection.canvasInstance.save();
        // Close
        this.modal.remove();
    };
    TableAddComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-table-add',
            template: __webpack_require__(/*! ./table-add.component.html */ "./src/app/table-add/table-add.component.html"),
            styles: [__webpack_require__(/*! ./table-add.component.css */ "./src/app/table-add/table-add.component.css")]
        }),
        __metadata("design:paramtypes", [_modal_service__WEBPACK_IMPORTED_MODULE_1__["ModalService"],
            _content_selection_service__WEBPACK_IMPORTED_MODULE_2__["ContentSelectionService"]])
    ], TableAddComponent);
    return TableAddComponent;
}());



/***/ }),

/***/ "./src/app/term-template/term-template.component.css":
/*!***********************************************************!*\
  !*** ./src/app/term-template/term-template.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3Rlcm0tdGVtcGxhdGUvdGVybS10ZW1wbGF0ZS5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/term-template/term-template.component.html":
/*!************************************************************!*\
  !*** ./src/app/term-template/term-template.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<span class=\"selector\"\r\n      *ngFor=\"let template of templates; let idx = index;\"\r\n      (click)=\"apply(idx)\">\r\n{{ template }}\r\n</span>\r\n"

/***/ }),

/***/ "./src/app/term-template/term-template.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/term-template/term-template.component.ts ***!
  \**********************************************************/
/*! exports provided: TermTemplateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TermTemplateComponent", function() { return TermTemplateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/main/helpers */ "../src/main/helpers.ts");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TermTemplateComponent = /** @class */ (function () {
    function TermTemplateComponent(undoRedo, selection, modal) {
        this.undoRedo = undoRedo;
        this.selection = selection;
        this.modal = modal;
        this.templates = [
            '×',
            '⋅',
            '÷',
            '±',
            '≤',
            '≥',
            '≠',
            '≈',
            '≡',
            '∝',
            '∞',
            '∫',
            'α',
            'β',
            'γ',
            'Δ',
            'δ',
            'ε',
            'ζ',
            'η',
            'Θ',
            'θ',
            'ι',
            'κ',
            'Λ',
            'λ',
            'μ',
            'Ξ',
            'ξ',
            'Π',
            'π',
            'ρ',
            'Σ',
            'σ',
            'τ',
            'υ',
            'Φ',
            'φ',
            'χ',
            'Ψ',
            'ψ',
            'Ω',
            'ω'
        ];
    }
    /**
     * Apply a template.
     * @param idx The index of the template in templates.
     */
    TermTemplateComponent.prototype.apply = function (idx) {
        var text = this.templates[idx];
        var newState = this.undoRedo.getStateClone();
        if (!newState.terms) {
            newState.terms = [];
        }
        newState.terms.push(text);
        newState.metrics = Object(_shared_main_helpers__WEBPACK_IMPORTED_MODULE_2__["getMetrics"])(newState);
        this.undoRedo.publishChange(newState);
        this.modal.remove();
    };
    TermTemplateComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-term-template',
            template: __webpack_require__(/*! ./term-template.component.html */ "./src/app/term-template/term-template.component.html"),
            styles: [__webpack_require__(/*! ./term-template.component.css */ "./src/app/term-template/term-template.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _content_selection_service__WEBPACK_IMPORTED_MODULE_3__["ContentSelectionService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_4__["ModalService"]])
    ], TermTemplateComponent);
    return TermTemplateComponent;
}());



/***/ }),

/***/ "./src/app/text-editor/text-editor.component.css":
/*!*******************************************************!*\
  !*** ./src/app/text-editor/text-editor.component.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#text-area {\r\n    border: 1px solid rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.material-icons {\r\n    line-height: 22px;\r\n    font-size: 18px;\r\n    vertical-align: middle;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdGV4dC1lZGl0b3IvdGV4dC1lZGl0b3IuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLDBDQUEwQztBQUM5Qzs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixlQUFlO0lBQ2Ysc0JBQXNCO0FBQzFCIiwiZmlsZSI6InNyYy9hcHAvdGV4dC1lZGl0b3IvdGV4dC1lZGl0b3IuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiN0ZXh0LWFyZWEge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpO1xyXG59XHJcblxyXG4ubWF0ZXJpYWwtaWNvbnMge1xyXG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XHJcbiAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/text-editor/text-editor.component.html":
/*!********************************************************!*\
  !*** ./src/app/text-editor/text-editor.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"title\">EDIT</div>\r\n<div contenteditable=\"true\" #textArea id=\"text-area\" (keydown)=\"checkValid($event)\">Step Text</div>\r\n<div class=\"eqContainer\" #eqContainer></div>\r\n<div class=\"title\">STYLE</div>\r\n<span class=\"selector\" (mousedown)=\"unStyle()\">Normal</span>\r\n<span class=\"selector\" \r\n      *ngFor=\"let style of styleOpts; let idx = index;\" \r\n      [style.backgroundColor]=\"style.text === 'Bold' ? '#111' : style.color\"\r\n      (mousedown)=\"stylePress(idx)\">\r\n  {{ style.text }}\r\n</span>\r\n<div style=\"display: flex\">\r\n  <span class=\"button\" (click)=\"remove()\">Remove Step Text</span>\r\n  <span class=\"button\" (click)=\"apply(textArea.innerHTML)\">Apply</span>\r\n</div>"

/***/ }),

/***/ "./src/app/text-editor/text-editor.component.ts":
/*!******************************************************!*\
  !*** ./src/app/text-editor/text-editor.component.ts ***!
  \******************************************************/
/*! exports provided: TextEditorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextEditorComponent", function() { return TextEditorComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _undo_redo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../undo-redo.service */ "./src/app/undo-redo.service.ts");
/* harmony import */ var _selected_step_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../selected-step.service */ "./src/app/selected-step.service.ts");
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modal.service */ "./src/app/modal.service.ts");
/* harmony import */ var _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../color-picker/color-picker.component */ "./src/app/color-picker/color-picker.component.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers */ "./src/app/helpers.ts");
/* harmony import */ var _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/main/CanvasController */ "../src/main/CanvasController.ts");
/* harmony import */ var _error_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../error.service */ "./src/app/error.service.ts");
/* harmony import */ var _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/main/consts */ "../src/main/consts.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var TextEditorComponent = /** @class */ (function () {
    function TextEditorComponent(undoRedo, step, modal, error) {
        this.undoRedo = undoRedo;
        this.step = step;
        this.modal = modal;
        this.error = error;
        this.anyTagPat = new RegExp('(<([^>]+)>)', 'gi');
        this.openTagPat = new RegExp('(<[^/]([^>]*)>)', 'gi');
        this.closeTagPat = new RegExp('(</([^>]+)>)', 'gi');
        this.styleOpts = Object.keys(_shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["colors"]).map(function (colName) {
            var name = colName === 'default' ? 'Bold' : Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["cap"])(colName);
            var colorArr = _shared_main_consts__WEBPACK_IMPORTED_MODULE_8__["colors"][colName];
            var colStyle = 'rgb(' + colorArr[0] + ',' + colorArr[1] + ',' + colorArr[2] + ')';
            return new _color_picker_color_picker_component__WEBPACK_IMPORTED_MODULE_4__["SelectorData"](colStyle, name);
        });
    }
    /**
     * Apply the changes.
     */
    TextEditorComponent.prototype.apply = function (text) {
        var newState = this.undoRedo.getStateClone();
        newState.steps[this.step.selected].text = text;
        this.undoRedo.publishChange(newState);
        this.modal.remove();
    };
    /**
     * Remove the text from this step.
     */
    TextEditorComponent.prototype.remove = function () {
        var newState = this.undoRedo.getStateClone();
        delete newState.steps[this.step.selected].text;
        this.undoRedo.publishChange(newState);
        this.modal.remove();
    };
    /**
     * Get the value to put in the text area
     * when the component loads.
     */
    TextEditorComponent.prototype.getInitialValue = function () {
        var state = this.undoRedo.getState();
        var stepText = state.steps[this.step.selected].text;
        if (!stepText) {
            return 'Step Text Here';
        }
        else {
            return stepText;
        }
    };
    /**
     * If something is selected, style it.
     * @param styleIdx The index of styleOpts.
     */
    TextEditorComponent.prototype.stylePress = function (styleIdx) {
        // Prepare the tags to be inserted
        var styleOpt = this.styleOpts[styleIdx];
        var startTag;
        if (styleOpt.text === 'Bold') {
            startTag = '<em>';
        }
        else {
            startTag = '<em class="' + Object(_helpers__WEBPACK_IMPORTED_MODULE_5__["deCap"])(styleOpt.text) + '">';
        }
        var endTag = '</em>';
        // Remove existing tags and add new ones
        var _a = this.getHTMLSelection(), start = _a[0], end = _a[1];
        var oldHTML = this.textAreaEl.nativeElement.innerHTML;
        var _b = this.removeTags(oldHTML, start, end), preparedHTML = _b[0], newStart = _b[1], newEnd = _b[2];
        var beforeSelected = preparedHTML.slice(0, newStart);
        var selected = preparedHTML.slice(newStart, newEnd);
        var afterSelected = preparedHTML.slice(newEnd, preparedHTML.length);
        this.textAreaEl.nativeElement.innerHTML = beforeSelected + startTag + selected + endTag + afterSelected;
    };
    /**
     * Remove the styling of the current selection.
     */
    TextEditorComponent.prototype.unStyle = function () {
        var _a = this.getHTMLSelection(), start = _a[0], end = _a[1];
        var newHTML = this.removeTags(this.textAreaEl.nativeElement.innerHTML, start, end)[0];
        this.textAreaEl.nativeElement.innerHTML = newHTML;
    };
    /**
     * Given a string of HTML, remove any effects
     * of em tags within a certain range, while
     * preserving the effects outside the range.
     * Returns the new string, as well as the new
     * positions of the range boundary.
     * CASES TO CONSIDER:  (| = range boundary)
     * 1.        |                    |
     * 2. <em>   |                    |    </em>
     * 3.        |      <em></em>     |
     * 4. <em>   |        </em>       |
     * 5.        |        <em>        |    </em>
     * 6. <em>   |     </em><em>      |    </em>
     * 7. <em>   | </em><em></em><em> |    </em>
     * @param htmlString The string of HTML.
     * @param startInc The character at start of range (0-based, inclusive).
     * @param endExc The character at end of range (0-based, exclusive).
     */
    TextEditorComponent.prototype.removeTags = function (htmlString, startInc, endExc) {
        var beforeRange = htmlString.slice(0, startInc);
        var range = htmlString.slice(startInc, endExc);
        var afterRange = htmlString.slice(endExc, htmlString.length);
        var openBeforeIdx = this.lastIndexOf(beforeRange, this.openTagPat);
        var closeBeforeIdx = this.lastIndexOf(beforeRange, this.closeTagPat);
        var openAfterIdx = this.indexOf(afterRange, this.openTagPat);
        var closeAfterIdx = this.indexOf(afterRange, this.closeTagPat);
        // cases 2, 4, 6, 7
        if (openBeforeIdx > closeBeforeIdx) {
            beforeRange += '</em>';
            startInc += 5;
            endExc += 5;
        }
        // cases 2, 5, 6, 7
        if ((closeAfterIdx !== -1 && openAfterIdx === -1) || openAfterIdx > closeAfterIdx) {
            // Find the opening tag for the closing tag after the range
            // (which won't be in the after range portion.)
            var beforeAfterRange = beforeRange + range;
            var openTag = this.extractTag(beforeAfterRange, this.openTagPat, true);
            afterRange = openTag + afterRange;
        }
        // cases 3-7
        var rangeLenBefore = range.length;
        range = range.replace(this.anyTagPat, '');
        endExc -= rangeLenBefore - range.length;
        return [beforeRange + range + afterRange, startInc, endExc];
    };
    /**
     * Looks for an HTML tag in a string, and returns its
     * substring. Finds the tag closest to the end of the string.
     * Returns undefined if none found.
     * @param str The string to look in.
     * @param pat The pattern for the HTML tag. Must find matches ending in '>'.
     * @param backwards Whether to start the search from the rear of the string.
     */
    TextEditorComponent.prototype.extractTag = function (str, pat, backwards) {
        var searchFunc = backwards ? this.lastIndexOf : this.indexOf;
        var startIdx = searchFunc(str, pat);
        if (startIdx === -1) {
            return undefined;
        }
        var endSearchStr = str.substring(startIdx, str.length);
        var endIdx = endSearchStr.indexOf('>');
        return endSearchStr.substring(0, endIdx + 1);
    };
    /**
     * Return the starting and ending offset
     * of what is selected, relative to the HTML
     * of the text area as opposed to the visual
     * content. If there is no selection, throw
     * an error.
     */
    TextEditorComponent.prototype.getHTMLSelection = function () {
        var range = window.getSelection().getRangeAt(0);
        if (range.startContainer === range.endContainer && range.startOffset === range.endOffset) {
            // TODO: Put an error in the UI.
            this.error.text = 'Select Text First';
            throw new Error('Select text first.');
        }
        var start = this.getInnerHTMLOffset(range.startOffset, range.startContainer, true);
        var end = this.getInnerHTMLOffset(range.endOffset, range.endContainer, false);
        return [start, end];
    };
    /**
     * Converts an offset relative to a child node of
     * the text area element to be relative to the
     * inner HTML of the text area element.
     * @param nodeOffset The offset relative to a child node
     *                   of the text area element.
     * @param node The node the above param is relative to.
     * @param expandLeft  Whether to include opening tags to the left
     *                    of the offset. If false, include closing tags
     *                    to the right.
     */
    TextEditorComponent.prototype.getInnerHTMLOffset = function (nodeOffset, node, expandLeft) {
        var ta = this.textAreaEl.nativeElement;
        // Get rid of adjacent text nodes.
        ta.normalize();
        var children = ta.childNodes;
        var innerHTML = ta.innerHTML;
        var idxOfNodeWithOffset;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            // EMs are children, which have text nodes as children
            if (child.nodeName !== '#text') {
                child = child.firstChild;
            }
            if (child === node) {
                idxOfNodeWithOffset = i;
                break;
            }
        }
        var cursor;
        var currChild = innerHTML.charAt(0) === '<' ? -1 : 0;
        var currChildStartIdx = 0;
        var tagLastIteration = false;
        for (cursor = 0; cursor <= innerHTML.length; cursor++) {
            if (currChild === idxOfNodeWithOffset && cursor === currChildStartIdx + nodeOffset) {
                // Found the selected position, but there's a catch:
                // if there is an opening tag directly before, or closing
                // tag directly after, we want to place the cursor on the
                // other side.
                var beforeCursor = innerHTML.slice(0, cursor);
                var afterCursor = innerHTML.slice(cursor, innerHTML.length);
                var lastOpenTagBeforeCursor = this.extractTag(beforeCursor, this.openTagPat, true);
                var firstCloseTagAfterCursor = this.extractTag(afterCursor, this.closeTagPat, false);
                if (expandLeft && beforeCursor.endsWith(lastOpenTagBeforeCursor)) {
                    // Shift to before
                    cursor -= lastOpenTagBeforeCursor.length;
                }
                else if (!expandLeft && afterCursor.startsWith(firstCloseTagAfterCursor)) {
                    // Shift to after
                    cursor += firstCloseTagAfterCursor.length;
                }
                return cursor;
            }
            var char = innerHTML.charAt(cursor);
            if (char === '<') {
                // Possibly the start or end of an HTML tag, either signifying the next element
                var restOf = innerHTML.slice(cursor);
                var startOfTag = restOf.search(this.anyTagPat) === 0;
                if (startOfTag) {
                    if (!tagLastIteration) {
                        // If we have <em></em><em></em>, there is only one transition between children
                        currChild++;
                    }
                    var endOfTagIdx = restOf.indexOf('>');
                    // Put cursor at end of tag, next iteration pushes it to right place
                    cursor += endOfTagIdx;
                    currChildStartIdx = cursor + 1;
                    tagLastIteration = true;
                }
            }
            else {
                tagLastIteration = false;
            }
        }
        throw new Error('Could not find position within HTML.');
    };
    /**
     * Find the starting index of a pattern in
     * a string, searching backwards. Make sure
     * the 'g' flag is enabled in the pattern.
     * @param str The string to search in.
     * @param pattern The pattern to match.
     */
    TextEditorComponent.prototype.lastIndexOf = function (str, pattern) {
        var match = str.match(pattern);
        if (!match) {
            return -1;
        }
        return str.lastIndexOf(match[match.length - 1]);
    };
    /**
     * Find the starting index of a pattern in
     * a string.
     * @param str The string to find an index in.
     * @param pattern The pattern to match.
     */
    TextEditorComponent.prototype.indexOf = function (str, pattern) {
        var match = str.match(pattern);
        if (!match) {
            return -1;
        }
        return str.indexOf(match[0]);
    };
    /**
     * Show an updated version of the preview.
     */
    TextEditorComponent.prototype.updatePreview = function () {
        var state = this.undoRedo.getStateClone();
        state.steps = [state.steps[this.step.selected]];
        state.steps[0].text = undefined;
        delete state.autoplay;
        this.eqContainerEl.nativeElement.innerHTML = '';
        var canv = new _shared_main_CanvasController__WEBPACK_IMPORTED_MODULE_6__["default"](this.eqContainerEl.nativeElement, state);
    };
    /**
     * Called when a key is down. If it is not a valid
     * key, cancel the typing.
     */
    TextEditorComponent.prototype.checkValid = function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    };
    TextEditorComponent.prototype.ngAfterViewInit = function () {
        this.textAreaEl.nativeElement.innerHTML = this.getInitialValue();
        this.textAreaEl.nativeElement.focus();
        this.updatePreview();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('textArea'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], TextEditorComponent.prototype, "textAreaEl", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('eqContainer'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], TextEditorComponent.prototype, "eqContainerEl", void 0);
    TextEditorComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-text-editor',
            template: __webpack_require__(/*! ./text-editor.component.html */ "./src/app/text-editor/text-editor.component.html"),
            styles: [__webpack_require__(/*! ./text-editor.component.css */ "./src/app/text-editor/text-editor.component.css")]
        }),
        __metadata("design:paramtypes", [_undo_redo_service__WEBPACK_IMPORTED_MODULE_1__["UndoRedoService"],
            _selected_step_service__WEBPACK_IMPORTED_MODULE_2__["SelectedStepService"],
            _modal_service__WEBPACK_IMPORTED_MODULE_3__["ModalService"],
            _error_service__WEBPACK_IMPORTED_MODULE_7__["ErrorService"]])
    ], TextEditorComponent);
    return TextEditorComponent;
}());



/***/ }),

/***/ "./src/app/tool-bar/tool-bar.component.css":
/*!*************************************************!*\
  !*** ./src/app/tool-bar/tool-bar.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#outer {\r\n    padding: 10px;\r\n    border-bottom: 1px solid rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.flex {\r\n    display: flex;\r\n    flex-direction: row;\r\n    align-items: center;\r\n}\r\n\r\n.icon {\r\n    cursor: pointer;\r\n    padding: 5px 10px 5px 10px;\r\n    color: rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.active {\r\n    color: rgba(255, 255, 255, 1);\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdG9vbC1iYXIvdG9vbC1iYXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGFBQWE7SUFDYixpREFBaUQ7QUFDckQ7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLG1CQUFtQjtBQUN2Qjs7QUFFQTtJQUNJLGVBQWU7SUFDZiwwQkFBMEI7SUFDMUIsK0JBQStCO0FBQ25DOztBQUVBO0lBQ0ksNkJBQTZCO0FBQ2pDIiwiZmlsZSI6InNyYy9hcHAvdG9vbC1iYXIvdG9vbC1iYXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNvdXRlciB7XHJcbiAgICBwYWRkaW5nOiAxMHB4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKTtcclxufVxyXG5cclxuLmZsZXgge1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG59XHJcblxyXG4uaWNvbiB7XHJcbiAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICBwYWRkaW5nOiA1cHggMTBweCA1cHggMTBweDtcclxuICAgIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyk7XHJcbn1cclxuXHJcbi5hY3RpdmUge1xyXG4gICAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMSk7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/tool-bar/tool-bar.component.html":
/*!**************************************************!*\
  !*** ./src/app/tool-bar/tool-bar.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"outer\" class=\"flex\" (click)=\"interceptClick($event);\">\r\n    <div class=\"flex\">\r\n        <div    class=\"icon material-icons\" \r\n                (click)=\"icon.onClick($event)\" \r\n                *ngFor=\"let icon of leftIcons\" \r\n                [ngClass]=\"{'active': icon.isActive()}\">\r\n            {{ icon.name }}\r\n        </div>\r\n    </div>\r\n    <div style=\"flex-grow: 1\"></div>\r\n    <div class=\"flex\">\r\n            <div    class=\"icon material-icons\" \r\n                    (click)=\"icon.onClick($event)\" \r\n                    *ngFor=\"let icon of rightIcons\" \r\n                    [ngClass]=\"{'active': icon.isActive()}\">\r\n                {{ icon.name }}\r\n            </div>\r\n        </div>\r\n</div>"

/***/ }),

/***/ "./src/app/tool-bar/tool-bar.component.ts":
/*!************************************************!*\
  !*** ./src/app/tool-bar/tool-bar.component.ts ***!
  \************************************************/
/*! exports provided: ToolBarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolBarComponent", function() { return ToolBarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _content_selection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../content-selection.service */ "./src/app/content-selection.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ToolBarComponent = /** @class */ (function () {
    function ToolBarComponent(selection) {
        this.selection = selection;
    }
    ToolBarComponent.prototype.ngOnInit = function () {
    };
    /**
     * Deselect, or don't, depending on the state.
     * @param e The mouse event.
     */
    ToolBarComponent.prototype.interceptClick = function (e) {
        if (this.selection.selectedOnCanvas) {
            e.stopPropagation();
        }
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], ToolBarComponent.prototype, "leftIcons", void 0);
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], ToolBarComponent.prototype, "rightIcons", void 0);
    ToolBarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-tool-bar',
            template: __webpack_require__(/*! ./tool-bar.component.html */ "./src/app/tool-bar/tool-bar.component.html"),
            styles: [__webpack_require__(/*! ./tool-bar.component.css */ "./src/app/tool-bar/tool-bar.component.css")]
        }),
        __metadata("design:paramtypes", [_content_selection_service__WEBPACK_IMPORTED_MODULE_1__["ContentSelectionService"]])
    ], ToolBarComponent);
    return ToolBarComponent;
}());



/***/ }),

/***/ "./src/app/undo-redo.service.ts":
/*!**************************************!*\
  !*** ./src/app/undo-redo.service.ts ***!
  \**************************************/
/*! exports provided: UndoRedoService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UndoRedoService", function() { return UndoRedoService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/app/helpers.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// The total amount of objects that may be stored
var MAX_SIZE = 100;
var UndoRedoService = /** @class */ (function () {
    function UndoRedoService() {
        this.history = [];
        this.currentStateIdx = -1;
        this.subscribers = [];
        this.redo = this.redo.bind(this);
        this.canRedo = this.canRedo.bind(this);
        this.undo = this.undo.bind(this);
        this.canUndo = this.canUndo.bind(this);
    }
    /**
     * Subscribe to changes in the current state.
     * @param changeFunction Function that will be passed the current state when it changes.
     */
    UndoRedoService.prototype.subscribe = function (changeFunction) {
        this.subscribers.push(changeFunction);
    };
    /**
     * Notify subscribers the state has changed.
     */
    UndoRedoService.prototype.notifySubscribers = function () {
        var currState = this.history[this.currentStateIdx];
        this.subscribers.forEach(function (func) {
            func(currState);
        });
    };
    /**
     * Make a change to the current state.
     * @param newState The new current state.
     */
    UndoRedoService.prototype.publishChange = function (newState) {
        // Erase any redos ahead of this change
        this.history.splice(this.currentStateIdx + 1, this.history.length);
        // Add the new state
        this.history.push(newState);
        this.currentStateIdx++;
        // Trim the size if necessary
        var numToRemove = this.history.length - MAX_SIZE;
        if (numToRemove > 0) {
            this.history.splice(0, numToRemove);
            this.currentStateIdx -= numToRemove;
        }
        // Notify subscribers of change
        this.notifySubscribers();
    };
    /**
     * Whether there are changes to be undone.
     */
    UndoRedoService.prototype.canUndo = function () {
        return this.currentStateIdx > 0;
    };
    /**
     * Undo the last change.
     */
    UndoRedoService.prototype.undo = function () {
        var newIdx = this.currentStateIdx - 1;
        if (newIdx < 0) {
            throw new Error('Cannot undo.');
        }
        this.currentStateIdx = newIdx;
        this.notifySubscribers();
    };
    /**
     * Whether there are changes to be redone.
     */
    UndoRedoService.prototype.canRedo = function () {
        return this.currentStateIdx < this.history.length - 1;
    };
    /**
     * Redo the last undo.
     */
    UndoRedoService.prototype.redo = function () {
        var newIdx = this.currentStateIdx + 1;
        if (newIdx >= this.history.length) {
            throw new Error('Cannot redo');
        }
        this.currentStateIdx = newIdx;
        this.notifySubscribers();
    };
    /**
     * Get the current state.
     */
    UndoRedoService.prototype.getState = function () {
        return this.history[this.currentStateIdx];
    };
    /**
     * Get a deep clone of the current state.
     * Useful for making changes then publishing.
     */
    UndoRedoService.prototype.getStateClone = function () {
        return Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["deepClone"])(this.getState());
    };
    /**
     * Remove all stored states.
     */
    UndoRedoService.prototype.erase = function () {
        this.history = [];
        this.currentStateIdx = -1;
    };
    /**
     * Return the stored states and the index
     * of the current one.
     */
    UndoRedoService.prototype.getHistory = function () {
        return [this.history, this.currentStateIdx];
    };
    /**
     * Restore the states from earlier.
     * @param saved Obtained from getHistory() earlier.
     */
    UndoRedoService.prototype.setHistory = function (saved) {
        this.history = saved[0];
        this.currentStateIdx = saved[1];
        this.notifySubscribers();
    };
    UndoRedoService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        })
        /**
         * A service storing a history of the configuration
         * file as it has been edited. The configuration file
         * is the one converted into JSON for storage, describing
         * the animation.
         */
        ,
        __metadata("design:paramtypes", [])
    ], UndoRedoService);
    return UndoRedoService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\mathi\Desktop\Github\Math-Animations\creator\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map