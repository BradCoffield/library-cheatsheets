var _ = require('lodash');

module.exports = () => {
  const defaultOrderRef = db2
    .collection("defaultBlockOrder")
    .doc("defaultOrder");
  /*Get the current default order for cheatsheet blocks*/
  return defaultOrderRef.get().then(function(doc) {
    if (doc.exists) {
      console.log("get-default-order!", doc.data());
      console.log(doc.data().order)
      // return doc.data().order
      let actualOrder = []
    
      const keys = Object.keys(doc.data().orderObject)
    
      // look in object for the item with i and push that key to the array....
      
      function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
      }

      for (let i = 1; i < keys.length+1; i++) {
        actualOrder.push(getKeyByValue(doc.data().orderObject, i))
        
      }
      console.log(actualOrder)
 return actualOrder
    } else {
      console.log("No such document!");
    }
  });
};
