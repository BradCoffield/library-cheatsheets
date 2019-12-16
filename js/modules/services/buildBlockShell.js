module.exports = (blockDisplayName, blockFirestoreName) => {
// console.log("TCL: blockDisplayName", blockDisplayName)
  
  const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
  const domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
};
