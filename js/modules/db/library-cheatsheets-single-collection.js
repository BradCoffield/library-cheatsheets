module.exports = collectionName => {
  let allTheDocuments = [];
  return db2
    .collection(collectionName)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        allTheDocuments.push(doc.data());
      });
    })
    .then(params => {
      return allTheDocuments;
    });
};
