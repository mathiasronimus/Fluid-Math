import EqComponent from './EqComponent';
import LayoutState from '../animation/LayoutState';
import Padding from './Padding';

/**
 * Umbrella class for all containers. Doesn't declare anything, but useful for
 * checking if a variable is a container using instanceof.
 */
export default abstract class EqContainer<L extends LayoutState> extends EqComponent<L> {

    constructor(padding: Padding) {
        super(padding);
    }
}