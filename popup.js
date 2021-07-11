/* -------
  File: popup.js
  
  --> Script to handle Notella popup (popup.html)
---------- */

window.onload = function () {
  var openBtn = document.getElementById("newPage");
  openBtn.onclick = function () {
    window.open("main.html");
  };
};

popUp_loadHighlights();

function popUp_loadHighlights() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var key = tabs[0].title;

    if (localStorage.getItem(key) == null) return;

    document.getElementById("noData").style.display = "none";

    if (localStorage.getItem(key) !== undefined) {
      var contents = JSON.parse(localStorage.getItem(key)).content;

      contents = contents.sort((x, y) => x.index - y.index);

      document.getElementById("count").innerText =
        "You have " + contents.length + " highlights from this page.";

      console.table(contents);

      for (let i = 0; i < contents.length; i++) {
        popUp_createHighlightDiv(contents[i].selection);
      }
    }
  });
}

function popUp_createHighlightDiv(content) {
  var container = document.createElement("div");
  container.className = "highlightText";
  container.innerText = content;

  document.getElementById("text").appendChild(container);
}
