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

  makeElement(array.title, "h3", "card_title", newDiv);

  var contents = array.content;
  contents = contents.sort((x, y) => x.index - y.index); // sort content by position on orginal website

  for (let i = 0; i < contents.length; i++) {
    makeElement(
      contents[i].selection,
      "p",
      "card_content",
      newDiv,
      contents[i].color
    );
  }

  createLink(array.host, array.link, newDiv);

  // create Tag Bar
  var newTagDiv = document.createElement("div");
  newTagDiv.className = "card_tagBar";
  newTagDiv.id = array.UID;
  newTagDiv.innerHTML = "Tags: ";
  newTagDiv.append(document.createElement("p"));

  newDiv.appendChild(newTagDiv);

  // create Article Delete Button
  makeElement("x", "span", "articleDeleteBtn", newDiv);

  var myList = document.getElementById("allData");
  myList.appendChild(newDiv);
}

export function addAllDeleteButtons() {
  var allArticleBtns = document.getElementsByClassName("articleDeleteBtn");

  for (let i = 0; i < allArticleBtns.length; i++) {
    allArticleBtns[i].onclick = function () {
      var title = this.parentElement.querySelector("h3").innerText;
      deleteArticle(title, this.parentElement);
    };
  }

  var allHighlightBtns = document.getElementsByClassName("deleteBtn");
  for (let i = 0; i < allHighlightBtns.length; i++) {
    allHighlightBtns[i].onclick = function () {
      var title =
        this.parentElement.parentElement.querySelector("h3").innerText;
      var text = this.parentElement.querySelector("p").innerText;
      var targetCard = this.parentElement;
      deleteHighlight(title, text, targetCard);
    };
  }
}

function deleteArticle(title, targetCard) {
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

function deleteHighlight(title, text, targetCard) {
  var existingEntry = JSON.parse(localStorage.getItem(title));
  var contents = existingEntry.content;

  for (let i = 0; i < contents.length; i++) {
    if (purifyString(contents[i].selection) == purifyString(text)) {
      let index = contents.indexOf(contents[i]);
      console.log(index);

      contents.splice(index, 1);
      console.log("new: ", contents);

      existingEntry.content = contents;

      targetCard.remove();
      localStorage.setItem(title, JSON.stringify(existingEntry));
      return;
    }
  }

  console.log("not found");
}

function purifyString(text) {
  text = text
    .toString()
    .trim()
    .replaceAll("\n", "")
    .replaceAll("\t", "")
    .replaceAll(" ", "");
  return text;
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

export function makeElement(
  message,
  elementType,
  className,
  targetNode,
  color
) {
  var newTag = document.createElement(elementType);
  newTag.innerHTML = message;
  newTag.className = className;

  if (className == "card_content") {
    newTag.innerHTML = "";
    newTag.innerText = message;
    newTag.classList.add(color);
    var contentDiv = document.createElement("div");
    contentDiv.className = "content_div";
    contentDiv.appendChild(newTag);

    // create delete button within each highlight!
    makeElement("x", "span", "deleteBtn", contentDiv);
    targetNode.appendChild(contentDiv);
  } else {
    targetNode.appendChild(newTag);
  }
}

export function createLink(hostname, url, targetNode) {
  var newTag = document.createElement("a");
  var text = document.createTextNode(hostname);

  newTag.appendChild(text);
  newTag.href = url;
  newTag.className = "card_hostname";

  targetNode.appendChild(newTag);
}
