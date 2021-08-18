/* -------
  File: mainScript.js --> Script to handle Notella dashboard (main.html)
---------- */

window.addEventListener("storage", () => {
  location.reload(); // force reload page when storage changes
});

import { makeOverViewBar } from "./js/DOM-helper.js";
import { makeTable } from "./js/table-helper.js";

// METHOD CALLING UPON LOADING
var archive = [],
  keys = Object.keys(localStorage),
  i = 0,
  key;

retrieveStorageData();

var currentSorting = localStorage.getItem("sorting");

archive = sorting(archive, "UID", currentSorting);

makeOverViewBar(archive);

updateOverViewBar(archive);

displayTable(archive);

$.extend($.fn.bootstrapTable.defaults.icons, {
  columns: "bi bi-view-list",
  fullscreen: "bi bi-arrows-fullscreen",
  search: "bi bi-search",
  toggleOff: "bi bi-caret-up-fill",
  toggleOn: "bi bi-caret-down-fill",
  detailClose: "bi bi-caret-up-fill",
  detailOpen: "bi bi-caret-down-fill",
});

// ------------
// FUNCTIONS

function retrieveStorageData() {
  // INITIALISED ALL DATA UPON 1st USE
  if (localStorage.getItem("currentUID") == null) {
    localStorage.setItem("sorting", "down");
    localStorage.setItem("currentUID", -1);
    localStorage.setItem("whitelist", ["none"]);
    localStorage.setItem("activeTags", []);
    localStorage.setItem("activeProjects", []);
    archive = [];
    return;
  }

  // IF DATA EXISTS --> SAVE DATA INTO ARCHIVE ARRAY
  var ignoreKey = ["currentUID", "whitelist", "sorting", "activeTags", "activeProjects"];

  for (; (key = keys[i]); i++) {
    if (ignoreKey.includes(key)) continue;
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

function displayTable(array) {
  for (let i = 0; i < array.length; i++) {
    makeTable(array[i]);
  }

  new bootstrap.Popover(document.body, {
    selector: ".has-popover",
    html: true,
    trigger: "focus",
  });
}

function updateOverViewBar(archive) {
  // update Article
  document.getElementById("totalArticlesCount").innerText = archive.length;

  // update Tag
  var activeTags = localStorage.getItem("activeTags").split(",");
  var countDuplicateTags = {};
  activeTags.forEach(function (x) {
    if (x != "") countDuplicateTags[x] = (countDuplicateTags[x] || 0) + 1;
  });
  document.getElementById("totalTagsCount").innerText = Object.keys(countDuplicateTags).length;

  // update Project
  var activeProjects = localStorage.getItem("activeProjects").split(",");
  var countDuplicateProjects = {};
  activeProjects.forEach(function (x) {
    if (x != "") countDuplicateProjects[x] = (countDuplicateProjects[x] || 0) + 1;
  });
  document.getElementById("totalProjectsCount").innerText =
    Object.keys(countDuplicateProjects).length;

  // update Highlights
  var counter = 0;
  archive.forEach((entry) => {
    counter += entry.content.length;
  });
  document.getElementById("totalHighlightsCount").innerText = counter;
}
