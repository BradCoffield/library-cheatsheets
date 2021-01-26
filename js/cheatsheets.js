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
const createCitationBlock = require("./modules/blockCreation/core/citation_help");
const createDPLABlock = require("./modules/blockCreation/ancillary/dpla");
const createPrimoQuickSearch = require("./modules/blockCreation/core/primo_quick_search");
const createDbBySubject = require("./modules/blockCreation/core/databases-by-subject");
const createEbooksBlock = require("./modules/blockCreation/core/ebooks");
const createInstructionVideosBlock = require("./modules/blockCreation/core/instruction-videos");

/* ~actual stuff~ */
(async () => {
  //gets our proxy url from firebase because we will need it probably
  const proxyPrepend = await getProxy();
  //gets the default order for blocks from firebase. Doing it like this lets them all be consistent and lets us change the order for all of them once.
  const defaultOrderForBlocks = await getDefaultOrder();
  //gets raw data for the cheatsheet from firebase
  const dataForThisCheatsheet = await getSingleCheatsheet();
  //looks at the data for the cheatsheet to see what blocks it wants. Cheatsheets have the option to not use blocks.
  const blocksForProduction = blocksForCheatsheet(dataForThisCheatsheet);

  //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page. that way we can then insert the actual content to the shell on
  defaultOrderForBlocks.forEach((block) => {
    if (blocksForProduction.includes(block)) {
      buildBlockShell(block);
    }
  });

  //now that the empty containers are on our page we can now populate them.
  blocksForProduction.forEach((blockName) => {
    if (blockName === "ebsco_api_a9h") {
      document.getElementById("ebsco_api_a9h-heading").innerHTML =
        "Articles from Academic Search Complete";
      createEbscoApiBlock(proxyPrepend, dataForThisCheatsheet.ebsco_api_a9h);
      // ebscoBlockInitialize(dataForThisCheatsheet.ebsco_api_a9h);
    }
    if (blockName === "weblinks_block") {
      document.getElementById("weblinks_block-heading").innerHTML =
        "Trusted Websites";
      createWeblinksBlock(); //don't need args for this one
    }
    if (blockName === "citation_styles") {
      document.getElementById("citation_styles-heading").innerHTML =
        "Help with Citing";
      // console.log("citation_stylesINIT");
      createCitationBlock(dataForThisCheatsheet);
    }
    if (blockName === "primo_article_searches") {
      document.getElementById("primo_article_searches-heading").innerHTML =
        "Articles from RMC Power Search";
      createPrimoArticlesBlock(dataForThisCheatsheet.primo_article_searches);
    }
    if (blockName === "primo_book_searches") {
      document.getElementById("primo_book_searches-heading").innerHTML =
        "Select Books from RMC Library";
      // console.log("primo_book_searchesINIT");
      createPrimoBooksBlock(dataForThisCheatsheet.primo_book_searches);
    }
    if (blockName === "dpla") {
      document.getElementById("dpla-heading").innerHTML =
        "From the Digital Public Library of America";
      createDPLABlock(dataForThisCheatsheet.dpla);
    }
    if (blockName === "primo_quick_search") {
      document.getElementById("primo_quick_search-heading").innerHTML =
        "Power Search: Books, articles, and more from RMC and beyond";
      createPrimoQuickSearch();
    }
    if (blockName === "databases") {
      const cheatsheetPage = document.querySelector(".subjectName").id;
      document.getElementById(
        "databases-heading"
      ).innerHTML = `${cheatsheetPage} Databases`;
      createDbBySubject(proxyPrepend);
    }

    if (blockName === "ebooks_block") {
      document.getElementById("ebooks_block-heading").innerHTML = "eBooks";
      createEbooksBlock(proxyPrepend);
    }
    if (blockName === "instruction_videos") {
      document.getElementById("instruction_videos-heading").innerHTML = "Instruction Videos";
      createInstructionVideosBlock();
    }
  });
})();
