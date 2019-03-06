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
     * Return a new Padding, having scaled this
     * one by a certain amount.
     * @param by The amount to scale by.
     */
    scale(by: number): Padding {
        return new Padding(
            this.top * by,
            this.left * by,
            this.bottom * by,
            this.right * by
        );
    }

    /**
     * Return a new Padding with same insets on
     * each side.
     * @param amount The amount of inset on each side.
     */
    static even(amount: number): Padding {
        return new Padding(amount, amount, amount, amount);
    }
}