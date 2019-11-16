// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");
const fetch = require("node-fetch");
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.primoBooksGrab = functions.https.onRequest((req, res) => {
  const stringEncoder = function(input){
   return encodeURIComponent(input)
  };
  const field = req.query.field
  const value = req.query.value
  const precision = req.query.precision
  let url =
  `https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=${field},${precision},${stringEncoder(value)}&vid=01TRAILS_ROCKY&tab=default_tab&limit=150&scope=P-01TRAILS_ROCKY&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47`
  console.log(url);

fetch(url)
.then(resp => resp.json())
.then(function(result) {
  let processedResults = [];
  result.docs.forEach(i => {
    if (i.pnx.search.isbn) {
      processedResults.push({
        isbn: i.pnx.search.isbn,
        title: i.pnx.display.title,

      });
    }
  });
 return processedResults
}).then(function(result){

 return db
  .collection("primo-searches")
  .doc(value)
  .set({field,precision,searchTerm:value,results: result}, { merge: false });
 
});
res.send("Thanks!")
})


exports.primoNewBooksGrab = functions.https.onRequest((req, res) => {
  
  let url =
  "https://api-na.hosted.exlibrisgroup.com/primo/v1/search?q=lsr03%2Cexact%2Cnewbooks&vid=01TRAILS_ROCKY&tab=default_tab&limit=150&scope=P-01TRAILS_ROCKY&apikey=l8xx79d281ecc1e44f9f8b456a23c8cb1f47";

 


fetch(url)
  .then(resp => resp.json())
  .then(function(result) {
    let processedResults = [];
    result.docs.forEach(i => {
      if (i.pnx.search.isbn) {
        processedResults.push({
          isbn: i.pnx.search.isbn,
          title: i.pnx.display.title,

        });
      }
    });
   return processedResults
  }).then(function(result){
    res.send("Sending this to Firestore: ",result);
   return db
    .collection("primo-searches")
    .doc("new-books")
    .set({results: result}, { merge: false });
   
  });
});
