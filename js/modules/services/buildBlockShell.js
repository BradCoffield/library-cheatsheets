module.exports = (blockDisplayName, blockFirestoreName) => {
  
  const blockShell = `<div class="cheatsheet-block"><h3 id="${blockDisplayName}-heading">${blockDisplayName}</h3><div id="${blockDisplayName}-interior" class="cheatsheet-block-interior"></div></div>`;
  const domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
};
