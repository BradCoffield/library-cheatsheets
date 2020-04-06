(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/* db */
const getProxy = require("./modules/db/get-proxy-prepend");

const getDefaultOrder = require("./modules/db/get-default-order");

const getSingleCheatsheet = require("./modules/db/get-single-cheatsheet");

const rmcLibDataCollection = require("./modules/db/rmc-lib-data-single-collection");

const rmcLibDataDocument = require("./modules/db/rmc-lib-data-single-document");

const cheatsheetsCollection = require("./modules/db/library-cheatsheets-single-collection");

const cheatsheetsDocument = require("./modules/db/library-cheatsheets-single-document");
/* services */


const blocksForCheatsheet = require("./modules/services/blocks-for-this-cheatsheet");

const buildBlockShell = require("./modules/services/buildBlockShell");
/* classes */


const NeedUL = require("./modules/domClasses/needUL");

const BlockContent = require("./modules/domClasses/blockContent");
/* block creation */


const createEbscoApiBlock = require("./modules/blockCreation/core/ebsco_api");

const createWeblinksBlock = require("./modules/blockCreation/core/weblinks");

const createPrimoBooksBlock = require("./modules/blockCreation/core/primo_book_search");

const createPrimoArticlesBlock = require("./modules/blockCreation/core/primo_article_search");

const createCitationBlock = require("./modules/blockCreation/core/citation_help");

const createDPLABlock = require("./modules/blockCreation/ancillary/dpla");

const createPrimoQuickSearch = require("./modules/blockCreation/core/primo_quick_search");

const createDbBySubject = require("./modules/blockCreation/core/databases-by-subject");

(async () => {
  const proxyPrepend = await getProxy();
  const defaultOrderForBlocks = await getDefaultOrder();
  const dataForThisCheatsheet = await getSingleCheatsheet();
  const blocksForProduction = blocksForCheatsheet(dataForThisCheatsheet); //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page

  defaultOrderForBlocks.forEach(block => {
    if (blocksForProduction.includes(block)) {
      buildBlockShell(block);
    }
  });
  blocksForProduction.forEach(blockName => {
    if (blockName === "ebsco_api_a9h") {
      createEbscoApiBlock(proxyPrepend, dataForThisCheatsheet.ebsco_api_a9h); // ebscoBlockInitialize(dataForThisCheatsheet.ebsco_api_a9h);
    }

    if (blockName === "weblinks_block") {
      createWeblinksBlock(); //don't need args for this one
    }

    if (blockName === "citation_styles") {
      // console.log("citation_stylesINIT");
      createCitationBlock(dataForThisCheatsheet);
    }

    if (blockName === "primo_article_searches") {
      createPrimoArticlesBlock(dataForThisCheatsheet.primo_article_searches);
    }

    if (blockName === "primo_book_searches") {
      // console.log("primo_book_searchesINIT");
      createPrimoBooksBlock(dataForThisCheatsheet.primo_book_searches);
    }

    if (blockName === "dpla") {
      createDPLABlock(dataForThisCheatsheet.dpla);
    }

    if (blockName === "primo_quick_search") {
      createPrimoQuickSearch();
    }

    if (blockName === "databases") {
      createDbBySubject(proxyPrepend);
    }
  });
})();

},{"./modules/blockCreation/ancillary/dpla":2,"./modules/blockCreation/core/citation_help":3,"./modules/blockCreation/core/databases-by-subject":4,"./modules/blockCreation/core/ebsco_api":5,"./modules/blockCreation/core/primo_article_search":6,"./modules/blockCreation/core/primo_book_search":7,"./modules/blockCreation/core/primo_quick_search":8,"./modules/blockCreation/core/weblinks":9,"./modules/db/get-default-order":10,"./modules/db/get-proxy-prepend":11,"./modules/db/get-single-cheatsheet":12,"./modules/db/library-cheatsheets-single-collection":13,"./modules/db/library-cheatsheets-single-document":14,"./modules/db/rmc-lib-data-single-collection":17,"./modules/db/rmc-lib-data-single-document":18,"./modules/domClasses/blockContent":19,"./modules/domClasses/needUL":20,"./modules/services/blocks-for-this-cheatsheet":21,"./modules/services/buildBlockShell":22}],2:[function(require,module,exports){
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent"); // const rmcLibDataDocument = require("../../db/rmc-lib-data-single-document");


module.exports = async blockData => {
  console.log(blockData); // let initDom = new NeedUL("dpla");
  // initDom.getToAppending();
  // let topicsWanted = blockData.filter(arr => {
  //   return arr["topics"];
  // });
  // console.log(topicsWanted);

  fetch(`https://api.dp.la/v2/items?q=${blockData.topics}&api_key=2f7220ddc3368cb08ede39b319bcf34d`).then(res => res.json()).then(json => {
    console.log(json.docs);
    console.log("title:", json.docs[0].sourceResource.title[0]);
    console.log("creator:", json.docs[0].sourceResource.creator[0]);
    console.log("data provider:", json.docs[0].dataProvider);
    if (json.docs[0].sourceResource.date) console.log("date", json.docs[0].sourceResource.date[0].displayDate);
    if (json.docs[0].sourceResource.type) console.log("item type:", json.docs[0].sourceResource.type[0]);
    if (json.docs[0].sourceResource.format) console.log("format:", json.docs[0].sourceResource.format[0]);
    console.log("image:", json.docs[0].object);
    json.docs.forEach(result => {
      let title, img, description, type, creator;
      if (result.sourceResource.title) title = result.sourceResource.title[0];else title = "";
      if (result.object) img = result.object;else img = "";
      if (result.sourceResource.type) type = result.sourceResource.type[0];else type = "";
      if (result.sourceResource.creator) creator = result.sourceResource.creator[0];else creator = "";
      let forTheDom = `<ul class="dpla-item-ul">
        <li>${title}</li>
        <li>${creator}</li>
        <li><img src="${img}" alt=""></img></li>
        <li>${type}</li>
        
        </ul>`;
      let tt = new BlockContent(forTheDom, "dpla");
      tt.getToAppending();
    });
  }).catch(err => {
    console.log(err); //  console.log(document.getElementById("dpla-interior").parentElement.nodeName)
    //  document.getElementById("dpla-interior").parentElement.style.display = "none"
  });
  /* What do I need from the record?
  * Title = title[0]
  * creator = sourceResource.creator[0]
  * Responsible party = dataProvider or? provider.name
  * Date = date[0].displayDate - but isn't in some...
  * Object Type = format[0]
  * Image = object
  * type = sourceResource.type[0] (like, image)
  * format = sourceResource.format[0] (like, pencil works)
  
  
  */
};

},{"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],3:[function(require,module,exports){
const BlockContent = require("../../domClasses/blockContent");

const cheatsheetsDocument = require("../../db/library-cheatsheets-single-document");

module.exports = rawSheetData => {
  console.log(rawSheetData);

  (async () => {
    rawSheetData.citation_styles.toUse.forEach(async styleWanted => {
      let citationStyleData = await cheatsheetsDocument("CitationStylesRepository", styleWanted); // console.log(citationStyleData.styleWeblinks);

      let contentForDom = `<h3>${citationStyleData.styleDisplayName}</h3><p class="heading-description">${citationStyleData.descriptionOfStyle}</p><p><h4>Available in the library</h4><ul><li><img src="${citationStyleData.styleBook.imgURL}" alt="Book cover of MLA Handbook"></img>${citationStyleData.styleBook.bookDescription} It is available for use <a href="${citationStyleData.styleBook.primoURL}" target="_blank">in the library.</a></li></ul></p><p><h4>Helpful Links</h4><ul id="${citationStyleData.styleDisplayName}-helpful-links-ul"><li>hi<li></ul></p>`;
      let domStuff = new BlockContent(contentForDom, "citation_styles-interior");
      domStuff.getToAppending();

      let helpfulLinksParseAppend = function () {
        let styleLinks = citationStyleData.styleWeblinks;

        if (styleLinks.purdueOwlLinks) {
          let forDom = `
          <h5>Purdue OWL</h5>
          <li><a href="${styleLinks.purdueOwlLinks.primaryLink}" target="_blank">MLA Guide @ the OWL</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.citingBookSourcesLink}" target="_blank">Citing Book Sources</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.citingOnlineSourcesLink}" target="_blank">Citing Online Sources</a></li>
          <li><a href="${styleLinks.purdueOwlLinks.samplePaperLink}" target="_blank">Sample Paper</a></li>`;
          let domStuff2 = new BlockContent(forDom, `${citationStyleData.styleDisplayName}-helpful-links-ul`);
          domStuff2.getToAppending();
        }
      }();
    }); // sheetCitationStylesArr[0].stylesWanted.forEach(styleWanted => {
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

},{"../../db/library-cheatsheets-single-document":14,"../../domClasses/blockContent":19}],4:[function(require,module,exports){
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent");

const rmcDataGetCollection = require("../../db/rmc-lib-data-single-collection");

const rmcDataGetDatabasesEF = require("../../db/rmc-lib-data-databases-EF");

const rmcDataGetDatabasesGF = require("../../db/rmc-lib-data-databases-GF");

module.exports = async proxyPrepend => {
  const cheatsheetPage = document.querySelector(".subjectName").id;
  let prepDom = document.getElementById("databases-interior");
  prepDom.insertAdjacentHTML("beforeend", "<div id='excellent_for'>Excellent For</div>");
  prepDom.insertAdjacentHTML("beforeend", "<div id='good_for'>Good for</div>");
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
  let dbDataGF = await rmcDataGetDatabasesGF("English");
  console.log(dbData);

  class SubjectDatabase {
    constructor(quality, dbData) {
      this.quality = quality;
      this.dbData = dbData;
    }

    appendIt() {
      const contentTypesMap = this.dbData.content_types.map(el => `<li>${el}</li>`);

      let doIt = theNode => {
        theNode.insertAdjacentHTML("beforeend", ` <li class="database-li">
          <h5><a style="display:inline" href="${this.dbData.url}" target="_blank">${this.dbData.name}</a>
<div class="wrap-collabsible" style="display:inline"  >
                  <input id="collapsible-${this.dbData.name}" class="toggle" type="checkbox">
                  <label for="collapsible-${this.dbData.name}" class="lbl-toggle"><img src="https://www.rocky.edu/sites/default/files/circle-question-light2.png" width=16px style="margin-bottom:5px;"alt=""> </label>
                  <div class="collapsible-content">
                    <div class="content-inner">
                    <p class="database-description">${this.dbData.description}</p>
                    </div>
                  </div>
                </div></h5>
          <ul class="database-list-resourcetype">
          ${contentTypesMap.join("")}
               <ul>
   
          
          </li>`);
      };

      const dbNode = document.getElementById(this.quality);
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
    let dbObj = {
      name,
      content_types,
      description,
      url
    };
    let newThing = new SubjectDatabase("excellent_for", dbObj);
    newThing.appendIt();
  });
  dbDataGF.forEach(database => {
    let name = database.name;
    let url = "";

    if (database.use_proxy) {
      url = `${proxyPrepend}${database.url}`;
    } else {
      url = database.url;
    }

    let content_types = database.content_types;
    let description = database.description;
    let dbObj = {
      name,
      content_types,
      description,
      url
    };
    let newThing = new SubjectDatabase("good_for", dbObj);
    newThing.appendIt();
  });
};

},{"../../db/rmc-lib-data-databases-EF":15,"../../db/rmc-lib-data-databases-GF":16,"../../db/rmc-lib-data-single-collection":17,"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],5:[function(require,module,exports){
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent");

const rmcLibDataDocument = require("../../db/library-cheatsheets-single-document");

module.exports = (proxyPrepend, blockData) => {
  console.log(blockData); //the function responsible for getting the ebsco data and appending it to the dom.
  // get started by adding to the dom the UL we need to be there so we can append a bunch of li's

  let initDom = new NeedUL("ebsco_api_a9h");
  initDom.getToAppending();

  let getEbscoAndAppend = async document => {
    //  console.log(document)
    let ebscoDoc = await rmcLibDataDocument("ebsco-searches", document); // console.log(ebscoDoc)

    for (let i = 0; i < 10; i++) {
      let resultBase = ebscoDoc.results[i];
      const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
      let tt = new BlockContent(forAppending, "ebsco_api_a9h");
      tt.getToAppending();
    }
  }; // Grabs the uid from the desired ebsco searches and then sends them to be gotten from rmc-lib-data


  if (blockData.toUse) {
    blockData.toUse.forEach(i => {
      console.log(i);
      getEbscoAndAppend(i);
    });
  }
};

},{"../../db/library-cheatsheets-single-document":14,"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],6:[function(require,module,exports){
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent");

const rmcLibDataDocument = require("../../db/library-cheatsheets-single-document");

module.exports = async blockData => {
  // console.log("eh");
  let initDom = new NeedUL("primo_article_searches");
  initDom.getToAppending();

  let getPrimoSearchesAndAppend = async document => {
    let primoSearch = await rmcLibDataDocument("primo-article-searches", document); // console.log(primoSearch);

    for (let i = 0; i < 10; i++) {
      let resultBase = primoSearch.results[i];
      const forAppending = `<li class="ebsco-li"><a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/${resultBase.sourceid[0]}${resultBase.sourcerecordid[0]}"target="_blank">${resultBase.title}</a>From: ${resultBase.isPartOf}</li>`;
      let tt = new BlockContent(forAppending, "primo_article_searches");
      tt.getToAppending(); // the first permalink should be https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1e7lb5m/TN_gale_ofa113523425
    }
  }; // console.log(blockData);
  // Grabs the uid from the desired ebsco searches and then sends them to be gotten from rmc-lib-data


  getPrimoSearchesAndAppend(blockData.toUse[0]);
};

},{"../../db/library-cheatsheets-single-document":14,"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],7:[function(require,module,exports){
/* I need to create a function that takes a single piece of data (corresponding to the random number) and this function manages adding it to the dom and checking it
and either ++ or not and then be done or something. I don't need to hide the whole UL just hide each new LI until sure it's fine. 
*/
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent");

const rmcLibDataDocument = require("../../db/library-cheatsheets-single-document");

module.exports = async blockData => {
  const howManyWeWant = 5;
  let totalDisplayed = 0;
  let uidsWanted = [];
  blockData.toUse.forEach(butter => {
    uidsWanted.push(butter);
  });
  uidsWanted.forEach(async uid => {
    let bookResults = await rmcLibDataDocument("primo-book-searches", uid); // console.log(bookResults.results);

    const rawData = bookResults.results;

    const getRandomNumbers = function (howMany, upperLimit) {
      var limit = howMany,
          amount = 1,
          lower_bound = 1,
          upper_bound = upperLimit,
          unique_random_numbers = [];
      if (amount > limit) limit = amount; //Infinite loop if you want more unique natural numbers than exist in a given range

      while (unique_random_numbers.length < limit) {
        var random_number = Math.floor(Math.random() * (upper_bound - lower_bound) + lower_bound);

        if (unique_random_numbers.indexOf(random_number) == -1) {
          unique_random_numbers.push(random_number);
        }
      }

      return unique_random_numbers;
    };

    var ourRandoms = getRandomNumbers(4, rawData.length); // console.log(bookResults.length, ourRandoms);

    for (i = 0; totalDisplayed < howManyWeWant; i++) {
      appendBook(rawData[ourRandoms[i]], i);
    }
  });

  function appendBook(bookData, iterator) {
    // console.log(bookData);
    // if (!bookData){return}

    /* Setting up our UL onto which we will append LI's */
    let baseDom = document.getElementById("primo_book_searches-interior");
    baseDom.insertAdjacentHTML("beforeend", "<ul id='new-books'></ul>");
    let theIsbn = "";

    if (bookData && bookData.isbn) {
      theIsbn = bookData.isbn[0];
    }

    let theTitle = bookData.title;
    let catalogLink = `<a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1j18u99/${bookData.sourceid[0]}${bookData.sourcerecordid[0]}"
   target="_blank">`;
    let theIMG = `https://syndetics.com/index.aspx?isbn=${theIsbn}/MC.JPG&client=primo`;
    var theBookStuff = `    <li class="new-books-li" id="new-books-li-${iterator}">
      <div class="content">

          ${catalogLink}
              <div class="content-overlay"></div>
              <img class="content-image book-cover" id="cover${iterator}" src="${theIMG}"  >
              <div class="content-details fadeIn-bottom">
                  <div class="content-title">${theTitle}

              </div>
          </a>
      </div>
  </li>`;
    let append = new RmcNewBooks(theBookStuff);
    append.getToAppending(); // lets snag the new book dom and check it

    let newBook = document.getElementById(`cover${iterator}`);
    newBook.addEventListener("load", function () {
      // console.log(newBook.id,'My width is: ', this.naturalWidth);
      if (this.naturalHeight == 1) {
        document.getElementById(`new-books-li-${iterator}`).outerHTML = "";
      }
    });
    totalDisplayed++;
  }

  class RmcNewBooks {
    constructor(theBookStuff) {
      this.theBookStuff = theBookStuff;
    }

    getToAppending() {
      var domsn = document.getElementById("new-books");
      domsn.insertAdjacentHTML("beforeend", this.theBookStuff); // checkThisBook(i);
      // totalDisplayed++;
    }

  }
};

},{"../../db/library-cheatsheets-single-document":14,"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],8:[function(require,module,exports){
const BlockContent = require("../../domClasses/blockContent");

module.exports = async data => {
  let htmlWeWant = `  <form role="search" style="margin-top: -.44rem">
    <div class="input-group add-on">
        <input class="form-control" placeholder=" " id="1549903767743" name="CatalogSearch"
            type="text">
        <div class="input-group-btn">
            <button class="btn btn-default search_link1549903767743" id="primo-search-button" type="submit">
             
                Search
            
            </button>
        </div>
    </div>
    
    </form>
    <div id="adv-search-link">
    <a href="https://rocky-primo.hosted.exlibrisgroup.com/primo-explore/search?sortby=rank&vid=01TRAILS_ROCKY&lang=en_US&mode=advanced">Advanced Search</a>
    </div>`;
  let tt = new BlockContent(htmlWeWant, "primo_quick_search-interior");
  tt.getToAppending();
  let aa = document.getElementById('primo-search-button');
  aa.addEventListener('click', function (event) {
    var target = "https://rocky-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=01TRAILS_ROCKY&institution=01TRAILS_ROCKY&tab=default_tab&indx=1&bulkSize=10&srt=relevance&sortField=default&search_scope=01TRAILS_ROCKY&query=any,contains," + document.getElementById('1549903767743').value;
    console.log(document.getElementById('1549903767743').value);
    window.open(target, '_blank');
  });
};

},{"../../domClasses/blockContent":19}],9:[function(require,module,exports){
const NeedUL = require("../../domClasses/needUL");

const BlockContent = require("../../domClasses/blockContent");

const getSingleCollection = require("../../db/library-cheatsheets-single-collection");

module.exports = async () => {
  // let weblinksForThisCheatsheet = [];
  // const weblinksContentRef = db2.collection("Weblinks");
  const topicForThisPage = document.querySelector(".subjectName").id;
  let rawData = await getSingleCollection("Weblinks");
  let initDom = new NeedUL("weblinks_block");
  initDom.getToAppending();
  rawData.forEach(i => {
    i.AssociatedSubjects.forEach(q => {
      if (q == topicForThisPage) {
        // console.log("yesss", q, i);
        let linkDescription, linkDisplayName, linkLink;

        if (i.description == undefined) {
          linkDescription = "";
        } else {
          linkDescription = i.description;
        }

        if (!i.displayName) {
          return;
        } else linkDisplayName = i.displayName;

        if (!i.url) {
          return;
        } else linkLink = i.url;

        let forDom = `<li><a href="${linkLink}">${linkDisplayName}</a><p>${linkDescription}</p></li>`;
        let weblinksContent = new BlockContent(forDom, "weblinks_block");
        weblinksContent.getToAppending();
      }
    });
  }); // weblinksContentRef
  //   .get()
  //   .then(function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //       // console.log(doc.data().AssociatedSubjects);
  //       if (
  //         doc.data().AssociatedSubjects.some(() => {
  //           return "Literature";
  //         })
  //       ) {
  //         weblinksForThisCheatsheet.push(doc.data());
  //       }
  //     });
  //     return;
  //   })
  //   .then(() => {
  //     /* So, at this point we have weblinksforthischeatsheet populated with the data for each link we actually want */
  //     // console.log(weblinksForThisCheatsheet, "EH");
  //     let initDom = new NeedUL("weblinks_block");
  //     initDom.getToAppending();
  //     weblinksForThisCheatsheet.forEach(linkData => {
  //       let linkDescription, linkDisplayName, linkLink;
  //       if (linkData.Description == undefined) {
  //         linkDescription = "";
  //       } else {
  //         linkDescription = linkData.Description;
  //       }
  //       if (!linkData.displayName) {
  //         return;
  //       } else linkDisplayName = linkData.displayName;
  //       if (!linkData.link) {
  //         return;
  //       } else linkLink = linkData.link;
  //       let forDom = `<li><a href="${linkLink}">${linkDisplayName}</a><p>${linkDescription}</p></li>`;
  //       let weblinksContent = new BlockContent(forDom, "weblinks_block");
  //       weblinksContent.getToAppending();
  //     });
  //   });
};

},{"../../db/library-cheatsheets-single-collection":13,"../../domClasses/blockContent":19,"../../domClasses/needUL":20}],10:[function(require,module,exports){
module.exports = () => {
  const defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");
  /*Get the current default order for cheatsheet blocks*/

  return defaultOrderRef.get().then(function (doc) {
    if (doc.exists) {
      // console.log("get-default-order!");
      return doc.data().order;
    } else {
      console.log("No such document!");
    }
  });
};

},{}],11:[function(require,module,exports){
module.exports = () => {
  console.log("start");
  const proxyRef = db.collection("proxyServerUrl");
  let proxyPrepend;
  return proxyRef
  /* Get our current proxyserver prepend */
  .get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      proxyPrepend = doc.data().proxyURL;
    });
  }).then(() => {
    return proxyPrepend;
  });
};

},{}],12:[function(require,module,exports){
module.exports = () => {
  const cheatsheetPage = document.querySelector(".subjectName").id;
  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
  return cheatsheetsRef.get().then(function (doc) {
    if (doc.exists) {
      // console.log("gsc eh",doc.data())
      return doc.data();
    } else {
      console.log("No such document!");
    }
  });
};

},{}],13:[function(require,module,exports){
module.exports = collectionName => {
  let allTheDocuments = [];
  return db2.collection(collectionName).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      allTheDocuments.push(doc.data());
    });
  }).then(params => {
    return allTheDocuments;
  });
};

},{}],14:[function(require,module,exports){
module.exports = (collectionName, documentName) => {
  return db2.collection(collectionName).doc(documentName).get().then(doc => {
    return doc.data();
  });
};

},{}],15:[function(require,module,exports){
module.exports = whatWeWant => {
  let allTheDocuments = [];
  return db.collection("databases").where("excellentFor", "array-contains", `${whatWeWant}`).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      allTheDocuments.push(doc.data());
    });
  }).then(params => {
    return allTheDocuments;
  });
};

},{}],16:[function(require,module,exports){
module.exports = whatWeWant => {
  let allTheDocuments = [];
  return db.collection("databases").where("goodFor", "array-contains", `${whatWeWant}`).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      allTheDocuments.push(doc.data());
    });
  }).then(params => {
    // console.log("GF", allTheDocuments)                                         
    return allTheDocuments;
  });
};

},{}],17:[function(require,module,exports){
module.exports = collectionName => {
  let allTheDocuments = [];
  return db.collection(collectionName).get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      allTheDocuments.push(doc.data());
    });
  }).then(params => {
    return allTheDocuments;
  });
};

},{}],18:[function(require,module,exports){
module.exports = (collectionName, documentName) => {
  return db.collection(collectionName).doc(documentName).get().then(doc => {
    return doc.data();
  });
};

},{}],19:[function(require,module,exports){
class CheatsheetsBlockContent {
  constructor(blockContent, name) {
    this.blockContent = blockContent;
    this.name = name;
  }

  getToAppending() {
    var domsn = document.getElementById(`${this.name}-ul`);
    if (domsn == undefined) domsn = document.getElementById(`${this.name}`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }

}

module.exports = CheatsheetsBlockContent;

},{}],20:[function(require,module,exports){
class CheatsheetsNeedUL {
  constructor(name) {
    this.name = name;
  }

  getToAppending() {
    this.blockContent = `<ul id="${this.name}-ul"></ul>`; // this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;

    var domsn = document.getElementById(`${this.name}-interior`);
    domsn.insertAdjacentHTML("beforeend", this.blockContent);
  }

}

module.exports = CheatsheetsNeedUL;

},{}],21:[function(require,module,exports){
module.exports = dataForThisCheatsheet => {
  // console.log(dataForThisCheatsheet);
  let blocksForProduction = [];
  const keys = Object.keys(dataForThisCheatsheet);
  keys.forEach(i => {
    if (dataForThisCheatsheet[i].metadata && dataForThisCheatsheet[i].metadata.useInProduction) {
      blocksForProduction.push(i);
    }
  });
  return blocksForProduction;
};

},{}],22:[function(require,module,exports){
module.exports = (blockDisplayName, blockFirestoreName) => {
  const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
  const domElement = document.getElementById("cheatsheetsBlockWrapper");
  domElement.insertAdjacentHTML("beforeend", blockShell);
};

},{}]},{},[1]);
