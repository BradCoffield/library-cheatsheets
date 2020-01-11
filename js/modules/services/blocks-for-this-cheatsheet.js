module.exports = dataForThisCheatsheet => {
  let blocksForProduction = [];

  const keys = Object.keys(dataForThisCheatsheet);
  console.log(keys)

  keys.forEach(i => {
      // find blocks with metadata
    const useInProd = dataForThisCheatsheet[i].filter(item => {
      return item.metadata;
    });
    if (useInProd[0] && useInProd[0].metadata.useInProduction == true) {
      blocksForProduction.push(i); //create an array of values representing the blocks we actually are using on this page.
    } // if the metadata included a true on useInProduction
  });
 
  return blocksForProduction;
};
