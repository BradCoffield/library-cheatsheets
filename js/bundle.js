(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
 
const proxy = require("./modules/services/get-proxy-prepend");


(async () => { 
  let proxyPrepend =  await proxy();
  

  const cheatsheetPage = document.querySelector(".subjectName").id;
  
  const cheatsheetsRef = db2.collection("Cheatsheets").doc(cheatsheetPage);
  const defaultOrderRef = db2.collection("defaultBlockOrder").doc("defaultOrder");
  const weblinksContentRef = db2.collection("Weblinks");
  
  let defaultOrderForBlocks = [];
  let blocksForProduction = [];
      /*Get the current default order for cheatsheet blocks*/
      defaultOrderRef.get().then(function(doc) {
        if (doc.exists) {
          defaultOrderForBlocks = doc.data().order;
        } else {
          console.log("No such document!");
        }
      })
   
    .then(
      /* Now we get the data for our current cheatsheet and start creating the dom shell for each block and then getting the content for each and appending */
      cheatsheetsRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            const data = doc.data();
            const keys = Object.keys(data);
  
            keys.forEach(i => {
              const useInProd = data[i].filter(item => {
                return item.metadata;
              });
              if (useInProd[0] && useInProd[0].metadata.useInProduction == true) {
                blocksForProduction.push(i); //create an array of values representing the blocks we actually are using on this page.
              }
            });
            return data;
          } else {
            console.log("No such document!");
          }
        })
        .then(data => {
          //   going in the desired order if it exists as a block wanted on this page it's shell gets appended to the page
          defaultOrderForBlocks.forEach(block => {
            if (blocksForProduction.includes(block)) {
              buildBlock(block);
            }
          });
          blocksForProduction.forEach(blockName => {
            if (blockName === "ebsco_api_a9h") {
              ebscoBlockInitialize(data.ebsco_api_a9h);
            }
            if (blockName === "weblinks_block") {
              weblinksBlockInitialize(); //don't need args for this one
            }
            if (blockName === "citation_styles") {
              console.log("citation_stylesINIT");
            }
            if (blockName === "primo_article_searches") {
              console.log("primo_article_searchesINIT");
            }
            if (blockName === "primo_book_searches") {
              console.log("primo_book_searchesINIT");
            }
          });
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        })
    );
  
  function buildBlock(blockDisplayName, blockFirestoreName) {
    const blockShell = `<div class="cheatsheet-block"><h3>${blockDisplayName}</h3><div id="${blockDisplayName}-interior"></div></div>`;
    const domElement = document.getElementById("cheatsheetsBlockWrapper");
    domElement.insertAdjacentHTML("beforeend", blockShell);
  }
  
  //the function responsible for getting the ebsco data and appending it to the dom.
  function ebscoBlockInitialize(blockData) {
    console.log(blockData);
  
    let initDom = new CheatsheetsNeedUL("ebsco_api_a9h");
    initDom.getToAppending();
  
    let getEbscoInfo = docu => {
      db.collection("ebsco-searches")
        .doc(docu)
        .get()
        .then(doc => {
          console.log("GEI", doc.data());
          for (let i = 0; i < 10; i++) {
            let resultBase = doc.data().results[i];
            // console.log(resultBase);
            const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
            let tt = new CheatsheetsBlockContent(forAppending, "ebsco_api_a9h");
            tt.getToAppending();
          }
        });
    };
    // we only want to work with arrays that have a uid, which means it's a saved search reference.
    let bread = blockData.filter(arr => {
      return arr.uid;
    });
    //   grab the uid and run the db get function for it
    bread.forEach(butter => {
      getEbscoInfo(butter.uid);
    });
  }
  
  // gonna need to figure out how to make it so one function will work for all citation styles. like consolidate what content is included. Don't want sub functions for each...
  function weblinksBlockInitialize() {
    /* prob gonna want this function but then different functions for each citation style since they may end up being so different */
    let weblinksForThisCheatsheet = [];
    console.log("weblinks_blockINIT");
    /* need to grab the weblinks from different ref and then go over each one to find the ones with this subject and those get appended */
    weblinksContentRef
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          console.log(doc.data().AssociatedSubjects);
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
        console.log(weblinksForThisCheatsheet, "EH");
        let initDom = new CheatsheetsNeedUL("weblinks_block");
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
          let weblinksContent = new CheatsheetsBlockContent(
            forDom,
            "weblinks_block"
          );
          weblinksContent.getToAppending();
        });
      });
  }
  
  class CheatsheetsBlockContent {
    constructor(blockContent, name) {
      this.blockContent = blockContent;
      this.name = name;
    }
    getToAppending() {
      var domsn = document.getElementById(`${this.name}-ul`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
  class CheatsheetsNeedUL {
    constructor(name) {
      this.name = name;
    }
    getToAppending() {
      this.blockContent = `<ul id="${this.name}-ul"></ul>`;
      // this.blockContent = `<div id="${this.name}-block" class="cheatsheetBlock"><ul id="${this.name}-ul"></ul></div>`;
      var domsn = document.getElementById(`${this.name}-interior`);
      domsn.insertAdjacentHTML("beforeend", this.blockContent);
    }
  }
   })();




},{"./modules/services/get-proxy-prepend":2}],2:[function(require,module,exports){
module.exports = () => {
    console.log("start");
  const proxyRef = db.collection("proxyServerUrl");
  let proxyPrepend;

   return proxyRef /* Get our current proxyserver prepend */
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
         proxyPrepend = doc.data().proxyURL;
        
      })
    }).then(() => {
        return proxyPrepend
    })
     
};


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjaGVhdHNoZWV0cy5qcyIsIm1vZHVsZXMvc2VydmljZXMvZ2V0LXByb3h5LXByZXBlbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIiBcbmNvbnN0IHByb3h5ID0gcmVxdWlyZShcIi4vbW9kdWxlcy9zZXJ2aWNlcy9nZXQtcHJveHktcHJlcGVuZFwiKTtcblxuXG4oYXN5bmMgKCkgPT4geyBcbiAgbGV0IHByb3h5UHJlcGVuZCA9ICBhd2FpdCBwcm94eSgpO1xuICBcblxuICBjb25zdCBjaGVhdHNoZWV0UGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3ViamVjdE5hbWVcIikuaWQ7XG4gIFxuICBjb25zdCBjaGVhdHNoZWV0c1JlZiA9IGRiMi5jb2xsZWN0aW9uKFwiQ2hlYXRzaGVldHNcIikuZG9jKGNoZWF0c2hlZXRQYWdlKTtcbiAgY29uc3QgZGVmYXVsdE9yZGVyUmVmID0gZGIyLmNvbGxlY3Rpb24oXCJkZWZhdWx0QmxvY2tPcmRlclwiKS5kb2MoXCJkZWZhdWx0T3JkZXJcIik7XG4gIGNvbnN0IHdlYmxpbmtzQ29udGVudFJlZiA9IGRiMi5jb2xsZWN0aW9uKFwiV2VibGlua3NcIik7XG4gIFxuICBsZXQgZGVmYXVsdE9yZGVyRm9yQmxvY2tzID0gW107XG4gIGxldCBibG9ja3NGb3JQcm9kdWN0aW9uID0gW107XG4gICAgICAvKkdldCB0aGUgY3VycmVudCBkZWZhdWx0IG9yZGVyIGZvciBjaGVhdHNoZWV0IGJsb2NrcyovXG4gICAgICBkZWZhdWx0T3JkZXJSZWYuZ2V0KCkudGhlbihmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgaWYgKGRvYy5leGlzdHMpIHtcbiAgICAgICAgICBkZWZhdWx0T3JkZXJGb3JCbG9ja3MgPSBkb2MuZGF0YSgpLm9yZGVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc3VjaCBkb2N1bWVudCFcIik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICBcbiAgICAudGhlbihcbiAgICAgIC8qIE5vdyB3ZSBnZXQgdGhlIGRhdGEgZm9yIG91ciBjdXJyZW50IGNoZWF0c2hlZXQgYW5kIHN0YXJ0IGNyZWF0aW5nIHRoZSBkb20gc2hlbGwgZm9yIGVhY2ggYmxvY2sgYW5kIHRoZW4gZ2V0dGluZyB0aGUgY29udGVudCBmb3IgZWFjaCBhbmQgYXBwZW5kaW5nICovXG4gICAgICBjaGVhdHNoZWV0c1JlZlxuICAgICAgICAuZ2V0KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgICAgaWYgKGRvYy5leGlzdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBkb2MuZGF0YSgpO1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuICBcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaChpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgdXNlSW5Qcm9kID0gZGF0YVtpXS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0ubWV0YWRhdGE7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlSW5Qcm9kWzBdICYmIHVzZUluUHJvZFswXS5tZXRhZGF0YS51c2VJblByb2R1Y3Rpb24gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGJsb2Nrc0ZvclByb2R1Y3Rpb24ucHVzaChpKTsgLy9jcmVhdGUgYW4gYXJyYXkgb2YgdmFsdWVzIHJlcHJlc2VudGluZyB0aGUgYmxvY2tzIHdlIGFjdHVhbGx5IGFyZSB1c2luZyBvbiB0aGlzIHBhZ2UuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTm8gc3VjaCBkb2N1bWVudCFcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAvLyAgIGdvaW5nIGluIHRoZSBkZXNpcmVkIG9yZGVyIGlmIGl0IGV4aXN0cyBhcyBhIGJsb2NrIHdhbnRlZCBvbiB0aGlzIHBhZ2UgaXQncyBzaGVsbCBnZXRzIGFwcGVuZGVkIHRvIHRoZSBwYWdlXG4gICAgICAgICAgZGVmYXVsdE9yZGVyRm9yQmxvY2tzLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKGJsb2Nrc0ZvclByb2R1Y3Rpb24uaW5jbHVkZXMoYmxvY2spKSB7XG4gICAgICAgICAgICAgIGJ1aWxkQmxvY2soYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJsb2Nrc0ZvclByb2R1Y3Rpb24uZm9yRWFjaChibG9ja05hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKGJsb2NrTmFtZSA9PT0gXCJlYnNjb19hcGlfYTloXCIpIHtcbiAgICAgICAgICAgICAgZWJzY29CbG9ja0luaXRpYWxpemUoZGF0YS5lYnNjb19hcGlfYTloKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja05hbWUgPT09IFwid2VibGlua3NfYmxvY2tcIikge1xuICAgICAgICAgICAgICB3ZWJsaW5rc0Jsb2NrSW5pdGlhbGl6ZSgpOyAvL2Rvbid0IG5lZWQgYXJncyBmb3IgdGhpcyBvbmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja05hbWUgPT09IFwiY2l0YXRpb25fc3R5bGVzXCIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjaXRhdGlvbl9zdHlsZXNJTklUXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJsb2NrTmFtZSA9PT0gXCJwcmltb19hcnRpY2xlX3NlYXJjaGVzXCIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwcmltb19hcnRpY2xlX3NlYXJjaGVzSU5JVFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja05hbWUgPT09IFwicHJpbW9fYm9va19zZWFyY2hlc1wiKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicHJpbW9fYm9va19zZWFyY2hlc0lOSVRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgZ2V0dGluZyBkb2N1bWVudDpcIiwgZXJyb3IpO1xuICAgICAgICB9KVxuICAgICk7XG4gIFxuICBmdW5jdGlvbiBidWlsZEJsb2NrKGJsb2NrRGlzcGxheU5hbWUsIGJsb2NrRmlyZXN0b3JlTmFtZSkge1xuICAgIGNvbnN0IGJsb2NrU2hlbGwgPSBgPGRpdiBjbGFzcz1cImNoZWF0c2hlZXQtYmxvY2tcIj48aDM+JHtibG9ja0Rpc3BsYXlOYW1lfTwvaDM+PGRpdiBpZD1cIiR7YmxvY2tEaXNwbGF5TmFtZX0taW50ZXJpb3JcIj48L2Rpdj48L2Rpdj5gO1xuICAgIGNvbnN0IGRvbUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWF0c2hlZXRzQmxvY2tXcmFwcGVyXCIpO1xuICAgIGRvbUVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRIVE1MKFwiYmVmb3JlZW5kXCIsIGJsb2NrU2hlbGwpO1xuICB9XG4gIFxuICAvL3RoZSBmdW5jdGlvbiByZXNwb25zaWJsZSBmb3IgZ2V0dGluZyB0aGUgZWJzY28gZGF0YSBhbmQgYXBwZW5kaW5nIGl0IHRvIHRoZSBkb20uXG4gIGZ1bmN0aW9uIGVic2NvQmxvY2tJbml0aWFsaXplKGJsb2NrRGF0YSkge1xuICAgIGNvbnNvbGUubG9nKGJsb2NrRGF0YSk7XG4gIFxuICAgIGxldCBpbml0RG9tID0gbmV3IENoZWF0c2hlZXRzTmVlZFVMKFwiZWJzY29fYXBpX2E5aFwiKTtcbiAgICBpbml0RG9tLmdldFRvQXBwZW5kaW5nKCk7XG4gIFxuICAgIGxldCBnZXRFYnNjb0luZm8gPSBkb2N1ID0+IHtcbiAgICAgIGRiLmNvbGxlY3Rpb24oXCJlYnNjby1zZWFyY2hlc1wiKVxuICAgICAgICAuZG9jKGRvY3UpXG4gICAgICAgIC5nZXQoKVxuICAgICAgICAudGhlbihkb2MgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR0VJXCIsIGRvYy5kYXRhKCkpO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgICAgICAgbGV0IHJlc3VsdEJhc2UgPSBkb2MuZGF0YSgpLnJlc3VsdHNbaV07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXN1bHRCYXNlKTtcbiAgICAgICAgICAgIGNvbnN0IGZvckFwcGVuZGluZyA9IGA8bGkgY2xhc3M9XCJlYnNjby1saVwiPjxhIGhyZWY9XCIke3Byb3h5UHJlcGVuZH0ke3Jlc3VsdEJhc2UucGVybWFsaW5rfVwiPiR7cmVzdWx0QmFzZS5hcnRpY2xlVGl0bGV9PC9hPjwvbGk+YDtcbiAgICAgICAgICAgIGxldCB0dCA9IG5ldyBDaGVhdHNoZWV0c0Jsb2NrQ29udGVudChmb3JBcHBlbmRpbmcsIFwiZWJzY29fYXBpX2E5aFwiKTtcbiAgICAgICAgICAgIHR0LmdldFRvQXBwZW5kaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIHdlIG9ubHkgd2FudCB0byB3b3JrIHdpdGggYXJyYXlzIHRoYXQgaGF2ZSBhIHVpZCwgd2hpY2ggbWVhbnMgaXQncyBhIHNhdmVkIHNlYXJjaCByZWZlcmVuY2UuXG4gICAgbGV0IGJyZWFkID0gYmxvY2tEYXRhLmZpbHRlcihhcnIgPT4ge1xuICAgICAgcmV0dXJuIGFyci51aWQ7XG4gICAgfSk7XG4gICAgLy8gICBncmFiIHRoZSB1aWQgYW5kIHJ1biB0aGUgZGIgZ2V0IGZ1bmN0aW9uIGZvciBpdFxuICAgIGJyZWFkLmZvckVhY2goYnV0dGVyID0+IHtcbiAgICAgIGdldEVic2NvSW5mbyhidXR0ZXIudWlkKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgLy8gZ29ubmEgbmVlZCB0byBmaWd1cmUgb3V0IGhvdyB0byBtYWtlIGl0IHNvIG9uZSBmdW5jdGlvbiB3aWxsIHdvcmsgZm9yIGFsbCBjaXRhdGlvbiBzdHlsZXMuIGxpa2UgY29uc29saWRhdGUgd2hhdCBjb250ZW50IGlzIGluY2x1ZGVkLiBEb24ndCB3YW50IHN1YiBmdW5jdGlvbnMgZm9yIGVhY2guLi5cbiAgZnVuY3Rpb24gd2VibGlua3NCbG9ja0luaXRpYWxpemUoKSB7XG4gICAgLyogcHJvYiBnb25uYSB3YW50IHRoaXMgZnVuY3Rpb24gYnV0IHRoZW4gZGlmZmVyZW50IGZ1bmN0aW9ucyBmb3IgZWFjaCBjaXRhdGlvbiBzdHlsZSBzaW5jZSB0aGV5IG1heSBlbmQgdXAgYmVpbmcgc28gZGlmZmVyZW50ICovXG4gICAgbGV0IHdlYmxpbmtzRm9yVGhpc0NoZWF0c2hlZXQgPSBbXTtcbiAgICBjb25zb2xlLmxvZyhcIndlYmxpbmtzX2Jsb2NrSU5JVFwiKTtcbiAgICAvKiBuZWVkIHRvIGdyYWIgdGhlIHdlYmxpbmtzIGZyb20gZGlmZmVyZW50IHJlZiBhbmQgdGhlbiBnbyBvdmVyIGVhY2ggb25lIHRvIGZpbmQgdGhlIG9uZXMgd2l0aCB0aGlzIHN1YmplY3QgYW5kIHRob3NlIGdldCBhcHBlbmRlZCAqL1xuICAgIHdlYmxpbmtzQ29udGVudFJlZlxuICAgICAgLmdldCgpXG4gICAgICAudGhlbihmdW5jdGlvbihxdWVyeVNuYXBzaG90KSB7XG4gICAgICAgIHF1ZXJ5U25hcHNob3QuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhkb2MuZGF0YSgpLkFzc29jaWF0ZWRTdWJqZWN0cyk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgZG9jLmRhdGEoKS5Bc3NvY2lhdGVkU3ViamVjdHMuc29tZSgoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBcIkxpdGVyYXR1cmVcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB3ZWJsaW5rc0ZvclRoaXNDaGVhdHNoZWV0LnB1c2goZG9jLmRhdGEoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgLyogU28sIGF0IHRoaXMgcG9pbnQgd2UgaGF2ZSB3ZWJsaW5rc2ZvcnRoaXNjaGVhdHNoZWV0IHBvcHVsYXRlZCB3aXRoIHRoZSBkYXRhIGZvciBlYWNoIGxpbmsgd2UgYWN0dWFsbHkgd2FudCAqL1xuICAgICAgICBjb25zb2xlLmxvZyh3ZWJsaW5rc0ZvclRoaXNDaGVhdHNoZWV0LCBcIkVIXCIpO1xuICAgICAgICBsZXQgaW5pdERvbSA9IG5ldyBDaGVhdHNoZWV0c05lZWRVTChcIndlYmxpbmtzX2Jsb2NrXCIpO1xuICAgICAgICBpbml0RG9tLmdldFRvQXBwZW5kaW5nKCk7XG4gICAgICAgIHdlYmxpbmtzRm9yVGhpc0NoZWF0c2hlZXQuZm9yRWFjaChsaW5rRGF0YSA9PiB7XG4gICAgICAgICAgbGV0IGxpbmtEZXNjcmlwdGlvbiwgbGlua0Rpc3BsYXlOYW1lLCBsaW5rTGluaztcbiAgICAgICAgICBpZiAobGlua0RhdGEuRGVzY3JpcHRpb24gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsaW5rRGVzY3JpcHRpb24gPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsaW5rRGVzY3JpcHRpb24gPSBsaW5rRGF0YS5EZXNjcmlwdGlvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFsaW5rRGF0YS5kaXNwbGF5TmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gZWxzZSBsaW5rRGlzcGxheU5hbWUgPSBsaW5rRGF0YS5kaXNwbGF5TmFtZTtcbiAgICAgICAgICBpZiAoIWxpbmtEYXRhLmxpbmspIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGVsc2UgbGlua0xpbmsgPSBsaW5rRGF0YS5saW5rO1xuICBcbiAgICAgICAgICBsZXQgZm9yRG9tID0gYDxsaT48YSBocmVmPVwiJHtsaW5rTGlua31cIj4ke2xpbmtEaXNwbGF5TmFtZX08L2E+PHA+JHtsaW5rRGVzY3JpcHRpb259PC9wPjwvbGk+YDtcbiAgICAgICAgICBsZXQgd2VibGlua3NDb250ZW50ID0gbmV3IENoZWF0c2hlZXRzQmxvY2tDb250ZW50KFxuICAgICAgICAgICAgZm9yRG9tLFxuICAgICAgICAgICAgXCJ3ZWJsaW5rc19ibG9ja1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgICB3ZWJsaW5rc0NvbnRlbnQuZ2V0VG9BcHBlbmRpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuICBcbiAgY2xhc3MgQ2hlYXRzaGVldHNCbG9ja0NvbnRlbnQge1xuICAgIGNvbnN0cnVjdG9yKGJsb2NrQ29udGVudCwgbmFtZSkge1xuICAgICAgdGhpcy5ibG9ja0NvbnRlbnQgPSBibG9ja0NvbnRlbnQ7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBnZXRUb0FwcGVuZGluZygpIHtcbiAgICAgIHZhciBkb21zbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMubmFtZX0tdWxgKTtcbiAgICAgIGRvbXNuLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCB0aGlzLmJsb2NrQ29udGVudCk7XG4gICAgfVxuICB9XG4gIGNsYXNzIENoZWF0c2hlZXRzTmVlZFVMIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBnZXRUb0FwcGVuZGluZygpIHtcbiAgICAgIHRoaXMuYmxvY2tDb250ZW50ID0gYDx1bCBpZD1cIiR7dGhpcy5uYW1lfS11bFwiPjwvdWw+YDtcbiAgICAgIC8vIHRoaXMuYmxvY2tDb250ZW50ID0gYDxkaXYgaWQ9XCIke3RoaXMubmFtZX0tYmxvY2tcIiBjbGFzcz1cImNoZWF0c2hlZXRCbG9ja1wiPjx1bCBpZD1cIiR7dGhpcy5uYW1lfS11bFwiPjwvdWw+PC9kaXY+YDtcbiAgICAgIHZhciBkb21zbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMubmFtZX0taW50ZXJpb3JgKTtcbiAgICAgIGRvbXNuLmluc2VydEFkamFjZW50SFRNTChcImJlZm9yZWVuZFwiLCB0aGlzLmJsb2NrQ29udGVudCk7XG4gICAgfVxuICB9XG4gICB9KSgpO1xuXG5cblxuIiwibW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJzdGFydFwiKTtcbiAgY29uc3QgcHJveHlSZWYgPSBkYi5jb2xsZWN0aW9uKFwicHJveHlTZXJ2ZXJVcmxcIik7XG4gIGxldCBwcm94eVByZXBlbmQ7XG5cbiAgIHJldHVybiBwcm94eVJlZiAvKiBHZXQgb3VyIGN1cnJlbnQgcHJveHlzZXJ2ZXIgcHJlcGVuZCAqL1xuICAgIC5nZXQoKVxuICAgIC50aGVuKGZ1bmN0aW9uKHF1ZXJ5U25hcHNob3QpIHtcbiAgICAgIHF1ZXJ5U25hcHNob3QuZm9yRWFjaChmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgIHByb3h5UHJlcGVuZCA9IGRvYy5kYXRhKCkucHJveHlVUkw7XG4gICAgICAgIFxuICAgICAgfSlcbiAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHByb3h5UHJlcGVuZFxuICAgIH0pXG4gICAgIFxufTtcblxuIl19
