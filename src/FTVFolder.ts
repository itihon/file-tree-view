import FTVFile from "./FTVFile.js";
import FTVNode from "./FTVNode.js";

export default class FTVFolder extends FTVNode {
  constructor(name: string, children: [FTVFolder | FTVFile] | [] = []) {
    super(name);

    this.append(...children);
  }

  isExpanded() {
    return this.hasAttribute("expanded");
  }

  toggleExpanded() {
    this.toggleAttribute("expanded");
  }

  clear() {
    this.childNodes.forEach((childNode) => {
      if (childNode instanceof FTVNode) {
        childNode.remove();
      }
    });
  }
}

customElements.define("ftv-folder", FTVFolder);
