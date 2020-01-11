const NeedUL = require("../../domClasses/needUL");
const BlockContent = require("../../domClasses/blockContent");
// const rmcLibDataDocument = require("../../db/rmc-lib-data-single-document");

module.exports = async blockData => {
  console.log(blockData);
  let initDom = new NeedUL("dpla");
  initDom.getToAppending();
  let topicsWanted = blockData.filter(arr => {
    return arr["topics"];
  });
  console.log(topicsWanted);

  fetch(
    `https://api.dp.la/v2/items?q=${topicsWanted[0].topics[0]}&api_key=2f7220ddc3368cb08ede39b319bcf34d`
  )
    .then(res => res.json())
    .then(json => {
      console.log(json.docs);
      console.log("title:", json.docs[0].sourceResource.title[0]);
      console.log("creator:", json.docs[0].sourceResource.creator[0]);
      console.log("data provider:", json.docs[0].dataProvider);
      if (json.docs[0].sourceResource.date)
        console.log("date", json.docs[0].sourceResource.date[0].displayDate);
      if (json.docs[0].sourceResource.type)
        console.log("item type:", json.docs[0].sourceResource.type[0]);
      if (json.docs[0].sourceResource.format)
        console.log("format:", json.docs[0].sourceResource.format[0]);
      console.log("image:", json.docs[0].object);

      json.docs.forEach(result => {
        let title, img, description, type, creator
        if (result.sourceResource.title) title = result.sourceResource.title[0];
        else title = "";

        if (result.object) img = result.object;
        else img = "";

        if (result.sourceResource.type) type = result.sourceResource.type[0];
        else type = "";

       if (result.sourceResource.creator)  creator = result.sourceResource.creator[0]
        else creator = ""

        let forTheDom = `<ul class="dpla-item-ul">
        <li>${title}</li>
        <li>${creator}</li>
        <li><img src="${img}" alt=""></img></li>
        <li>${type}</li>
        
        </ul>`;
        let tt = new BlockContent(forTheDom, "dpla");
        tt.getToAppending();
      });
    });

  /* What do I need from the record?
* Title = title[0]
* creator = sourceResource.creator[0]
* Responsible party = dataProvider or? provider.name
* Date = date[0].displayDate - but isn't in some...
* Object Type = format[0]
* Image = object
* type = sourceResource.type[0] (like, image)
* format = sourceResource.format[0] (like, pencil works)




*/
};
