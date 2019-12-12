const NeedUL = require("../domClasses/needUL");
const BlockContent = require("../domClasses/blockContent");

module.exports = () => {
  let weblinksForThisCheatsheet = [];
  const weblinksContentRef = db2.collection("Weblinks");

  weblinksContentRef
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // console.log(doc.data().AssociatedSubjects);
        if (
          doc.data().AssociatedSubjects.some(() => {
            return "Literature";
          })
        ) {
          weblinksForThisCheatsheet.push(doc.data());
        }
      });
      return;
    })
    .then(() => {
      /* So, at this point we have weblinksforthischeatsheet populated with the data for each link we actually want */
      // console.log(weblinksForThisCheatsheet, "EH");
      let initDom = new NeedUL("weblinks_block");
      initDom.getToAppending();
      weblinksForThisCheatsheet.forEach(linkData => {
        let linkDescription, linkDisplayName, linkLink;
        if (linkData.Description == undefined) {
          linkDescription = "";
        } else {
          linkDescription = linkData.Description;
        }
        if (!linkData.displayName) {
          return;
        } else linkDisplayName = linkData.displayName;
        if (!linkData.link) {
          return;
        } else linkLink = linkData.link;

        let forDom = `<li><a href="${linkLink}">${linkDisplayName}</a><p>${linkDescription}</p></li>`;
        let weblinksContent = new BlockContent(forDom, "weblinks_block");
        weblinksContent.getToAppending();
      });
    });
};
