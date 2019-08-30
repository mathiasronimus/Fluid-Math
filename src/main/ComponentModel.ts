import { FileFormat, ContainerFormat } from "./FileFormat";
import EqContent from "../layout/EqContent";
import { Map, newMap } from "./helpers";
import EqContainer from "../layout/EqContainer";

/**
 * Passed to content decorator function to specify various things.
 */
interface ContentSpec {
    // The identifying character that makes the first character
    // of content references in the JSON files.
    character: string;
    // Function to initialize the content from the JSON file
    // and general info.
    initialize: (file: FileFormat, genInfo: object) => EqContent<any>[];
    // Function to calculate general content information that
    // any content may need. Called before the other function.
    // General info is stored in an object.
    calcInfo?: (file: FileFormat, genInfo: object) => void;
}

const contentSpecs: ContentSpec[] = [];

export function Content(contentSpec: ContentSpec) {
    contentSpecs.push(contentSpec);
    return (construc: Function) => {};
}

// The function type used by containers to return instances of themselves.
type parseFunc = (
    containerObj: ContainerFormat,
    depth: number,
    contentGetter: (ref: string) => EqContent<any>,
    containerGetter: (obj: ContainerFormat, depth: number) => EqContainer<any>,
    genInfo: object
) => EqContainer<any>;

/**
 * Passed to container decorator function to specify various things.
 */
interface ContainerSpec {
    // The identifying string of the container, as specified in
    // main/FileFormat.ContainerFormat.
    typeString: string;
    // The parser of the contaier
    parse: parseFunc;
}

export const containerParsers: {[typeString: string]: parseFunc} = {};

export function Container(containerSpec: ContainerSpec) {
    containerParsers[containerSpec.typeString] = containerSpec.parse;
    return (construc: Function) => {};
}

/**
 * Stores content/container information for a Canvas Controller in a way that's
 * modular. The decorator function above is used to mark content usable
 * here, and specifies how to load and store it.
 */
export class ComponentModel {

    protected genInfo = {};
    protected content: Map<string, EqContent<any>[]> = newMap();

    /**
     * Initialize the component model and the content
     * in the file.
     * @param file The file.
     */
    constructor(file: FileFormat) {
        // Initialize general info
        contentSpecs.forEach(spec => {
            if (spec.calcInfo) {
                spec.calcInfo(file, this.genInfo);
            }
        });
        // Initialize content
        contentSpecs.forEach(spec => {
            this.content.set(spec.character, spec.initialize(file, this.genInfo));
        });

        this.getContent = this.getContent.bind(this);
        this.parseContainer = this.parseContainer.bind(this);
    }

    /**
     * Call a function for all content.
     * @param callback The function.
     */
    forAllContent(callback: (content: EqContent<any>) => void) {
        this.content.forEach(contentArr => {
            contentArr.forEach(content => {
                callback(content);
            });
        });
    }

    /**
     * Get content by its reference.
     * @param ref The content reference.
     */
    getContent(ref: string): EqContent<any> {
        const contentType: string = ref.substring(0, 1);
        const contentIndex: number = parseFloat(ref.substring(1, ref.length));
        return this.content.get(contentType)[contentIndex];
    }

    /**
     * Parse a container object recursively and return its
     * class representation.
     * @param containerObj The container object to parse.
     * @param depth The depth in the container hierarchy.
     */
    parseContainer(containerObj: ContainerFormat, depth: number): EqContainer<any> {
        return containerParsers[containerObj.type](
            containerObj,
            depth,
            this.getContent,
            this.parseContainer,
            this.genInfo
        );
    }

    /**
     * Set general info that content/containers might need
     * to initialize.
     * @param key The name of the info.
     * @param val The info.
     */
    setGenInfo(key: string, val: any) {
        this.genInfo[key] = val;
    }

}