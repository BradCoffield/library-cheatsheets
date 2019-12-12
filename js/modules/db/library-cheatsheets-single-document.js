module.exports = (collectionName, documentName) => {
   return db2.collection(collectionName)
    .doc(documentName)
    .get()
    .then(doc => {
      return doc.data();
      })
    };
