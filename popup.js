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

loadHighlights();

function loadHighlights() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var key = tabs[0].title;

    if (localStorage.getItem(key) == null) {
      document.getElementById("tagBar").style.display = "none";
      return;
    }

    addTagBar(JSON.parse(localStorage.getItem(key)).tags, key);

    document.getElementById("noData").style.display = "none";

    if (localStorage.getItem(key) !== undefined) {
      var contents = JSON.parse(localStorage.getItem(key)).content;

      contents = contents.sort((x, y) => x.index - y.index);

      document.getElementById("count").innerText =
        "You have " + contents.length + " highlights from this page.";

      console.table(contents);

      for (let i = 0; i < contents.length; i++) {
        createHighlightDiv(contents[i].selection, contents[i].color);
      }
    }
  });
}

function createHighlightDiv(content, color) {
  var container = document.createElement("div");
  container.className = "highlightText";
  container.classList.add(color);
  container.innerText = content;

  document.getElementById("text").appendChild(container);
}

function addTagBar(tags, articleTitle) {
  var tagBar = document.querySelector("#tagBar p");

  tagBar.value = tags == null || tags == "" ? "" : tags.split(",");

  console.log("tag value: ", tagBar.value);
  var whitelist = localStorage.getItem("whitelist").split(",");
  // ----- tagify code ------
  var tagify = new Tagify(tagBar, {
    delimiters: ",| ", // add new tags when a comma or a space character is entered
    whitelist: whitelist,
    transformTag: transformTag,
    placeholder: "Type to Add Tags.",
    templates: {
      dropdownItemNoMatch: function (data) {
        return `
                  No suggestion found for: ${data.value}
                  `;
      },
    },
  });

  // ADD FUNCTIONALITY
  tagify.on("add", function (e) {
    var newInput = e.detail.data.value;
    var activeTags = localStorage.getItem("activeTags").toString().split(",");

    // add to the master whitelist
    if (!whitelist.includes(newInput)) {
      whitelist.push(newInput);
      localStorage.setItem("whitelist", whitelist);
    }

    activeTags.push(newInput);

    // UPDATE TAGS DATA on LOCAL STORAGE
    var currentEntry = JSON.parse(localStorage.getItem(articleTitle));

    if (currentEntry.tags == "") {
      currentEntry.tags = newInput;
    } else {
      currentEntry.tags += "," + newInput;
    }

    currentEntry.tags = currentEntry.tags.replaceAll(",,", ",");

    localStorage.setItem("activeTags", activeTags);
    localStorage.setItem(articleTitle, JSON.stringify(currentEntry));
  });

  // REMOVE FUNCTIONALITY
  tagify.on("remove", function (e) {
    var removeItem = e.detail.data.value;
    var activeTags = localStorage.getItem("activeTags").toString().split(",");

    if (activeTags.toString().split(",")[0] !== removeItem) {
      removeItem = "," + removeItem;
    }

    var currentEntry = JSON.parse(localStorage.getItem(articleTitle));

    currentEntry.tags = currentEntry.tags.replace(e.detail.data.value, "");
    currentEntry.tags = currentEntry.tags.replaceAll(",,", ",");

    var newActiveTags = activeTags.toString().replace(removeItem, "");

    localStorage.setItem("activeTags", newActiveTags);
    localStorage.setItem(articleTitle, JSON.stringify(currentEntry));
  });
}

// generate a random color (in HSL format)
function getRandomColor() {
  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  var h = rand(1, 360) | 0,
    s = rand(40, 70) | 0,
    l = rand(65, 72) | 0;

  return "hsl(" + h + "," + s + "%," + l + "%)";
}

// apply color to tags
function transformTag(tagData) {
  tagData.style = "--tag-bg:" + getRandomColor();
}
