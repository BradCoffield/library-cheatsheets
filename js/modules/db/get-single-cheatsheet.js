module.exports = () => {
  const cheatsheetPage = document.querySelector(".subjectName").id;
  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
  return cheatsheetsRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("gsc eh",doc.data())
      return doc.data();
    } else {
      console.log("No such document!");
    }
  });
};
