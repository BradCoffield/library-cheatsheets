module.exports = () => {
  const defaultOrderRef = db2
    .collection("defaultBlockOrder")
    .doc("defaultOrder");
  /*Get the current default order for cheatsheet blocks*/
  return defaultOrderRef.get().then(function(doc) {
    if (doc.exists) {
      // console.log("get-default-order!");
      return doc.data().order;
    } else {
      console.log("No such document!");
    }
  });
};
