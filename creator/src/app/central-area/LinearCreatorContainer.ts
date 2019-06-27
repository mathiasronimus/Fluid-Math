import CreatorContainer from './CreatorContainer';
import EqComponent from '@shared/layout/EqComponent';

export default interface LinearCreatorContainer extends CreatorContainer {

    /**
     * Throws if toAdd is not valid.
     */
    addValid(toAdd: EqComponent<any>): void;
}
