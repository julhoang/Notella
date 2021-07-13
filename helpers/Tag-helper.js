/* -------
  File: Tag-helper.js
  
  Functionalities:
    1. Create tag bars (using Tagify.js)
    2. Assist the Filter panel (search for tag)
---------- */

export var localArchive = [];
export var needFilterPanelUpdate = false;

import { makeCard, addAllDeleteButtons, createElement } from "./DOM-helper.js";

export function addTagsToAllCards(archive) {
  archive = retrieveStorageData();
  var whitelist = localStorage.getItem("whitelist").split(",");
  var activeTags = [];

  var cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    var tagBarBtn = cards[i].querySelector(".card_tagBar p");

    if (archive[i].tags == null || archive[i].tags == "") {
      tagBarBtn.value = "";
    } else {
      tagBarBtn.value = archive[i].tags.split(",");
      activeTags.push(archive[i].tags.split(","));
    }

    // ----- tagify code ------
    var tagify = new Tagify(tagBarBtn, {
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

      if (!activeTags.includes(newInput)) {
        addToFilterPanel(newInput);
      } else {
        updateFilterPanel(newInput, 1);
      }

      activeTags.push(newInput);

      var articleTitle =
        e.detail.tagify.DOM.input.parentNode.parentNode.parentNode.getElementsByTagName(
          "h3"
        )[0].innerHTML;

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

      var articleTitle =
        e.detail.tagify.DOM.input.parentNode.parentNode.parentNode.getElementsByTagName(
          "h3"
        )[0].innerHTML;

      var currentEntry = JSON.parse(localStorage.getItem(articleTitle));

      currentEntry.tags = currentEntry.tags.replace(e.detail.data.value, "");
      currentEntry.tags = currentEntry.tags.replaceAll(",,", ",");

      var newActiveTags = activeTags.toString().replace(removeItem, "");

      localStorage.setItem("activeTags", newActiveTags);
      localStorage.setItem(articleTitle, JSON.stringify(currentEntry));

      updateFilterPanel(removeItem, -1);
    });
  } // for loop

  localStorage.setItem("activeTags", activeTags);
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

function updateFilterPanel(tagName, changeValue) {
  tagName = tagName.replaceAll(",", "");
  let divClassName = "tag_" + tagName;
  let targetDiv = document.getElementsByClassName(divClassName)[0];

  let count =
    parseInt(targetDiv.getElementsByClassName("tagValue")[0].innerText, 10) +
    changeValue;

  if (count <= 0) {
    targetDiv.remove();
  } else {
    targetDiv.getElementsByClassName("tagValue")[0].innerText = count;
  }
}

function retrieveStorageData() {
  // IF DATA EXISTS --> SAVE DATA INTO ARCHIVE ARRAY
  var archive = [],
    keys = Object.keys(localStorage),
    i = 0,
    key;

  for (; (key = keys[i]); i++) {
    if (
      key == "currentUID" ||
      key == "whitelist" ||
      key == "sorting" ||
      key == "activeTags"
    )
      continue;
    var keyArray = JSON.parse(localStorage.getItem(key));

    if (keyArray == null) continue;
    archive.push(keyArray);
  }

  var currentSort = localStorage.getItem("sorting");
  archive = sorting(archive, "UID", currentSort);

  return archive;
}

function addToFilterPanel(newInput) {
  var tagDiv = document.createElement("div");
  tagDiv.classList.add("tag_" + newInput);
  tagDiv.classList.add("tagDiv");
  createElement(newInput, "span", "tagName", tagDiv);
  createElement(1, "span", "tagValue", tagDiv);
  tagDiv.onclick = function (event) {
    var tag = this.classList[0].replace("tag_", "");
    searchTag(tag);
  };

  document.getElementById("filterCol").appendChild(tagDiv);
}

export function searchTag(tag) {
  var archive = retrieveStorageData();

  tag = tag.toLowerCase();
  displayCards(archive);
  addTagsToAllCards(archive);
  addAllDeleteButtons();

  for (let i = 0; i < archive.length; i++) {
    var allTags = archive[i].tags.toString().toLowerCase();

    if (allTags.includes(tag) == false) {
      document.getElementById(archive[i].UID).remove();
    }
  }
}

function displayCards(array) {
  document.getElementById("allData").innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    makeCard(array[i]);
  }
}

function sorting(array, key, trend) {
  if (key == "UID") {
    if (trend == "up") {
      array.sort((a, b) => a.UID - b.UID);
    } else {
      array.sort((a, b) => b.UID - a.UID);
    }

    localStorage.setItem("sorting", trend);
  }

  return array;
}
