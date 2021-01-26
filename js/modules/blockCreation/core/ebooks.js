const NeedUL = require("../../domClasses/needUL");
const getSingleCollection = require("../../db/library-cheatsheets-single-collection");
const BlockContent = require("../../domClasses/blockContent");

module.exports = async (proxyPrepend) => {
  console.log("ebooks creation block");

  //build a UL within the already created block
  let initDom = new NeedUL("ebooks_block");
  initDom.getToAppending();

  let theUL = document.getElementById("ebooks_block-ul");

  const topicForThisPage = document.querySelector(".subjectName").id;
  let rawData = await getSingleCollection("eBooks"); //make ebooks

  rawData.forEach((i) => {
    i.associatedSubjects.forEach((q) => {
      if (q == topicForThisPage) {
        console.log("yesss", q, i);
        if (i.useProxy == true) {
          let forDom = `<li><a href="${proxyPrepend}${i.url}" target="_blank" class="cheatsheets-link-name">${i.title}</a></li>`;
          let ebooksContent = new BlockContent(forDom, "ebooks_block");
          ebooksContent.getToAppending();
        } else {
          let forDom = `<li><a href="${i.url}" target="_blank" class="cheatsheets-link-name">${i.title}</a></li>`;
          let ebooksContent = new BlockContent(forDom, "ebooks_block");
          ebooksContent.getToAppending();
        }
      }
    });
  });
};
