/* NOTE: this is mostly but not compeltely the code from PRIMO-DYNAMIC_NEWBOOKS. Seems to be working without out the retrying shenanigans.... */


const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
const rmcLibDataDocument = require("../../db/rmc-lib-data-single-document");

module.exports = async blockData => {
//   let initDom = new NeedUL("primo_book_searches");
//   initDom.getToAppending();
  const howManyWeWant = 5;
  let totalDisplayed = 0;

  function checkThisBook(num) {
    let selectah = document.getElementById(`cover${num}`);
    let selectah2 = document.getElementById(`new-books-li-${num}`);
    if (selectah.naturalWidth < 50) {
      selectah2.style.display = "none";
    }
    if (selectah.naturalWidth > 50) {
      totalDisplayed++;
    }
  }
  let uidsWanted = [];
  blockData
    .filter(arr => {
      return arr.uid;
    })
    .forEach(butter => {
      uidsWanted.push(butter.uid);
    });
  // console.log(uidsWanted);

  function doThings(results, randoms) {
    let baseDom = document.getElementById("primo_book_searches-interior");
    baseDom.insertAdjacentHTML("beforeend", "<ul id='new-books'></ul>");
    let nextDom = document.getElementById("new-books");
    nextDom.style.display = "none";
    let i = 0;
    for (i; totalDisplayed < howManyWeWant; i++) {
      // console.log(results.rawData[results.ourRandoms[i]].pnx.search);
// console.log(randoms[i], results[randoms[i]]);
      let theIsbn = results[randoms[i]].isbn[0];
      let theTitle = results[randoms[i]].title;
      let theCatalogLink = `<a href="https://rocky-primo.hosted.exlibrisgroup.com/permalink/f/1j18u99/${
        results[randoms[i]].sourceid[0]
      }${results[randoms[i]].sourcerecordid[0]}"
        target="_blank">`;

      let syndetics = `https://syndetics.com/index.aspx?isbn=${theIsbn}/MC.JPG&client=primo`;

      addToDom(syndetics, theTitle, theCatalogLink, i);
    }
    // let nextDom = document.getElementById("new-books");
    // let preloader = document.getElementById("library-preloader");
    // preloader.style.display = "none";
    nextDom.style.display = "block";
  }

  uidsWanted.forEach(async uid => {
    let bookResults = await rmcLibDataDocument("primo-book-searches", uid);
    // console.log(bookResults);
    const rawData = bookResults.results;
    const getRandomNumbers = function(howMany, upperLimit) {
      var limit = howMany,
        amount = 1,
        lower_bound = 1,
        upper_bound = upperLimit,
        unique_random_numbers = [];
      if (amount > limit) limit = amount; //Infinite loop if you want more unique natural numbers than exist in a given range
      while (unique_random_numbers.length < limit) {
        var random_number = Math.floor(
          Math.random() * (upper_bound - lower_bound) + lower_bound
        );
        if (unique_random_numbers.indexOf(random_number) == -1) {
          unique_random_numbers.push(random_number);
        }
      }
      return unique_random_numbers;
    };
    var ourRandoms = getRandomNumbers(30, 70);
    doThings(rawData, ourRandoms);
  });

  function addToDom(theIMG, theTitle, catalogLink, i) {
    if (totalDisplayed < howManyWeWant) {
      class RmcNewBooks {
        constructor(theBookStuff) {
          this.theBookStuff = theBookStuff;
        }
        getToAppending() {
          var domsn = document.getElementById("new-books");
          domsn.insertAdjacentHTML("beforeend", this.theBookStuff);
          checkThisBook(i);

          //   totalDisplayed++;
        }
      }

      var theBookStuff = `
             <li class="new-books-li" id="new-books-li-${i}">
               <div class="content">
                
                   ${catalogLink}
                       <div class="content-overlay"></div>
                       <img class="content-image book-cover" id="cover${i}" src="${theIMG}"  >
                       <div class="content-details fadeIn-bottom">
                           <div class="content-title">${theTitle}
                            
                   
                       </div>
                   </a>
               </div>
           </li>`;

      var ttttt = new RmcNewBooks(theBookStuff);
      ttttt.getToAppending();
    }
  }

  //   let getPrimoBooksAndAppend = async uid => {
  //     let bookResults = await rmcLibDataDocument("primo-book-searches", uid);
  //     console.log(bookResults);
  //     for (let i = 0; i < 10; i++) {
  //         let resultBase = bookResults.results[i];

  //         const forAppending = `<li class="ebsco-li"><a href="${proxyPrepend}${resultBase.permalink}">${resultBase.articleTitle}</a></li>`;
  //         let tt = new BlockContent(forAppending, "primo_book_searches");
  //         tt.getToAppending();
  //       }
  //   };
};
