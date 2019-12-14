const BlockContent = require("../domClasses/blockContent");
const cheatsheetsDocument = require("../db/library-cheatsheets-single-document");

module.exports = rawSheetData => {
  (async () => {
    let sheetCitationStylesArr = rawSheetData["citation_styles"].filter(arr => {
      return arr["stylesWanted"];
    });

    sheetCitationStylesArr[0].stylesWanted.forEach(async styleWanted => {
      let citationStyleData = await cheatsheetsDocument(
        "CitationStylesRepository",
        styleWanted
      );
      let contentForDom = `<h3>${citationStyleData.styleDisplayName}</h3><p class="heading-description">${citationStyleData.descriptionOfStyle}</p><p><h4>Available in the library</h4><ul><li><img src="${citationStyleData.styleBook.imgURL}" alt="Book cover of MLA Handbook"></img>${citationStyleData.styleBook.bookDescription} It is available for use <a href="${citationStyleData.styleBook.primoURL}" target="_blank">in the library.</a></li></ul></p><p><h4>Helpful Links</h4><ul><li>hi<li></ul></p>`;

      let domStuff = new BlockContent(contentForDom, "citation_styles-interior");
      domStuff.getToAppending();
    });
    
  
    // sheetCitationStylesArr[0].stylesWanted.forEach(styleWanted => {
    //   citationStyleData.then(function(doc) {
    //     if (doc.exists) {
    //       console.log("Document data:", doc.data());
    //       let styleData = doc.data();

    //       let contentForDom = `<h3>${styleData.styleDisplayName}</h3><p class="heading-description">${styleData.descriptionOfStyle}</p><p><h4>Available in the library</h4><ul><li><img src="${styleData.styleBook.imgURL}" alt="Book cover of MLA Handbook"></img>${styleData.styleBook.bookDescription} It is available for use <a href="${styleData.styleBook.primoURL}" target="_blank">in the library.</a></li></ul></p><p><h4>Helpful Links</h4><ul><li>hi<li></ul></p>`;

    //       let domStuff = new BlockContent(contentForDom, "citation_styles");
    //       domStuff.getToAppending();
    //     } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //     }
    //   });
    // });
  })();
};
