export default class Icon {
    name: string;
    onClickVar: () => void;
    isActive: () => boolean;
    constructor(name, onClick, isActive) {
      this.name = name;
      this.onClickVar = onClick;
      this.isActive = isActive;
      this.onClick = this.onClick.bind(this);
    }

    onClick(e: MouseEvent) {
      e.stopPropagation();
      // Don't allow click event when inactive.
      if (this.isActive && !this.isActive()) {
        return;
      }
      this.onClickVar();
    }
}
