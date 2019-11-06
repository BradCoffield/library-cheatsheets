let primoQuickSearch = (function() {
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
<a href="https://rocky-primo.hosted.exlibrisgroup.com/primo-explore/search?sortby=rank&vid=01TRAILS_ROCKY&lang=en_US&mode=advanced">Advanced Search</a>
</div>`;

  let domHook = document.getElementById("primo-quick-search");
  domHook.insertAdjacentHTML("afterbegin", htmlWeWant);

let aa = document.getElementById('primo-search-button')
aa.addEventListener('click', function(event) {
    var target = "https://rocky-primo.hosted.exlibrisgroup.com/primo-explore/search?vid=01TRAILS_ROCKY&institution=01TRAILS_ROCKY&tab=default_tab&indx=1&bulkSize=10&srt=relevance&sortField=default&search_scope=01TRAILS_ROCKY&query=any,contains,"+document.getElementById('1549903767743').value;
    console.log(document.getElementById('1549903767743').value);
    window.open(target,'_blank');
})
})();
