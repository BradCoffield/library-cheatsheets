class CheatsheetsNeedUL {
    constructor(name) {
      this.name = name;
    }
    getToAppending() {
      this.blockContent = `<ul id="${this.name}-ul"></ul>`;
      // this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;
      var domsn = document.getElementById(`${this.name}-interior`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
  module.exports = CheatsheetsNeedUL;