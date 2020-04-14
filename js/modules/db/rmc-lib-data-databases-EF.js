module.exports = (whatWeWant) => {
  if (whatWeWant == "Philosophy" || "Religious Studies") {
    whatWeWant = "Philosophy & Religious Studies";
  }
  let allTheDocuments = [];
  return db
    .collection("databases")
    .where("excellentFor", "array-contains", `${whatWeWant}`)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        allTheDocuments.push(doc.data());
      });
    })
    .then((params) => {
      return allTheDocuments;
    });
};
