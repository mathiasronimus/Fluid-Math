import { ComponentModel } from '@shared/main/ComponentModel';
import { FileFormat, ContainerFormat, TableFormat } from '@shared/main/FileFormat';
import HDivider from '@shared/layout/HDivider';
import VDivider from '@shared/layout/VDivider';
import { creatorSelectableHDividerPadding, creatorSelectableVDividerPadding, defaultTablePadding } from '@shared/main/consts';
import EqContainer from '@shared/layout/EqContainer';
import TableContainer, { parseChildren2D, parseChildrenObj } from '@shared/layout/TableContainer';
import Padding from '@shared/layout/Padding';

export default class SelectableComponentModel extends ComponentModel {

    constructor(file: FileFormat) {
        super(file);
        // Give dividers more padding to be selectable
        const hDividers = this.content.get('h');
        const numHDividers = hDividers.length;
        hDividers.length = 0;
        for (let i = 0; i < numHDividers; i++) {
            hDividers.push(new HDivider(creatorSelectableHDividerPadding, 'h' + i));
        }
        const vDividers = this.content.get('v');
        const numVDividers = vDividers.length;
        vDividers.length = 0;
        for (let i = 0; i < numVDividers; i++) {
            vDividers.push(new VDivider(creatorSelectableVDividerPadding, 'v' + i));
        }
        // For customizing table display
        (this.genInfo as any).isSelectable = true;
    }

    // Override to make tables display differently
    parseContainer(containerObj: ContainerFormat, depth: number): EqContainer<any> {
        if (containerObj.type === 'table') {
            // Selectable table, make line stroke bigger
            const format = containerObj as TableFormat;
            const children = parseChildren2D(format.children, this.parseContainer, this.getContent);
            return new TableContainer(
                defaultTablePadding,
                children,
                parseChildrenObj(format.hLines, this.getContent),
                parseChildrenObj(format.vLines, this.getContent),
                11,
                Padding.even(0)
            );
        } else {
            return super.parseContainer(containerObj, depth);
        }
    }
}
