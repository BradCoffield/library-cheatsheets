const ebscoDisplay1 = (function() {
  console.log("Hello from ebscoDisplay1.");
  let cheatsheetPage = document.querySelector(".subjectName").id;
  console.log(cheatsheetPage);
  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);

  //   general function that will have a series of if statements referring to the different possible blocks and calling the blockinits for each one
  function runMyStuff(block, data) {
    console.log(block, "block");
    if (block === "ebsco_api_a9h") {
      ebscoBlockInitialize(data);
    }
  }

  //the function responsible for getting the ebsco data and appending it to the dom.
  function ebscoBlockInitialize(blockData) {
    let getEbscoInfo = docu => {
      db.collection("ebsco-searches")
        .doc(docu)
        .get()
        .then(doc => {
          console.log("GEI", doc.data());
          for (let i = 0; i < 10; i++) {
            console.log(doc.data().results[i].articleTitle);
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

  cheatsheetsRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // console.log("Document data:", doc.data());
        let data = doc.data();
        let keys = Object.keys(data);
        // console.log("keys = ", keys);
        keys.forEach(i => {
          // look in data[i] and if anywhere in that array there is "useInProduction true"
          console.log(i, data[i]);
          if (data[i].some(e => e.useInProduction === true)) {
            //    console.log("YAY",data[i]);
            runMyStuff(i, data[i]);
          }
        });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    });
})();
