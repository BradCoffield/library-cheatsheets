module.exports = async blockData => {
  fetch(
    "https://api.dp.la/v2/items?q=weasels&api_key=2f7220ddc3368cb08ede39b319bcf34d"
  )
    .then(res => res.json())
    .then(json => {
      console.log(json.docs);
      console.log("title:", json.docs[0].sourceResource.title[0]);
      console.log("creator:", json.docs[0].sourceResource.creator[0]);
      console.log("data provider:", json.docs[0].dataProvider);
      if (json.docs[0].sourceResource.date)
        console.log("date", json.docs[0].sourceResource.date[0].displayDate);
      if (json.docs[0].sourceResource.type) console.log("item type:", json.docs[0].sourceResource.type[0]);
      if (json.docs[0].sourceResource.format)console.log("format:", json.docs[0].sourceResource.format[0]);
      console.log("image:", json.docs[0].object)

      json.docs.forEach((result) => {
        let forTheDom = `<ul class="dpla-item-ul">
        <li>${result.sourceResource.title}</li>
        <li><img scr="${result.object}"</li>
      
       
       
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        </ul>`
        console.log(forTheDom);
      })
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
