let rawHtml = (function() {
  console.log("hi");
  let htmlWeWant =
    "This is some custom stuff. Here comes a break <br> and this should be after the break. <ul><li>hi i'm a li</li></ul>";
  let domHook = document.getElementById("raw-html");
  domHook.insertAdjacentHTML("afterbegin", htmlWeWant);
})();
