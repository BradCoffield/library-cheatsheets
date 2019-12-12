/* 
Based on the h2, as with ebsco-display-1, find the right cheatsheet info in firestore. THEN, based on...something...
setup on the page all the needed boxes and preloaders.

So, how to do that? I could have a slot in the cheatsheets firestore just for the blocks that are desired OR 
I could have the indidivual block metadata with useinproduction boolean.... either way is doable...second way keep the info
coupled with the block itself which feels like its a good idea ALSO don't have to worry about the first way saying true to 
something that doesn't exist. unlikely to happen but ...

Eventually i'm gonna need a .then() for runthings so all the blocks are def built first

Okay, so how do i setup things that there's a default order? in firestore have a collection thats called that and inside..? could be an object with keys first, second etc. OR just an array and their order in the array is the default order
*/
let cheatsheetPage = document.querySelector(".subjectName").id;
const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
let defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");

let defaultOrderForBlocks = [];
let blocksForProduction = [];

defaultOrderRef
  .get()
  .then(function(doc) {
    if (doc.exists) {
      console.log(doc.data().order);
      defaultOrderForBlocks = doc.data().order;
      console.log("dfb", defaultOrderForBlocks);
    } else {
      console.log("No such document!");
    }
  })
  .then(
    cheatsheetsRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          let data = doc.data();
          let keys = Object.keys(data);

          keys.forEach(i => {
            let useInProd = data[i].filter(item => {
              return item.metadata;
            });
            if (useInProd[0] && useInProd[0].metadata.useInProduction == true) {
                blocksForProduction.push(i)
                //create an array of values (strings that match from orderarray) and then later foreach over defaultorder and if exists in this new array then do the appending
            }
          });
          return
        } else {
          console.log("No such document!");
        }
      }).then(() => {
          console.log(blocksForProduction);
        //   
          defaultOrderForBlocks.forEach((block) => {
              if (blocksForProduction.includes(block)){buildBlock(block)}
          })
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      })
  );

function buildBlock(blockDisplayName, blockFirestoreName) {
  // console.log("BUILDBLOCK!", blockDisplayName);
  let blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
  let domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
}

function runThings(blockName) {
  console.log("RunTHINGS!!!", blockName);
}
