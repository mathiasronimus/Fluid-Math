import { ContainerFormat } from '@shared/main/FileFormat';
import _ from 'lodash';

/**
 * Recursively checks if a reference
 * exists inside a step layout.
 * @param toCheck The step layout to check.
 * @param ref The ref to look for.
 */
export function inLayout(toCheck: ContainerFormat, ref: string): boolean {
    let found = false;
    if (!toCheck) {
        return found;
    }
    Object.keys(toCheck).forEach(key => {
        const value = toCheck[key];
        if (typeof value === 'object') {
            if (inLayout(value, ref)) {
                found = true;
            }
        } else if (typeof value === 'string') {
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
export function deepClone(toClone: object): object {
    return _.cloneDeep(toClone);
}

/**
 * Capitalize the first letter of a string.
 * @param str String to capitalize.
 */
export const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
/**
 * Decapitalize the first letter of a string.
 * @param str String to de-capitalize.
 */
export const deCap = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
