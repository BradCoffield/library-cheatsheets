const BlockContent = require("../../domClasses/blockContent");
const cheatsheetsDocument = require("../../db/library-cheatsheets-single-document");

module.exports = rawSheetData => {
  console.log(rawSheetData);
  (async () => {
     

    rawSheetData.citation_styles.toUse.forEach(async styleWanted => {
      let citationStyleData = await cheatsheetsDocument(
        "CitationStylesRepository",
        styleWanted
      );
      // console.log(citationStyleData.styleWeblinks);
      let contentForDom = `<h3>${citationStyleData.styleDisplayName}</h3><p class="heading-description">${citationStyleData.descriptionOfStyle}</p><p><h4>Available in the library</h4><ul><li><img src="${citationStyleData.styleBook.imgURL}" alt="Book cover of MLA Handbook"></img>${citationStyleData.styleBook.bookDescription} It is available for use <a href="${citationStyleData.styleBook.primoURL}" target="_blank">in the library.</a></li></ul></p><p><h4>Helpful Links</h4><ul id="${citationStyleData.styleDisplayName}-helpful-links-ul"><li>hi<li></ul></p>`;

      let domStuff = new BlockContent(
        contentForDom,
        "citation_styles-interior"
      );
      domStuff.getToAppending();

      let helpfulLinksParseAppend = (function() {
        let styleLinks = citationStyleData.styleWeblinks;
        if (styleLinks.purdueOwlLinks) {
          let forDom = `
          <h5>Purdue OWL</h5>
          <li><a href="${styleLinks.purdueOwlLinks.primaryLink}" target="_blank">MLA Guide @ the OWL</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.citingBookSourcesLink}" target="_blank">Citing Book Sources</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.citingOnlineSourcesLink}" target="_blank">Citing Online Sources</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.samplePaperLink}" target="_blank">Sample Paper</a></li>`;
          let domStuff2 = new BlockContent(
            forDom,
            `${citationStyleData.styleDisplayName}-helpful-links-ul`
          );
          domStuff2.getToAppending();
        }
      })();
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
