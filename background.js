/* -------
  File: background.js
  
  Functionalities:
    1. Add Notella to Chrome Context Menu
    2. Retrieve Selected Text and update to Local Storage (of Notella extension)
    3. Send Selected Text to contentScript.js so that files create highlights.

    4. TEST TEST TEST
---------- */

if (localStorage.getItem("currentUID") == null) {
  localStorage.setItem("sorting", "down");
  localStorage.setItem("currentUID", -1);
  localStorage.setItem("whitelist", ["none"]);
  localStorage.setItem("activeTags", []);
}

// -----------------------------
// ADD NOTELLA TO CHROME CONTEXT MENU

var contextMenus = {};
var contextOnSelection = {
  id: "addHighlight",
  title: "Add Highlight",
  contexts: ["selection"],
};

contextMenus.viewDashboard = chrome.contextMenus.create(
  { title: "Notella - View Dashboard" },
  function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  }
);

chrome.contextMenus.create(contextOnSelection);

chrome.contextMenus.onClicked.addListener(contextMenuHandler);

function contextMenuHandler(info, tab) {
  if (info.menuItemId == contextMenus.viewDashboard) {
    window.open("main.html");
  } else if (info.menuItemId == "addHighlight" && info.selectionText) {
    // METHOD CALLINGs
    updateStorage();
  }
}

// ------------ END OF CONTEXT MENU CODE ----------

// listening for contentscript
// when it is ready --> send data from Notella localStorage
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.status == "done") {
    getDataFromStorage();
  }
});

function getDataFromStorage() {
  var tabTitle = "";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    tabTitle = tabs[0].title;

    if (localStorage.getItem(tabTitle) == null) return;

    var thisWebContent = JSON.parse(localStorage.getItem(tabTitle)).content;

    for (let i = 0; i < thisWebContent.length; i++) {
      var arr = {
        UID: thisWebContent[i].UID,
        selection: thisWebContent[i].selection,
      };
      sendData(JSON.stringify(arr));
    }
  });
}

function sendData(arr) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        data: arr,
      });
    }
  );
}

// ------------------------------
// ADD SELECTED TEXT and RELATED INFO ONTO LOCAL STORAGE
function updateStorage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {
        code: `getSelectedText(document.getSelection());`,
      },
      (result) => {
        result = JSON.parse(result);

        var content = [];

        console.log("confirm index: ", result);
        content.push({
          UID: result.UID,
          selection: result.selection,
          index: result.index,
        });

        var tab = tabs[0];
        var dataArray = {};

        // find out if there is a similar article already saved
        // if NO --> create new entry
        // if YES --> append content to existing entry
        if (localStorage.getItem(tab.title) == null) {
          var url = new URL(tab.url);
          var UID = getUID();

          dataArray = {
            UID: UID,
            title: tab.title,
            host: url.hostname,
            content: content,
            link: url,
            tags: "",
            favicon: tab.favIconUrl,
            date: getDate(),
          };

          localStorage.setItem(tab.title, JSON.stringify(dataArray));
        } else {
          let currentEntry = JSON.parse(localStorage.getItem(tab.title));

          let newContentArr = [];
          newContentArr.push(
            JSON.parse(localStorage.getItem(tab.title)).content
          );

          newContentArr.push(content);

          newContentArr = newContentArr.flat(Infinity);
          currentEntry.content = newContentArr;
          localStorage.setItem(tab.title, JSON.stringify(currentEntry));
        }
      }
    );
  });
}

function getUID() {
  var UID = 0,
    currentUID = localStorage.getItem("currentUID");

  if (currentUID == NaN || currentUID == null) {
    currentUID = -1;
  }

  UID = parseInt(currentUID, 10) + 1;
  localStorage.setItem("currentUID", UID);

  return UID;
}

function getDate() {
  var today = new Date();
  let months =
    "January,February,March,April,May,June,Julu,August,September,October,November,December";
  today =
    months.split(",")[today.getMonth()] +
    " " +
    today.getDate() +
    ", " +
    today.getFullYear() +
    ".";

  return today;
}
