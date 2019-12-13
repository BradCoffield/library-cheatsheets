const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcLibDataDocument = require("../../db/rmc-lib-data-single-document");

module.exports = async blockData => {
    console.log('eh')
      let initDom = new NeedUL("primo_article_searches");
  initDom.getToAppending();
}