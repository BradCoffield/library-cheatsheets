class CheatsheetsBlockContent {
    constructor(blockContent, name) {
      this.blockContent = blockContent;
      this.name = name;
    }
    getToAppending() {
        console.log("block content", this.blockContent
        );
      var domsn = document.getElementById(`${this.name}-ul`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
  module.exports = CheatsheetsBlockContent;