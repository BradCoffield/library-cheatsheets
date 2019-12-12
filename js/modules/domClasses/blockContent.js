class CheatsheetsBlockContent {
    constructor(blockContent, name) {
      this.blockContent = blockContent;
      this.name = name;
    }
    getToAppending() {
        
      var domsn = document.getElementById(`${this.name}-ul`);
      if (domsn == undefined) domsn = document.getElementById(`${this.name}`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
  module.exports = CheatsheetsBlockContent;