let myLabels = document.querySelectorAll('.lbl-toggle');

Array.from(myLabels).forEach(label => {
  label.addEventListener('keydown', e => {
    // 32 === spacebar
    // 13 === enter
    if (e.which === 32 || e.which === 13) {
      e.preventDefault();
      label.click();
    };
  });
});

// need to grab the databases and first create the collapsible and put them in there...simple?


let databasesRef = db.collection("databases");
let proxyRef = db.collection("proxyServerUrl");
let theProxyUrl = "";

const whichPageWeWorkingWith = document.querySelector(".subjectName").id;
console.log(whichPageWeWorkingWith);

class SubjectDatabase {
  constructor(quality, dbData) {
    this.quality = quality;
    this.dbData = dbData;
  }

  appendIt() {
    const contentTypesMap = this.dbData.content_types.map(
      el => `<li>${el}</li>`
    );

    let doIt = (theNode) => {
        theNode.insertAdjacentHTML(
            "beforeend",
            ` <li class="database-li">
                <h5><a href="${this.dbData.url}" target="_blank">${this.dbData.name}</a><img src="/img/circle-i.png" alt=""  width=18px  data-pop aria-label="${this.dbData.description}"></h5>
                <p class="database-description">${this.dbData.description}</p>
                <ul class="database-list-resourcetype">
                ${contentTypesMap.join("")}
                     <ul>
                </li>`
          );
    }
    if (this.quality === "excellent_for"){const dbNode = document.getElementById(`excellent_for`);doIt(dbNode)}
    if (this.quality === "good_for"){const dbNode = document.getElementById('good_for');doIt(dbNode)}



 
  }
}
proxyRef.get().then(function(querySnapshot){
  querySnapshot.forEach(function(doc) {
    theProxyUrl = doc.data().proxyURL;
  }
)}).then(db.collection("databases")
.where("excellentFor", "array-contains", `${whichPageWeWorkingWith}`)
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    console.log(doc.id, " => ", doc.data());
    let name = doc.data().name;
    console.log(name);
    let url = "";
    if (doc.data().use_proxy){
      url = `${theProxyUrl}${doc.data().url}`
    } else {url = doc.data().url;}
    let content_types = doc.data().content_types;
    let description = doc.data().description;
 
    let dbObj = { name, content_types, description, url };
    let newThing = new SubjectDatabase("excellent_for", dbObj);
    newThing.appendIt();
  });
}).then(db.collection("databases")
.where("goodFor", "array-contains", `${whichPageWeWorkingWith}`)
.get()
.then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
    console.log(doc.id, " => ", doc.data());
    let name = doc.data().name;
    console.log(name);
    let content_types = doc.data().content_types;
    let description = doc.data().description;
    let url = "";
    if (doc.data().use_proxy){
      url = `${theProxyUrl}${doc.data().url}`
    } else {url = doc.data().url;}
    let dbObj = { name, content_types, description, url };
    let newThing = new SubjectDatabase("good_for", dbObj);
    newThing.appendIt();
  });
}))

)

