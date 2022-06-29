const BlockContent = require("../../domClasses/blockContent");

module.exports = async (data) => {
  let htmlWeWant = `  <form role="search" style="margin-top: -.44rem">
    <div class="input-group add-on">
        <input class="form-control" placeholder=" " id="1549903767743" name="CatalogSearch"
            type="text">
        <div class="input-group-btn">
            <button class="btn btn-default search_link1549903767743" id="primo-search-button" type="submit">
             
                Search
            
            </button>
        </div>
    </div>
    
    </form>
   <div id="adv-search-link">
                        <a href="https://trails-rocky.primo.exlibrisgroup.com/discovery/search?vid=01TRAILS_ROCKY:01TRAILS_ROCKY&mode=advanced">Advanced Search</a> |   <a href="https://libkey.io/">DOI Lookup</a>
                    </div>`;

  let tt = new BlockContent(htmlWeWant, "primo_quick_search-interior");
  tt.getToAppending();

  let aa = document.getElementById("primo-search-button");
  aa.addEventListener("click", function (event) {
    var target =
      "https://trails-rocky.primo.exlibrisgroup.com/discovery/search?tab=Everything&search_scope=MyInstitution&vid=01TRAILS_ROCKY:01TRAILS_ROCKY&offset=0&query=any,contains," +
      document.getElementById("1549903767743").value;
    console.log(document.getElementById("1549903767743").value);
    window.open(target, "_blank");
  });
};
