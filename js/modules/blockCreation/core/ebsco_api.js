const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcLibDataDocument = require("../../db/rmc-lib-data-single-document");
 

module.exports = (proxyPrepend, blockData) => {
  //the function responsible for getting the ebsco data and appending it to the dom.

  // get started by adding to the dom the UL we need to be there so we can append a bunch of li's
  let initDom = new NeedUL("ebsco_api_a9h");
  initDom.getToAppending();

  let getEbscoAndAppend = async document => {
    let ebscoDoc = await rmcLibDataDocument("ebsco-searches", document);

    for (let i = 0; i < 10; i++) {
      let resultBase = ebscoDoc.results[i];

      const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
      let tt = new BlockContent(forAppending, "ebsco_api_a9h");
      tt.getToAppending();
    }
  };

  // Grabs the uid from the desired ebsco searches and then sends them to be gotten from rmc-lib-data
  blockData
    .filter(arr => {
      return arr.uid;
    })
    .forEach(butter => {
      getEbscoAndAppend(butter.uid);
    });
};
