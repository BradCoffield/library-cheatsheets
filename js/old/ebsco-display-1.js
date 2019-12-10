/* TODO: at the start of each init block create the block wrapper contents so that the meat of the function can append as normal... */

const ebscoDisplay1 = (function() {
  let proxyRef = db.collection("proxyServerUrl");
  let proxyPrepend;

  console.log("Hello from ebscoDisplay1.");
  let cheatsheetPage = document.querySelector(".subjectName").id;

  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);

  //   general function that will have a series of if statements referring to the different possible blocks and calling the blockinits for each one
  function runMyStuff(block, data) {
    // console.log(block, "block");
    if (block === "ebsco_api_a9h") {
      ebscoBlockInitialize(data);
    }
    if (block === "weblinks_block"){
      console.log('weblinks!!');
    }
  }

  // the function responsible for getting the 

  //the function responsible for getting the ebsco data and appending it to the dom.
  function ebscoBlockInitialize(blockData) {
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

    // console.log("ebscooo", blockData);
    /*
okay so here is where I want to create my logic for an ebsco block. Which consists of 
* iterating over the array and finding each one that has inside it a 'uid'
* can't just find the one because I might want to have multiple in an autorun slider
* take that uid and use it to query rmc-library-data and grab the cached search information
* build and append to the dom - will want an external function/class for that.
*/
  }

  //this is our function that gets everything started. It sets up the proxy prepend then tt get's its ref from which page we are on.
  proxyRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        proxyPrepend = doc.data().proxyURL;
      });
    })
    .then(
      cheatsheetsRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            let data = doc.data();
            // data is an object filled with arrays. Need the keys so we can access the arrays.
            let keys = Object.keys(data);
            keys.forEach(i => {
              // console.log(i, data[i]);
              // eee is the different sub-objects in the arrays. If there's one that has metadata.useInProduction and it is true then proceed with working with it.
              data[i].forEach(eee => {
                if (eee.metadata && eee.metadata.useInProduction == true) {
                  runMyStuff(i, data[i]);
                }
              });
            });
          } else {
            console.log("No such document!", i);
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    );
})();

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
      this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;
    } else
      this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"> hiii</div>`;
    var domsn = document.getElementById(`cheatsheetsBlockWrapper`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }
}
