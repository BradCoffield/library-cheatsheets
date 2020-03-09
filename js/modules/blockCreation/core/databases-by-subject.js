const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcDataGetCollection = require("../../db/rmc-lib-data-single-collection");
const rmcDataGetDatabasesEF = require("../../db/rmc-lib-data-databases-EF");

module.exports = async proxyPrepend => {
  const cheatsheetPage = document.querySelector(".subjectName").id;

 let prepDom = document.getElementById("databases-interior")
 prepDom.insertAdjacentHTML("beforeend","<div id='excellent_for'></div>")


  let myLabels = document.querySelectorAll(".lbl-toggle");

  Array.from(myLabels).forEach(label => {
    label.addEventListener("keydown", e => {
      // 32 === spacebar
      // 13 === enter
      if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        label.click();
      }
    });
  });

  const whichPageWeWorkingWith = document.querySelector(".subjectName").id;

  let databasesData = await rmcDataGetCollection("databases");
  let dbData = await rmcDataGetDatabasesEF("English");
  console.log(dbData);

  class SubjectDatabase {
    constructor(quality, dbData) {
      this.quality = quality;
      this.dbData = dbData;
    }

    appendIt() {
      const contentTypesMap = this.dbData.content_types.map(
        el => `<li>${el}</li>`
      );

      let doIt = theNode => {
        theNode.insertAdjacentHTML(
          "beforeend",
          ` <li class="database-li">
                  <h5><a href="${this.dbData.url}" target="_blank">${
            this.dbData.name
          }</a></h5>
                  <div class="wrap-collabsible">
                          <input id="collapsible-${
                            this.dbData.name
                          }" class="toggle" type="checkbox">
                          <label for="collapsible-${
                            this.dbData.name
                          }" class="lbl-toggle">Description</label>
                          <div class="collapsible-content">
                            <div class="content-inner">
                            <p class="database-description">${
                              this.dbData.description
                            }</p>
                            </div>
                          </div>
                        </div>
  
               
                  <ul class="database-list-resourcetype">
                  ${contentTypesMap.join("")}
                       <ul>
                  </li>`
        );
      };
        const dbNode = document.getElementById(`excellent_for`);
        doIt(dbNode);
    }
  }

  dbData.forEach(database => {
    let name = database.name;
    let url = "";
    if (database.use_proxy) {
      url = `${proxyPrepend}${database.url}`;
    } else {
      url = database.url;
    }
    let content_types = database.content_types;
    let description = database.description;
    let dbObj = { name, content_types, description, url };
    let newThing = new SubjectDatabase("excellent_for", dbObj);
    newThing.appendIt();
  });
};
