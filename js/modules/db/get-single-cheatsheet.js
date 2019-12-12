module.exports = () => {
    const cheatsheetPage = document.querySelector(".subjectName").id;
    const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
   return cheatsheetsRef
    .get()
    .then(function(doc) {
      if (doc.exists) {
    return doc.data();
          
      } else {
        console.log("No such document!");
      }
    })
}