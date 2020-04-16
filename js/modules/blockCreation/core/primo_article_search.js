const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcLibDataDocument = require("../../db/library-cheatsheets-single-document");

module.exports = async (blockData) => {
  // console.log("eh");
  let initDom = new NeedUL("primo_article_searches");
  initDom.getToAppending();

  let getPrimoSearchesAndAppend = async (document) => {
    let primoSearch = await rmcLibDataDocument(
      "primo-article-searches",
      document
    );
    // console.log(primoSearch);
    for (let i = 0; i < 5; i++) {
      let resultBase = primoSearch.results[i];

      const forAppending = `<li class="primo-article-li truncate"><a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/${resultBase.sourceid[0]}${resultBase.sourcerecordid[0]}"target="_blank">${resultBase.title}</a>`;
      // const forAppending = `<li class="primo-article-li"><a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/${resultBase.sourceid[0]}${resultBase.sourcerecordid[0]}"target="_blank">${resultBase.title}</a>From: ${resultBase.isPartOf}</li>`;
      let tt = new BlockContent(forAppending, "primo_article_searches");
      tt.getToAppending();
      // the first permalink should be https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/TN_gale_ofa113523425
    }
    domFinishing(primoSearch.searchTerm);
  };
  // console.log(blockData);
  // Grabs the uid from the desired ebsco searches and then sends them to be gotten from rmc-lib-data
  getPrimoSearchesAndAppend(blockData.toUse[0]);
  let domFinishing = (searchTerms) => {
    let linksList = document.getElementById("primo_article_searches-ul");

    linksList.insertAdjacentHTML(
      "beforebegin",
      `<div id="primo_article_searches-beforeThangs"><span class="caps"> ${searchTerms}</span> </div>`
    );

    linksList.insertAdjacentHTML(
      "afterend",
      `<div id="primo_article_searches-afterThangs"><a href="https://rocky-primo.hosted.exlibrisgroup.com/primo-explore/search?sortby=rank&vid=01TRAILS_ROCKY&lang=en_US&mode=advanced" target="_blank"><button class="btn">Run a new search</button></a></div>`
    );
  };
};
