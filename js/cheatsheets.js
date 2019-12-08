const cheatsheetPage = document.querySelector(".subjectName").id;

const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
const defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");
const weblinksContentRef = db2.collection("Weblinks");
const citationStylesRef = db2.collection("CitationStylesRepository");

let proxyRef = db.collection("proxyServerUrl");
let proxyPrepend;

let defaultOrderForBlocks = [];
let blocksForProduction = [];
let citationStylesWanted = [];
let rawSheetData = [];

proxyRef /* Get our current proxyserver prepend */
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      proxyPrepend = doc.data().proxyURL;
    });
  })
  .then(
    /*Get the current default order for cheatsheet blocks*/
    defaultOrderRef.get().then(function(doc) {
      if (doc.exists) {
        defaultOrderForBlocks = doc.data().order;
      } else {
        console.log("No such document!");
      }
    })
  )
  .then(
    /* Now we get the data for our current cheatsheet and start creating the dom shell for each block and then getting the content for each and appending */
    cheatsheetsRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          const data = doc.data();
          const keys = Object.keys(data);
          rawSheetData = data;

          keys.forEach(i => {
            const useInProd = data[i].filter(item => {
              return item.metadata;
            });
            if (useInProd[0] && useInProd[0].metadata.useInProduction == true) {
              blocksForProduction.push(i); //create an array of values representing the blocks we actually are using on this page.
            }
          });
          return data;
        } else {
          console.log("No such document!");
        }
      })
      .then(data => {
        //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page
        defaultOrderForBlocks.forEach(block => {
          if (blocksForProduction.includes(block)) {
            buildBlock(block);
          }
        });
        blocksForProduction.forEach(blockName => {
          if (blockName === "ebsco_api_a9h") {
            ebscoBlockInitialize(data.ebsco_api_a9h);
          }
          if (blockName === "weblinks_block") {
            weblinksBlockInitialize(); //don't need args for this one
          }
          if (blockName === "citation_styles") {
            citationStylesBlockInitialize();
          }
          if (blockName === "primo_article_searches") {
            console.log("primo_article_searchesINIT");
          }
          if (blockName === "primo_book_searches") {
            console.log("primo_book_searchesINIT");
          }
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  );

function buildBlock(blockDisplayName, blockFirestoreName) {
  const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
  const domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
}

//the function responsible for getting the ebsco data and appending it to the dom.
//this is going to get more complicated if I have a slider on the frontend but will deal with that then, if need be. It's doable, of course.
function ebscoBlockInitialize(blockData) {
  // console.log(blockData);

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

function weblinksBlockInitialize() {
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
      console.log(weblinksForThisCheatsheet, "EH");
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

function citationStylesBlockInitialize() {
  // Getting the array of styles that are wanted from this particular sheet.
  let sheetCitationStylesArr = rawSheetData["citation_styles"].filter(arr => {
    return arr["stylesWanted"];
  });

  sheetCitationStylesArr[0].stylesWanted.forEach(styleWanted => {
    citationStylesRef
      .doc(styleWanted)
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          let styleData = doc.data();

          let contentForDom = `<h3>${styleData.styleDisplayName}</h3><p class="heading-description">${styleData.descriptionOfStyle}</p><p><h4>Available in the library</h4><ul><li><img src="${styleData.styleBook.imgURL}" alt="Book cover of MLA Handbook"></img>${styleData.styleBook.bookDescription} It is available for use <a href="${styleData.styleBook.primoURL}" target="_blank">in the library.</a></li></ul></p><p><h4>Helpful Links</h4><ul><li>hi<li></ul></p>`

          let domStuff = new CheatsheetsBlockContentNoUL(
            contentForDom,
            "citation_styles"
          );
          domStuff.getToAppending();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
  });
}

class CheatsheetsBlockContentNoUL {
  constructor(blockContent, name) {
    this.blockContent = blockContent;
    this.name = name;
  }
  getToAppending() {
    var domsn = document.getElementById(`${this.name}-interior`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }
}

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
