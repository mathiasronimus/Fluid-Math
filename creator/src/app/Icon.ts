export default class Icon {
    name: string;
    onClick: () => void;
    constructor(name, onClick) {
      this.name = name;
      this.onClick = onClick;
    }
}
