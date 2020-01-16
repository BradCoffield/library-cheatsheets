const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcDataGetCollection = require("../../db/rmc-lib-data-single-collection")

module.exports = async proxyPrepend => {
  const cheatsheetPage = document.querySelector(".subjectName").id;
  console.log(proxyPrepend);

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

let databasesData = await rmcDataGetCollection("databases")

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
      if (this.quality === "excellent_for") {
        const dbNode = document.getElementById(`excellent_for`);
        doIt(dbNode);
      }
      if (this.quality === "good_for") {
        const dbNode = document.getElementById("good_for");
        doIt(dbNode);
      }
    }
  }
console.log("here")

  db2
    .collection("databases")
    .where("excellentFor", "array-contains", `${whichPageWeWorkingWith}`)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        console.log(doc.id, " => ", doc.data());
        let name = doc.data().name;
        // console.log(name);
        let url = "";
        if (doc.data().use_proxy) {
          url = `${theProxyUrl}${doc.data().url}`;
        } else {
          url = doc.data().url;
        }
        let content_types = doc.data().content_types;
        let description = doc.data().description;

        let dbObj = { name, content_types, description, url };
        let newThing = new SubjectDatabase("excellent_for", dbObj);
        newThing.appendIt();
      });
    })
    .then(
      db2
        .collection("databases")
        .where("goodFor", "array-contains", `${whichPageWeWorkingWith}`)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // console.log(doc.id, " => ", doc.data());
            let name = doc.data().name;
            // console.log(name);
            let content_types = doc.data().content_types;
            let description = doc.data().description;
            let url = "";
            if (doc.data().use_proxy) {
              url = `${theProxyUrl}${doc.data().url}`;
            } else {
              url = doc.data().url;
            }
            let dbObj = { name, content_types, description, url };
            let newThing = new SubjectDatabase("good_for", dbObj);
            newThing.appendIt();
          });
        })
    );
};
