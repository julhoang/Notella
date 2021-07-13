/* -------
  File: contentScript.js
  
  Functionalities:
    1. Restore SAVED highlights if exist
    1. Process document.getSelection()
    2. Create new highlights
    3. Save Range data onto the website's localStorage
    4. Also send Range data to background script to save in Notella's storage
---------- */

window.onload = function () {
  // create the highlight popup bar
  const tooltip = new TextTip({
    minLength: 1,
    buttons: [
      {
        title: "yellow-light",
        icon: "colors/yellow-light.svg",
        callback: success,
      },
      {
        title: "green-light",
        icon: "colors/green-light.svg",
        callback: success,
      },
      { title: "blue-light", icon: "colors/blue-light.svg", callback: success },
      { title: "pink-light", icon: "colors/pink-light.svg", callback: success },
    ],
  });

  // upon finish loading, send a signal to background.js to receive back saved range UIDS
  chrome.runtime.sendMessage({ status: "done" }, function (response) {});

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.data !== undefined) {
      var message = JSON.parse(msg.data);
      var UID = message.UID;
      var sel = message.selection;

      var key = "Notella_" + UID;
      var range = JSON.parse(localStorage.getItem(key));
      if (range !== null) restoreHighlight(range);
    }
  });
};

function success() {
  var color = this.title;
  var rangeInfo = getSelectedText(document.getSelection(), color); // getSelectedText() calls highlight()
  sendMessageToBackground(rangeInfo);
}

function sendMessageToBackground(jsonMessage) {
  chrome.runtime.sendMessage(
    { request: "saveThisData", data: jsonMessage },
    function (response) {}
  );
}

var domList = Array.prototype.slice.call(
  document.body.getElementsByTagName("*")
);

function getSelectedText(selection, color) {
  var text = selection.toString();
  const range = selection.getRangeAt(0);
  var myRange = addToStorage(selection, range, color);

  console.log("myRange: ", myRange);
  const result = {
    UID: myRange.UID,
    selection: text,
    index: myRange.index,
    color: color,
  };

  highlight(selection, range, color);

  return JSON.stringify(result); // range info to return to Background.js
}

function addToStorage(sel, range, color) {
  let UID = getUID();
  let key = "Notella_" + UID;

  var dataArray = {};

  let index = document.body.innerText.indexOf(sel.toString());

  dataArray = {
    UID: UID,
    index: index,
    ancestorNodeName: range.commonAncestorContainer.nodeName,
    ancestorHTML: range.commonAncestorContainer.innerText,

    startNodeName: range.startContainer.nodeName,
    startHTML: range.startContainer.nodeValue,
    startOffset: range.startOffset,

    endNodeName: range.endContainer.nodeName,
    endHTML: range.endContainer.nodeValue,
    endOffset: range.endOffset,

    selectionText: sel.toString(),
    color: color,
  };

  if (range.commonAncestorContainer.nodeName == "#text") {
    dataArray["grandParentNodeName"] =
      range.commonAncestorContainer.parentNode.nodeName;
    dataArray["grandParentHTML"] =
      range.commonAncestorContainer.parentNode.innerText;
    dataArray["ancestorHTML"] = range.commonAncestorContainer.nodeValue;
  }

  localStorage.setItem(key, JSON.stringify(dataArray));

  return dataArray;
}

function highlight(sel, range, color) {
  if (typeof sel == "string") {
    document.getSelection().empty();
    document.getSelection().addRange(range);
  }

  const {
    commonAncestorContainer,
    startContainer,
    endContainer,
    startOffset,
    endOffset,
  } = range;
  const nodes = [];

  // if selected text is within 1 range
  if (startContainer === endContainer) {
    const span = document.createElement("span");
    span.className = "notella-highlight";
    span.classList.add(color);
    range.surroundContents(span);
    nodes.push(startContainer);
    document.getSelection().empty();
    return;
  }

  // if selected text spans across elements
  // get all posibles selected nodes
  function getNodes(childList) {
    childList.forEach((node) => {
      const tempStr = node.nodeValue;

      let isSelected = document.getSelection().containsNode(node, true);

      if (!isSelected) return;

      // only accept text node
      if (node.nodeType === 3 && tempStr.replace(/^\s+|\s+$/gm, "") !== "") {
        nodes.push(node);
      }

      // if node contains more child nodes --> loop through all of them
      if (node.nodeType === 1) {
        if (node.childNodes) getNodes(node.childNodes);
      }
    });
  }

  getNodes(commonAncestorContainer.childNodes);

  // console.log("wanted nodes: ", nodes);

  nodes.forEach((node, index, listObj) => {
    const { nodeValue } = node;
    let text, prevText, nextText;

    if (index === 0) {
      prevText = nodeValue.substring(0, startOffset);
      text = nodeValue.substring(startOffset);
    } else if (index === listObj.length - 1) {
      text = nodeValue.substring(0, endOffset);
      nextText = nodeValue.substring(endOffset);
    } else {
      text = nodeValue;
    }

    const span = document.createElement("span");
    span.className = "notella-highlight";
    span.classList.add(color);
    span.append(document.createTextNode(text));
    const { parentNode } = node;

    parentNode.replaceChild(span, node); // replace old node with new highlight span

    if (prevText) {
      const prevDOM = document.createTextNode(prevText);
      parentNode.insertBefore(prevDOM, span);
    }

    if (nextText) {
      const nextDOM = document.createTextNode(nextText);
      parentNode.insertBefore(nextDOM, span.nextSibling);
    }
  });

  document.getSelection().empty();
}

function restoreHighlight(nodeInfo) {
  var commonAncestorContainer;

  if (nodeInfo.ancestorNodeName != "#text") {
    commonAncestorContainer = findAncestor(
      nodeInfo.ancestorNodeName,
      nodeInfo.ancestorHTML
    );
  } else {
    commonAncestorContainer = findAncestor(
      nodeInfo.grandParentNodeName,
      nodeInfo.grandParentHTML
    );
  }

  if (commonAncestorContainer == undefined) {
    console.log("cannot find ancestor node");
    return;
  }

  // FIND START NODE AND END NODE
  var childNodes = commonAncestorContainer.childNodes;
  var startContainer = findStartEndNodes(childNodes, nodeInfo.startHTML);
  var endContainer = findStartEndNodes(childNodes, nodeInfo.endHTML);

  var myRange = new Range();

  if (startContainer.childElementCount == 0) {
    myRange.setStart(startContainer.firstChild, nodeInfo.startOffset);
  } else {
    myRange.setStart(startContainer, nodeInfo.startOffset);
  }

  if (endContainer.childElementCount == 0) {
    myRange.setEnd(endContainer.firstChild, nodeInfo.endOffset);
  } else {
    myRange.setEnd(endContainer, nodeInfo.endOffset);
  }

  highlight(nodeInfo.selectionText, myRange, nodeInfo.color);
}

function isMatch(target, nodeValue, innerHTML) {
  if (nodeValue == target || innerHTML == target) return true;

  nodeValue = nodeValue == null ? "" : nodeValue;
  innerHTML = innerHTML == null ? "" : innerHTML;

  if (nodeValue.includes(target) || innerHTML.includes(target)) return true;

  return false;
}

function findAncestor(tagName, innerHTML) {
  var lists = document.getElementsByTagName(tagName);

  for (let i = 0; i < lists.length; i++) {
    if (
      lists[i].innerText == innerHTML ||
      lists[i].innerText.includes(innerHTML)
    ) {
      return lists[i];
    }
  }
}

function findStartEndNodes(childNodes, innerHTML) {
  for (let i = 0; i < childNodes.length; i++) {
    if (isMatch(innerHTML, childNodes[i].nodeValue, childNodes[i].innerHTML)) {
      if (childNodes[i].nodeType == 1) {
        return findStartEndNodes(childNodes[i].childNodes, innerHTML);
      } else {
        return childNodes[i];
      }
    }
  }
}

function getUID() {
  var UID = 0,
    currentUID = localStorage.getItem("Notella_UID");

  if (currentUID == NaN || currentUID == null) {
    currentUID = -1;
  }

  UID = parseInt(currentUID, 10) + 1;
  localStorage.setItem("Notella_UID", UID);

  return UID;
}
