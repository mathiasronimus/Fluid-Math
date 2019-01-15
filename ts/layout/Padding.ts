export default class Padding {

    // The amount to inset on each side
    top: number;
    left: number;
    bottom: number;
    right: number;

    constructor(top, left, bottom, right) {
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
    }

    height(): number {
        return this.top + this.bottom;
    }

    width(): number {
        return this.left + this.right;
    }

    /**
     * Return a new Padding with same insets on
     * each side.
     * @param amount The amount of inset on each side.
     */
    static even(amount: number): Padding {
        return new Padding(amount, amount, amount, amount);
    }

    /**
     * Interpolate between two paddings,
     * returning the result.
     * 
     * @param before The initial padding.
     * @param after The ending padding.
     * @param between The interpolation percentage as a decimal.
     */
    static between(before: Padding, after: Padding, between: number): Padding {
        let inv = 1 - between;
        let top = before.top * inv + after.top * between;
        let left = before.left * inv + after.left * between;
        let bottom = before.bottom * inv + after.bottom * between;
        let right = before.right * inv + after.right * between;
        return new Padding(top, left, bottom, right);
    }

}