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
    let bookResults = await rmcLibDataDocument("primo-book-searches", uid);
    // console.log(bookResults.results);
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
    var ourRandoms = getRandomNumbers(4, rawData.length);
    // console.log(bookResults.length, ourRandoms);

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

   let theIsbn = ""
    if(bookData && bookData.isbn){ theIsbn = bookData.isbn[0];}
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
    append.getToAppending();

    // lets snag the new book dom and check it
    let newBook = document.getElementById(`cover${iterator}`);
    newBook.addEventListener("load", function() {
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
      domsn.insertAdjacentHTML("beforeend", this.theBookStuff);
      // checkThisBook(i);

      // totalDisplayed++;
    }
  }
};
