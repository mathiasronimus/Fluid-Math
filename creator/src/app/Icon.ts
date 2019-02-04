export default class Icon {
    name: string;
    onClick: () => void;
    isActive: () => boolean;
    constructor(name, onClick, isActive) {
      this.name = name;
      this.onClick = onClick;
      this.isActive = isActive;
    }
}
