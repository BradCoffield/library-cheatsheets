const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcDataGetCollection = require("../../db/rmc-lib-data-single-collection");
const rmcDataGetDatabasesEF = require("../../db/rmc-lib-data-databases-EF");
const rmcDataGetDatabasesGF = require("../../db/rmc-lib-data-databases-GF");

module.exports = async (proxyPrepend) => {
  const cheatsheetPage = document.querySelector(".subjectName").id;

  let prepDom = document.getElementById("databases-interior");
  prepDom.insertAdjacentHTML("beforeend", "<div id='excellent_for'></div>");
  //  prepDom.insertAdjacentHTML("beforeend","<div id='good_for'>Good for</div>")

  let myLabels = document.querySelectorAll(".lbl-toggle");

  Array.from(myLabels).forEach((label) => {
    label.addEventListener("keydown", (e) => {
      // 32 === spacebar
      // 13 === enter
      if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        label.click();
      }
    });
  });

  let whichPageWeWorkingWith = document.querySelector(".subjectName").id;
  console.log(whichPageWeWorkingWith);
  if (whichPageWeWorkingWith=="Creative Writing"){whichPageWeWorkingWith="English"}
  if (whichPageWeWorkingWith=="Literature"){whichPageWeWorkingWith="English"}

  let databasesData = await rmcDataGetCollection("databases");
  let dbData = await rmcDataGetDatabasesEF(whichPageWeWorkingWith);
  // let dbDataGF = await rmcDataGetDatabasesGF("English")

  console.log(dbData);

  class SubjectDatabase {
    constructor(quality, dbData) {
      this.quality = quality;
      this.dbData = dbData;
    }

    appendIt() {
      const contentTypesMap = this.dbData.content_types.map(
        (el) => `<li>${el}</li>`
      );

      let doIt = (theNode) => {
        theNode.insertAdjacentHTML(
          "beforeend",
          ` <li class="database-li">
          <h5><a style="display:inline" href="${
            this.dbData.url
          }" target="_blank">${this.dbData.name}</a>
<div class="wrap-collabsible" style="display:inline"  >
                  <input id="collapsible-${
                    this.dbData.name
                  }" class="toggle" type="checkbox">
                  <label for="collapsible-${
                    this.dbData.name
                  }" class="lbl-toggle"><img src="https://www.rocky.edu/sites/default/files/circle-question-light2.png" width=16px style="margin-bottom:5px;"alt=""> </label>
                  <div class="collapsible-content">
                    <div class="content-inner">
                    <p class="database-description">${
                      this.dbData.description
                    }</p>
                    </div>
                  </div>
                </div></h5>
          <ul class="database-list-resourcetype">
          ${contentTypesMap.join("")}
               <ul>
   
          
          </li>`
        );
      };
      const dbNode = document.getElementById(this.quality);
      doIt(dbNode);
    }
  }

  dbData.forEach((database) => {
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
  // dbDataGF.forEach(database => {
  //   let name = database.name;
  //   let url = "";
  //   if (database.use_proxy) {
  //     url = `${proxyPrepend}${database.url}`;
  //   } else {
  //     url = database.url;
  //   }
  //   let content_types = database.content_types;
  //   let description = database.description;
  //   let dbObj = { name, content_types, description, url };
  //   let newThing = new SubjectDatabase("good_for", dbObj);
  //   newThing.appendIt();
  // });
};
