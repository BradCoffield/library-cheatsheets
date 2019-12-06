const cheatsheetPage = document.querySelector(".subjectName").id;

const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
const defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");

let proxyRef = db.collection("proxyServerUrl");
let proxyPrepend;

let defaultOrderForBlocks = [];
let blocksForProduction = [];

proxyRef /*Get our current proxyserver prepend*/
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
  .then( /* Now we get the data for our current cheatsheet and start creating the dom shell for each block and then getting the content for each and appending */
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
              blocksForProduction.push(i); //create an array of values (strings that match from orderarray) and then later foreach over defaultorder and if exists in this new array then do the appending
            }
          });
          return data;
        } else {
          console.log("No such document!");
        }
      })
      .then(data => {
        //   console.log(blocksForProduction);

        defaultOrderForBlocks.forEach(block => {
          if (blocksForProduction.includes(block)) {
            buildBlock(block);
          }
        });
        ebscoBlockInitialize(data.ebsco_api_a9h);
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  );

function buildBlock(blockDisplayName, blockFirestoreName) {
  // console.log("BUILDBLOCK!", blockDisplayName);
  const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
  const domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
}

//the function responsible for getting the ebsco data and appending it to the dom.
function ebscoBlockInitialize(blockData) {
  console.log(blockData);
  let initDom = new CheatsheetsBlock("ebsco", true);
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
class CheatsheetsBlock {
  /* TODO: really what I'm going to want to do is look in the cheatsheets firestore for what's to be displayed and the order and set that up on load. Prob in drupal will need to the #cheatsheetWrapper or something already there. */
  constructor(name, wantUL) {
    this.name = name;
    this.wantUL = wantUL;
  }
  getToAppending() {
    if (this.wantUL) {
      this.blockContent = `<ul id="${this.name}-ul"></ul>`;
      // this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;
    } else
      this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"> hiii</div>`;
    var domsn = document.getElementById(`ebsco_api_a9h-interior`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }
}
