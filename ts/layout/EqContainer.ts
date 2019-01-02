import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';

export default abstract class EqContainer extends EqComponent {

    protected children: EqComponent[];

    constructor(children: EqComponent[], padding: Padding) {
        super(padding);
        this.children = children;
    }

    getChildren(): EqComponent[] {
        return this.children;
    }
}