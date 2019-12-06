
const cheatsheetPage = document.querySelector(".subjectName").id;

const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
const defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");

let proxyRef = db.collection("proxyServerUrl");
let proxyPrepend;

let defaultOrderForBlocks = [];
let blocksForProduction = [];

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
            console.log("weblinks_blockINIT");
          }
          if (blockName === "citation_styles") {
            console.log("citation_stylesINIT");
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
function ebscoBlockInitialize(blockData) {
  console.log(blockData);

  let initDom = new CheatsheetsNeedUL("ebsco");
  initDom.getToAppending();

  let getEbscoInfo = docu => {
    db.collection("ebsco-searches")
      .doc(docu)
      .get()
      .then(doc => {
        console.log("GEI", doc.data());
        for (let i = 0; i < 10; i++) {
          let resultBase = doc.data().results[i];
          // console.log(resultBase);
          const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
          let tt = new CheatsheetsBlockContent(forAppending, "ebsco");
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
    var domsn = document.getElementById(`ebsco_api_a9h-interior`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }
}
