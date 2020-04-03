module.exports = whatWeWant => {
    let allTheDocuments = [];
    return db
    .collection("databases")
    .where("goodFor", "array-contains", `${whatWeWant}`)
    .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          allTheDocuments.push(doc.data());
        });
      })
      .then(params => {
        // console.log("GF", allTheDocuments)                                         
        return allTheDocuments;
      });
  };

  