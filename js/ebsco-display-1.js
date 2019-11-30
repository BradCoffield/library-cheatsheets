const ebscoDisplay1 = (function() {
    console.log("Hello from ebscoDisplay1.")
    let cheatsheetPage = document.querySelector(".subjectName").id
    console.log(cheatsheetPage);
    const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);


function runMyStuff(block, data){
    console.log(block, "block");
    if (block === "ebsco_api_a9h"){ebscoBlockInitialize(data)}
}

function ebscoBlockInitialize(blockData){
console.log("ebscooo", blockData);
}

    cheatsheetsRef.get().then(function(doc) {
        if (doc.exists) {
            // console.log("Document data:", doc.data());
            let data = doc.data();
            let keys = Object.keys(data)
            // console.log("keys = ", keys);
            keys.forEach((i) => {
                // look in data[i] and if anywhere in that array there is "useInProduction true"
                console.log(i, data[i]);
                if (data[i].some(e => e.useInProduction === true)) {
                //    console.log("YAY",data[i]);
                   runMyStuff(i, data[i])
                  }
            })
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
 
})();
