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

