/* -------
  File: mainScript.js
  
  --> Script to handle Notella dashboard (main.html)
---------- */

window.addEventListener("storage", () => {
  // When local storage changes, force reload page and update archive []
  location.reload();
  retrieveStorageData();
});

import {
  makeCard,
  addAllDeleteButtons,
  makeElement,
} from "./helpers/DOM-helper.js";

import {
  addTagsToAllCards,
  localArchive,
  searchTag,
} from "./helpers/Tag-helper.js";

var archive = [],
  keys = Object.keys(localStorage),
  i = 0,
  key;

function retrieveStorageData() {
  // INITIALISED ALL DATA UPON 1st USE
  if (localStorage.getItem("currentUID") == null) {
    localStorage.setItem("sorting", "down");
    localStorage.setItem("currentUID", -1);
    localStorage.setItem("whitelist", ["none"]);
    localStorage.setItem("activeTags", []);
    archive = [];
    return;
  }

  // IF DATA EXISTS --> SAVE DATA INTO ARCHIVE ARRAY
  for (; (key = keys[i]); i++) {
    if (
      key == "currentUID" ||
      key == "whitelist" ||
      key == "sorting" ||
      key == "activeTags"
    )
      continue;
    var keyArray = JSON.parse(localStorage.getItem(key));
    archive.push(keyArray);
  }

  return archive;
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

function displayCards(array) {
  document.getElementById("allData").innerHTML = "";

  for (let i = 0; i < array.length; i++) {
    makeCard(array[i]);
  }
}

function activateSearch() {
  document.getElementById("searchButton").onclick = function () {
    search();
  };
}

function search() {
  var archive = retrieveStorageData();
  var input = document.getElementById("searchField").value;

  if (input == null) return;
  input = input.toLowerCase();

  // restore all cards before new search
  displayCards(archive);
  addTagsToAllCards(archive);

  console.log(archive.length);
  for (let i = 0; i < archive.length; i++) {
    var allValues = Object.values(archive[i]);

    // remove unwanted values from search array
    delete allValues[0]; // UID
    delete allValues[6]; // favicon
    delete allValues[7]; // date

    allValues = allValues.toString().toLowerCase();
    console.log(allValues);

    var allContents = Object.values(archive[i].content);
    allContents = Object.values(allContents);
    var allSelection = [];

    for (let i = 0; i < allContents.length; i++) {
      allSelection.push(allContents[i].selection);
    }

    allSelection = allSelection.toString().toLowerCase();

    if (!allValues.includes(input) && !allSelection.includes(input)) {
      document.getElementById(archive[i].UID).remove();
    }
  }
}

function displayFilterPanel() {
  var activeTags = localStorage.getItem("activeTags").split(",");
  var countDuplicateTags = {};

  // The expression counts[x] || 0 returns the value of counts[x] if it is set, otherwise 0.
  // Then just add one and set it again in the object and the count is done
  activeTags.forEach(function (x) {
    countDuplicateTags[x] = (countDuplicateTags[x] || 0) + 1;
  });

  var duplicateKeys = Object.keys(countDuplicateTags);
  for (let i = 0; i < duplicateKeys.length; i++) {
    let key = duplicateKeys[i];
    let value = countDuplicateTags[key];

    if (key == "") continue;

    var tagDiv = document.createElement("div");
    tagDiv.classList.add("tag_" + key);
    tagDiv.classList.add("tagDiv");
    makeElement(key, "span", "tagName", tagDiv);
    makeElement(value, "span", "tagValue", tagDiv);

    tagDiv.onclick = function (event) {
      var tag = this.classList[0].replace("tag_", "");
      searchTag(tag);
    };

    document.getElementById("filterCol").appendChild(tagDiv);
  }
}

// METHOD CALLING
retrieveStorageData();

var currentSorting = localStorage.getItem("sorting");

archive = sorting(archive, "UID", currentSorting);

displayCards(archive);

addTagsToAllCards(archive);

addAllDeleteButtons();

feather.replace(); // convert all icon to SVGs and display it

activateSearch();

displayFilterPanel();
