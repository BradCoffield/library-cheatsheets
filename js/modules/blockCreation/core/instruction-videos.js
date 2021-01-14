const NeedUL = require("../../domClasses/needUL");
const getSingleCollection = require("../../db/library-cheatsheets-single-collection");
const BlockContent = require("../../domClasses/blockContent");

module.exports = async () => {
  //build a UL within the already created block
  let initDom = new NeedUL("instruction_videos");
  initDom.getToAppending();

  let theUL = document.getElementById("instruction_videos-ul");

  const topicForThisPage = document.querySelector(".subjectName").id;
  let rawData = await getSingleCollection("InstructionVideos");

  rawData.forEach((i) => {
      if (i.associatedSubjects){    i.associatedSubjects.forEach((q) => {
        if (q == topicForThisPage) {
          console.log("yesss", q, i);
  
          let forDom = `<li><a href="${i.url}" target="_blank" class="cheatsheets-link-name">${i.name}</a> <span style="font-size:12px">Length: ${i.length}</span></li>`;
          let videosContent = new BlockContent(forDom, "instruction_videos");
  
          videosContent.getToAppending();
        }
      });}

  });
};
