import EqContainer from './EqContainer';
import EqComponent from './EqComponent';
import Padding from './Padding';
import Frame from '../animation/Frame';

export default class HBox extends EqContainer {

    constructor(children: EqComponent[], padding: Padding) {
        super(children, padding);
    }

    protected calcHeight(): number {
        let maxHeight = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();
            if (childHeight > maxHeight) {
                maxHeight = childHeight;
            }
        }
        return maxHeight + this.padding.height();
    }

    protected calcWidth(): number {
        let totalWidth = 0;
        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            totalWidth += currChild.getWidth();
        }
        return totalWidth + this.padding.width();
    }

    addDrawable(parentFrame: Frame, drawables: Frame[], tlx: number, tly: number, currScale: number): Frame {
        let frame = new Frame(parentFrame, this, tlx, tly, this.getWidth(), this.getHeight(), currScale);
        const innerHeight = this.getHeight() - this.padding.height();
        let upToX = tlx + this.padding.left;

        for (let i = 0; i < this.children.length; i++) {
            let currChild = this.children[i];
            let childHeight = currChild.getHeight();

            //Position child in the middle vertically
            let childTLY = (innerHeight - childHeight) / 2 + this.padding.top + tly;
            upToX += currChild.addDrawable(frame, drawables, upToX, childTLY, currScale).width;
        }
        

        drawables.push(frame);

        return frame;
    }
}