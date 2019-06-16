
/**
 * Animation files are in the JSON format
 * described by this interface.
 */
export interface FileFormat {
    // Required. Stores information pertaining to each step.
    // Must have at least 1 Step Object.
    steps: StepFormat[];
    // Required. A list of strings, each string representing
    // the text of a Term.
    terms: string[];
    // Optional. The amount of horizontal dividers in the
    // animation. If not present, there are none.
    hDividers?: number;
    // Optional. The amount of radicals in the
    // animation. If not present, there are none.
    radicals?: number;
    // Optional. Contains the dimensions of each term for
    // each different font size. If not present, this
    // will be calculated on the player with some 
    // overhead.
    metrics?: MetricsFormat[];
    // Optional. Despite the name, defines options relating
    // to particular transitions between steps, rather than the steps
    // themselves. The transition number is defined as the
    // number of the step we are at before the transition,
    // when playing the animation in a forward direction.
    // The transition number is the index of the array.
    stepOpts?: TransitionOptionsFormat[];
    // Optional. If it is desired for the canvas to stay
    // the same height regardless of the step, this array
    // defines the height it should stay at for each font
    // size (as the font size will change the height of the
    // whole layout).
    maxHeights?: number[];
    // Optionally defines a custom font to be used in this
    // animation.
    font?: FontFormat;
}

export interface StepFormat {
    // The text that will be displayed above the canvas
    // for the step. May contain HTML tags.
    // If there is only one step and this is not defined,
    // nothing will be shown above the canvas. If there
    // is more than one step and this is not defined, 
    // the text 'undefined' will show for that step.
    text?: string;
    // Required. The container at the root of the layout,
    // I.E the container that stores everything else.
    root: ContainerFormat;
    // Object used like a map to determine the color of
    // each content piece in this step. Key is a content
    // reference, value is a key of constants.colors.
    // If not defined, all content has the default color.
    color?: object;
    // Object used like a map to determine the opacity of
    // each content piece in this step. Key is a content
    // reference, value the opacity as a decimal.
    // If not defined, all content has the default opacity.
    opacity?: object;
}

export interface ContainerFormat {
    // Each container has a unique string identifying
    // its type.
    type: string;
}

// Format for type = vbox, hbox, or tightHBox
export interface LinearContainerFormat extends ContainerFormat {
    // An ordered list of the children inside
    // the container. If the array element is 
    // a string, it represents the content 
    // reference of a content piece. Otherwise,
    // it is another container. Order is defined
    // as top to bottom, left to right.
    children: (string | ContainerFormat)[];
}

// Format for type = subSuper
export interface SubSuperContainerFormat extends ContainerFormat {
    // The following are effectively turned
    // into HBoxes:

    // The containers/content in the exponent
    top: (string | ContainerFormat)[];
    // The containers/content in the base
    middle: (string | ContainerFormat)[];
    // The containers/content in the subscript
    bottom: (string | ContainerFormat)[];

    // The proportion of the height of the
    // top/bottom that portrude vertically
    // from the middle as a decimal. If not
    // defined, is set to a default amount
    // suitable for an exponent/subscript 
    // with a single character height.
    portrusion?: number;
}

// Format for type = root
export interface RootContainerFormat extends ContainerFormat {
    // The following are effectively turned into
    // HBoxes:

    // The containers/content in the index
    // of the root (e.g for a cube root, would
    // be 3).
    idx: (string | ContainerFormat)[];
    // The containers/content under the radical
    // (i.e what is being rooted).
    arg: (string | ContainerFormat)[];
    // The content reference of the radical in
    // this container. The radical is the content
    // that actually draws the line of the root.
    // If not present, this will not be drawn.
    rad?: string;
}

export interface MetricsFormat {
    // The width of each Term for this font size.
    // In the same order as the terms array.
    widths: number[];
    // The ascent for the terms at this font size.
    // This is a property of the font itself, so
    // does not need to be defined for each term.
    ascent: number;
    // The max height of any term in this animation
    // at this font size. All terms are set with this
    // height so they align vertically.
    height: number;
}

export interface TransitionOptionsFormat {
    // Defines clone animations in this transition, if any.
    // These are when a new piece of content is introduced
    // and it appears to come from another content piece.
    clones?: {[contentReferenceOfNewContent: string]: string}
    // Defines merge animations in this transition, if any.
    // These are when a piece of content is removed, and it
    // appears to merge into another content piece.
    merges?: {[contentReferenceOfRemovedContent: string]: string}
    // Defines eval animations in this transition, if any.
    // These are the same as merges, except the merging
    // content becomes less visible as it travels, making
    // it ideal if the merger and mergee don't look the same.
    evals?: {[contentReferenceOfRemovedContent: string]: string}
    // If present, sets the duration of add animations to be
    // something else than the default (in MS)
    addDuration?: number;
    // If present, sets the duration of move animations to be
    // something else than the default (in MS)
    moveDuration?: number;
    // If present, sets the duration of remove animations to be
    // something else than the default (in MS)
    removeDuration?: number;
}

export interface FontFormat {
    // The type of custom font to load.
    type: string;
}

// The font format for type = g
export interface GoogleFontFormat extends FontFormat {
    // The name, exactly as would be passed to the Google
    // web font loader to load the font.
    name: string;
}

// The font format for type = c
export interface CustomFontFormat extends FontFormat {
    // The name of the font. Doesn't matter much, as long
    // as it doesn't conflict with other fonts being used.
    name: string;
    // The style of the font. Either 'normal' or 'italic'.
    style: string;
    // The weight of the font, i.e '400'.
    weight: string;
    // The URL used to load the font, whether relative
    // to the project or hosted on a seperate website.
    src: string;
}