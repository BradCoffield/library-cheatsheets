module.exports = (collectionName, documentName) => {
  return db
    .collection(collectionName)
    .doc(documentName)
    .get()
    .then(doc => {
      return doc.data();
    });
};
