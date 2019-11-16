var parseString = require("xml2js").parseString;
const fetch = require("node-fetch");
var xml = "<root>Hello xml2js!</root>";
parseString(xml, function(err, result) {
  console.dir(result);
});
let url = `http://eit.ebscohost.com/Services/SearchService.asmx/Search?prof=s8250848.main.eitws&pwd=ebs198&query=borges&db=eih`;
fetch(url)
  .then(res => res.text())
  .then(body =>
    parseString(body, function(err, result) {
        console.log(result.searchResponse.SearchResults[0].records[0].rec[0].header[0].controlInfo[0].artinfo[0].aug[0].au);
      
    })
  );
