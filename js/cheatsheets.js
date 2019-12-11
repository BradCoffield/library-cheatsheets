/* db */
const getProxy = require("./modules/db/get-proxy-prepend");
const getDefaultOrder = require("./modules/db/get-default-order");
const getSingleCheatsheet = require("./modules/db/get-single-cheatsheet");
const rmcLibDataCollection = require("./modules/db/rmc-lib-data-single-collection");
const rmcLibDataDocument = require("./modules/db/rmc-lib-data-single-document");

/* services */
const blocksForCheatsheet = require("./modules/services/blocks-for-this-cheatsheet");
const buildBlockShell = require("./modules/services/buildBlockShell");

/* classes */
const NeedUL = require("./modules/domClasses/needUL");
const BlockContent = require("./modules/domClasses/blockContent");

/* block creation */
const createEbscoApiBlock = require('./modules/blockCreation/ebsco_api');


(async () => {
  const proxyPrepend = await getProxy();
  const defaultOrderForBlocks = await getDefaultOrder();
  const dataForThisCheatsheet = await getSingleCheatsheet();
  const blocksForProduction = blocksForCheatsheet(dataForThisCheatsheet);


  const weblinksContentRef = db2.collection("Weblinks");

  //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page
  defaultOrderForBlocks.forEach(block => {
    if (blocksForProduction.includes(block)) {
      buildBlockShell(block);
    }
  });

  blocksForProduction.forEach(blockName => {
    if (blockName === "ebsco_api_a9h") {
      ebscoBlockInitialize(dataForThisCheatsheet.ebsco_api_a9h);
    }
    if (blockName === "weblinks_block") {
      weblinksBlockInitialize(); //don't need args for this one
    }
    if (blockName === "citation_styles") {
      // console.log("citation_stylesINIT");
    }
    if (blockName === "primo_article_searches") {
      // console.log("primo_article_searchesINIT");
    }
    if (blockName === "primo_book_searches") {
      // console.log("primo_book_searchesINIT");
    }
  });

  //the function responsible for getting the ebsco data and appending it to the dom.
  function ebscoBlockInitialize(blockData) {
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

    
  }

  // gonna need to figure out how to make it so one function will work for all citation styles. like consolidate what content is included. Don't want sub functions for each...
  function weblinksBlockInitialize() {
    /* prob gonna want this function but then different functions for each citation style since they may end up being so different */
    let weblinksForThisCheatsheet = [];
    // console.log("weblinks_blockINIT");
    /* need to grab the weblinks from different ref and then go over each one to find the ones with this subject and those get appended */
    weblinksContentRef
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // console.log(doc.data().AssociatedSubjects);
          if (
            doc.data().AssociatedSubjects.some(() => {
              return "Literature";
            })
          ) {
            weblinksForThisCheatsheet.push(doc.data());
          }
        });
        return;
      })
      .then(() => {
        /* So, at this point we have weblinksforthischeatsheet populated with the data for each link we actually want */
        // console.log(weblinksForThisCheatsheet, "EH");
        let initDom = new NeedUL("weblinks_block");
        initDom.getToAppending();
        weblinksForThisCheatsheet.forEach(linkData => {
          let linkDescription, linkDisplayName, linkLink;
          if (linkData.Description == undefined) {
            linkDescription = "";
          } else {
            linkDescription = linkData.Description;
          }
          if (!linkData.displayName) {
            return;
          } else linkDisplayName = linkData.displayName;
          if (!linkData.link) {
            return;
          } else linkLink = linkData.link;

          let forDom = `<li><a href="${linkLink}">${linkDisplayName}</a><p>${linkDescription}</p></li>`;
          let weblinksContent = new BlockContent(forDom, "weblinks_block");
          weblinksContent.getToAppending();
        });
      });
  }
})();
