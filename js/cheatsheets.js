const getProxy = require("./modules/db/get-proxy-prepend");
const getDefaultOrder = require("./modules/db/get-default-order");
const getSingleCheatsheet = require("./modules/db/get-single-cheatsheet");

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
class CheatsheetsNeedUL {
  constructor(name) {
    this.name = name;
  }
  getToAppending() {
    this.blockContent = `<ul id="${this.name}-ul"></ul>`;
    // this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;
    var domsn = document.getElementById(`${this.name}-interior`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }
}



(async () => {
  const proxyPrepend = await getProxy();
   const defaultOrderForBlocks = await getDefaultOrder();
   const dataForThisCheatsheet = await getSingleCheatsheet();
  
   

   let blocksForProduction = [];


 
   const keys = Object.keys(dataForThisCheatsheet);
   console.log(dataForThisCheatsheet);
   console.log(keys);
   keys.forEach(i => {
    const useInProd = dataForThisCheatsheet[i].filter(item => {
      return item.metadata;
    });
    if (useInProd[0] && useInProd[0].metadata.useInProduction == true) {
      blocksForProduction.push(i); //create an array of values representing the blocks we actually are using on this page.
    }
  });
  
  const cheatsheetPage = document.querySelector(".subjectName").id;

  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);

  const weblinksContentRef = db2.collection("Weblinks");

  /* Now we get the data for our current cheatsheet and start creating the dom shell for each block and then getting the content for each and appending */
  
      //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page
      defaultOrderForBlocks.forEach(block => {
        if (blocksForProduction.includes(block)) {
          buildBlock(block);
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
   
   

  function buildBlock(blockDisplayName, blockFirestoreName) {
    const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
    const domElement = document.getElementById("cheatsheetsBlockWrapper");
    domElement.insertAdjacentHTML("beforeend", blockShell);
  }

  //the function responsible for getting the ebsco data and appending it to the dom.
  function ebscoBlockInitialize(blockData) {
    console.log(blockData);

    let initDom = new CheatsheetsNeedUL("ebsco_api_a9h");
    initDom.getToAppending();

    let getEbscoInfo = docu => {
      db.collection("ebsco-searches")
        .doc(docu)
        .get()
        .then(doc => {
          // console.log("GEI", doc.data());
          for (let i = 0; i < 10; i++) {
            let resultBase = doc.data().results[i];
            // console.log(resultBase);
            const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
            let tt = new CheatsheetsBlockContent(forAppending, "ebsco_api_a9h");
            tt.getToAppending();
          }
        });
    };
    // we only want to work with arrays that have a uid, which means it's a saved search reference.
    let bread = blockData.filter(arr => {
      return arr.uid;
    });
    //   grab the uid and run the db get function for it
    bread.forEach(butter => {
      getEbscoInfo(butter.uid);
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
        let initDom = new CheatsheetsNeedUL("weblinks_block");
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
          let weblinksContent = new CheatsheetsBlockContent(
            forDom,
            "weblinks_block"
          );
          weblinksContent.getToAppending();
        });
      });
  }

 
})();
