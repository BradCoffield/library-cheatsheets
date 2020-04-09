const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcLibDataDocument = require("../../db/library-cheatsheets-single-document");

module.exports = async blockData => {
  // console.log("eh");
  let initDom = new NeedUL("primo_article_searches");
  initDom.getToAppending();

  let getPrimoSearchesAndAppend = async document => {
    let primoSearch = await rmcLibDataDocument(
      "primo-article-searches",
      document
    );
    // console.log(primoSearch);
    for (let i = 0; i < 10; i++) {
      let resultBase = primoSearch.results[i];

      const forAppending = `<li class="primo-article-li"><a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/${resultBase.sourceid[0]}${resultBase.sourcerecordid[0]}"target="_blank">${resultBase.title}</a>`; 
      // const forAppending = `<li class="primo-article-li"><a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/${resultBase.sourceid[0]}${resultBase.sourcerecordid[0]}"target="_blank">${resultBase.title}</a>From: ${resultBase.isPartOf}</li>`;
      let tt = new BlockContent(forAppending, "primo_article_searches");
      tt.getToAppending();
      // the first permalink should be https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/TN_gale_ofa113523425
    }
  };
  // console.log(blockData);
  // Grabs the uid from the desired ebsco searches and then sends them to be gotten from rmc-lib-data
    getPrimoSearchesAndAppend(blockData.toUse[0]);
};
