module.exports = (whatWeWant) => {
  if (whatWeWant == "Philosophy") {
    whatWeWant = "Philosophy & Religious Studies";
  }
  if (whatWeWant == "Religious Studies") {
    whatWeWant = "Philosophy & Religious Studies";
  } else whatWeWant = whatWeWant;
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
