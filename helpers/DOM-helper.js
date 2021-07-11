/* -------
  File: DOM-helper.js
  
  Functionalities:
    1. Create DOM elements
    2. Handles Delete functions
    3. Handles the Filter Panel
---------- */

export function makeCard(array) {
  var newDiv = document.createElement("div"); // card container
  newDiv.className = "card";
  newDiv.id = array.UID;

  createElement(array.title, "h3", "card_title", newDiv);

  var contents = array.content;
  contents = contents.sort((x, y) => x.index - y.index); // sort content by position on orginal website

  for (let i = 0; i < contents.length; i++) {
    createElement(contents[i].selection, "p", "card_content", newDiv);
  }

  createLink(array.host, array.link, newDiv);

  // create Tag Bar
  var newTagDiv = document.createElement("div");
  newTagDiv.className = "card_tagBar";
  newTagDiv.id = array.UID;
  newTagDiv.innerHTML = "Tags: ";
  newTagDiv.append(document.createElement("p"));

  newDiv.appendChild(newTagDiv);

  // create Delete Button
  createElement("x", "span", "deleteBtn", newDiv);

  var myList = document.getElementById("allData");
  myList.appendChild(newDiv);
}

export function addAllDeleteButtons() {
  var allBtns = document.getElementsByClassName("deleteBtn");

  for (let i = 0; i < allBtns.length; i++) {
    allBtns[i].onclick = function () {
      deleteEntry(this.parentElement);
    };
  }
}

function deleteEntry(targetCard) {
  var title = targetCard.firstElementChild.innerText; // finding .h3 inner text
  var tagsList = JSON.parse(localStorage.getItem(title)).tags.split(",");

  var activeTags = localStorage.getItem("activeTags").toString();

  for (let i = 0; i < tagsList.length; i++) {
    if (tagsList[i] !== "") {
      activeTags = activeTags.replace(tagsList[i], "");
      updateFilterPanel(tagsList[i], -1);
    }
  }

  localStorage.setItem("activeTags", activeTags);
  localStorage.removeItem(title);
  targetCard.remove();
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

export function createElement(message, elementType, className, targetNode) {
  var newTag = document.createElement(elementType);
  newTag.innerHTML = message;
  newTag.className = className;
  targetNode.appendChild(newTag);
}

export function createLink(hostname, url, targetNode) {
  var newTag = document.createElement("a");
  var text = document.createTextNode(hostname);

  newTag.appendChild(text);
  newTag.href = url;
  newTag.className = "card_hostname";

  targetNode.appendChild(newTag);
}
