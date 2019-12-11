class CheatsheetsBlockContent {
    constructor(blockContent, name) {
      this.blockContent = blockContent;
      this.name = name;
    }
    getToAppending() {
        
      var domsn = document.getElementById(`${this.name}-ul`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
  module.exports = CheatsheetsBlockContent;