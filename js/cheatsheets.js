/* db */
const getProxy = require("./modules/db/get-proxy-prepend");
const getDefaultOrder = require("./modules/db/get-default-order");
const getSingleCheatsheet = require("./modules/db/get-single-cheatsheet");
const rmcLibDataCollection = require("./modules/db/rmc-lib-data-single-collection");
const rmcLibDataDocument = require("./modules/db/rmc-lib-data-single-document");
const cheatsheetsCollection = require("./modules/db/library-cheatsheets-single-collection");
const cheatsheetsDocument = require("./modules/db/library-cheatsheets-single-document");

/* services */
const blocksForCheatsheet = require("./modules/services/blocks-for-this-cheatsheet");
const buildBlockShell = require("./modules/services/buildBlockShell");

/* classes */
const NeedUL = require("./modules/domClasses/needUL");
const BlockContent = require("./modules/domClasses/blockContent");

/* block creation */
const createEbscoApiBlock = require("./modules/blockCreation/core/ebsco_api");
const createWeblinksBlock = require("./modules/blockCreation/core/weblinks");
const createPrimoBooksBlock = require("./modules/blockCreation/core/primo_book_search");
const createPrimoArticlesBlock = require("./modules/blockCreation/core/primo_article_search");

(async () => {
  const proxyPrepend = await getProxy();
  const defaultOrderForBlocks = await getDefaultOrder();
  const dataForThisCheatsheet = await getSingleCheatsheet();
  const blocksForProduction = blocksForCheatsheet(dataForThisCheatsheet);
  console.log(dataForThisCheatsheet);

  //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page
  defaultOrderForBlocks.forEach(block => {
    if (blocksForProduction.includes(block)) {
      buildBlockShell(block);
    }
  });

  blocksForProduction.forEach(blockName => {
    if (blockName === "ebsco_api_a9h") {
      createEbscoApiBlock(proxyPrepend, dataForThisCheatsheet.ebsco_api_a9h);
      // ebscoBlockInitialize(dataForThisCheatsheet.ebsco_api_a9h);
    }
    if (blockName === "weblinks_block") {
      createWeblinksBlock(); //don't need args for this one
    }
    if (blockName === "citation_styles") {
      // console.log("citation_stylesINIT");
    }
    if (blockName === "primo_article_searches") {
      createPrimoArticlesBlock(dataForThisCheatsheet.primo_article_searches)
    }
    if (blockName === "primo_book_searches") {
      // console.log("primo_book_searchesINIT");
      createPrimoBooksBlock(dataForThisCheatsheet.primo_book_searches);
    }
  });
})();
