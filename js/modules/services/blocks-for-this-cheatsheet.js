module.exports = dataForThisCheatsheet => {
  console.log(dataForThisCheatsheet);

  let blocksForProduction = [];

  const keys = Object.keys(dataForThisCheatsheet);

  keys.forEach(i => {
    if (
      dataForThisCheatsheet[i].metadata &&
      dataForThisCheatsheet[i].metadata.useInProduction
    ) {
      blocksForProduction.push(i);
    }
  });

  return blocksForProduction;
};
