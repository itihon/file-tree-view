import FTVNode from './FTVNode.js';

export default class FTVFile extends FTVNode {
  constructor(name: string) {
    super(name);
  }
}

customElements.define('ftv-file', FTVFile);
