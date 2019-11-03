// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.someMethod = functions.https.onRequest((req, res) => {
    var stuff = [];
    var db = admin.firestore();
    db.collection("test-collection-1").doc("document-test-1").get().then(snapshot => {

        snapshot.forEach(doc => {
            res.send(doc.data())
            // var newelement = {
            //     "id": doc.id,
            //     "xxxx": doc.data().xxx,
            //     "yyy": doc.data().yyy
            // }
            // stuff = stuff.concat(newelement);
        });
        // res.send(stuff)
        return "";
    }).catch(reason => {
        res.send(reason)
    })
});