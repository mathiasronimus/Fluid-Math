import { ComponentModel, containerParsers } from '@shared/main/ComponentModel';
import { FileFormat, ContainerFormat } from '@shared/main/FileFormat';
import HDivider from '@shared/layout/HDivider';
import { creatorHDividerPadding, creatorVDividerPadding, vDividerPadding, hDividerPadding } from '@shared/main/consts';
import VDivider from '@shared/layout/VDivider';
import EqContainer from '@shared/layout/EqContainer';

export default class CreatorComponentModel extends ComponentModel {

    constructor(file: FileFormat) {
        super(file);
        const hDividers = this.content.get('h');
        const numHDividers = hDividers.length;
        hDividers.length = 0;
        for (let i = 0; i < numHDividers; i++) {
            hDividers.push(new HDivider(creatorHDividerPadding, 'h' + i));
        }
        const vDividers = this.content.get('v');
        const numVDividers = vDividers.length;
        vDividers.length = 0;
        for (let i = 0; i < numVDividers; i++) {
            vDividers.push(new VDivider(creatorVDividerPadding, 'v' + i));
        }
    }

    addVDivider(): VDivider {
        const vDividers = this.content.get('v');
        const newDivider = new VDivider(vDividerPadding, 'v' + vDividers.length);
        vDividers.push(newDivider);
        return newDivider;
    }

    addHDivider(): HDivider {
        const hDividers = this.content.get('h');
        const newDivider = new HDivider(hDividerPadding, 'h' + hDividers.length);
        hDividers.push(newDivider);
        return newDivider;
    }

    /**
     * Return the amount of radicals there are currently.
     */
    numRadicals(): number {
        return this.content.get('r').length;
    }

    /**
     * Return the amount of v dividers there are currently.
     */
    numVDividers(): number {
        return this.content.get('v').length;
    }

    /**
     * Return the amount of h dividers there are currently.
     */
    numHDividers(): number {
        return this.content.get('h').length;
    }

    /**
     * Parse a container object recursively and return its
     * class representation.
     * Override to prefix the type with 'creator-' to
     * allow customization of behavior.
     * @param containerObj The container object to parse.
     * @param depth The depth in the container hierarchy.
     */
    parseContainer(containerObj: ContainerFormat, depth: number): EqContainer<any> {
        return containerParsers['creator-' + containerObj.type](
            containerObj,
            depth,
            this.getContent,
            this.parseContainer,
            this.genInfo
        );
    }
}
