import Padding from '../layout/Padding';
import bezier from 'bezier-easing';

// The DEFAULT Google font, may be overridden.
export const defaultFontFamily = 'PT Serif'
// Normal or italic
export const defaultFontStyle = 'Normal'
// Must be supported by the google font
export const defaultFontWeight = '400'
// The font size at each width tier below
export const fontSizes = [35, 30, 25]
// The tiers at which font size will change.
// More tiers means better layout but worse
// file size.
export const widthTiers = [670, 500, 300]
// Tuning variable, turn down for better
// performance when loading files without
// inbuilt metrics.Too low will give layout
// innacuracies.
export const testCanvasFontSizeMultiple = 5
// The width of the test canvas. Once again,
// can turn down for better performance, but
// will limit the maximum width of terms.
export const testCanvasWidth = 10000
// The opacity of the progress bar
export const progressOpacity = 0.25

// Layout:
export const defaultVBoxPadding = 0
export const defaultRootVBoxPadding = new Padding(18, 0, 20, 0)
export const defaultHBoxPadding = 0
export const defaultTightHBoxPadding = 0
export const defaultSubSuperPadding = Padding.even(0)
export const defaultRootPadding = Padding.even(0)
export const defaultQuizPadding = new Padding(0, 10, 0, 10)
export const defaultTablePadding = Padding.even(2)
export const termPadding = new Padding(10, 5, 10, 5)
export const tightTermPadding = new Padding(5, 2, 5, 2)
export const hDividerPadding = new Padding(0, 3, 0, 3)
export const vDividerPadding = new Padding(3, 0, 3, 0)
export const tableCellPadding = new Padding(7, 7, 7, 7)
export const tableMinCellDimen = 30
// The scaling of exponents and subscripts.
export const expScale = 0.575
// The proportion of exponents and subscripts that portrudes from the component they're 'attached' to.
export const defaultExpPortrusion = 0.1

// Roots:
export const rootArgMarginLeft = 7
export const rootIndexScale = 0.5
// The angle the small tip of the radical kink makes
// to the rest of the kink.
export const rootKinkTipAngle = Math.PI / 2
export const rootKinkTipLength = 3

// Curved outlines:
export const curvedOutlineBorderRadius = 5
export const curvedOutlineDefaultOpacity = 0.3
export const curvedOutlineColor = [255, 255, 255] as [number, number, number]

// Radio buttons:
export const radioButtonDefaultOpacity = 0.3
export const radioButtonColor = [255, 255, 255] as [number, number, number]

// Quizzes:
export const answerVMargin = 20
export const hoveredOutlineOpacity = 0.75
export const revealedOutlineOpacity = 1
export const outlineFadeInDuration = 300
export const outlineFadeInEasing = bezier(0.5, 0.5, 0.5, 0.5)
export const quizCorrectColor = [100, 221, 23] as [number, number, number]
export const quizIncorrectColor = [198, 40, 40] as [number, number, number]
export const quizCurvedOutlinePadding = new Padding(0, 5, 0, 5)
export const quizRadioButtonDimen = 35
export const quizRadioButtonPadding = Padding.even(10)
export const quizRadioButtonSelectDuration = 300
export const quizRadioButtonSelectEasing = bezier(0.0, 0.0, 0.2, 1)
export const quizRadioButtonDeselectDuration = 300
export const quizRadioButtonDeselectEasing = bezier(0.4, 0.0, 1, 1)

// Creator:
export const creatorContainerPadding = Padding.even(30)
export const creatorHDividerPadding = new Padding(5, 15, 5, 15)
export const creatorVDividerPadding = new Padding(15, 5, 15, 5)
export const creatorSelectableHDividerPadding = new Padding(5, 0, 5, 0)
export const creatorSelectableVDividerPadding = new Padding(0, 5, 0, 5)
export const creatorContainerStroke = "rgb(175, 175, 175)"
export const creatorCaretFillStyle = '#eee'
export const creatorCaretFillStyleLighter = '#777'
export const creatorCaretSize = 5
export const creatorLineDash = [2]
export const creatorErrorTimeout = 5000
export const creatorTableMinCellDimen = 30
export const creatorPlusLineHalfLength = 5

// Animations: durations are in MS
export const defaultAddDuration = 700
export const addEasing = bezier(0.0, 0.0, 0.2, 1)
export const defaultMoveDuration = 700
export const moveEasing = bezier(0.4, 0.0, 0.2, 1)
export const defaultRemoveDuration = 400
export const removeEasing = bezier(0.4, 0.0, 1, 1)
export const progressEasing = bezier(0.4, 0.0, 0.2, 1)
export const autoplayProgressEasing = bezier(0.5, 0.5, 0.5, 0.5)

// Appearance:
export const colors = {
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
} as { [cName: string]: [number, number, number] }
export const fadedOpacity = 0.5
export const normalOpacity = 0.75
export const focusedOpacity = 1
export const backgroundColor = [0, 0, 0] as [number, number, number]

// Button animations:
export const buttonHighlightedOpacity = 1
export const buttonHighlightDuration = 200
export const buttonHighlightEasing = bezier(0.0, 0.0, 0.2, 1)
export const buttonUnhighlightDuration = 200
export const buttonUnhighlightEasing = bezier(0.4, 0.0, 1, 1)