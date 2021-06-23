// MAIN POPUP/EXTENSION SCRIPT

window.onload = function() {
    var pasteBtn = document.getElementById("paste");
    pasteBtn.onclick = function() {
        updateStorage();
    };

    var openBtn = document.getElementById("newPage");
    openBtn.onclick = function() {
        window.open("main.html");
    };
}

function updateStorage() {
    // locate current window page using Query
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        // console.log(tabs[0].id, tabs[0].title, tabs[0].favIconUrl, tabs[0].url, tabs[0].url.hostname);

        // insert script onto that page
        chrome.tabs.executeScript(tabs[0].id, { code: `document.getSelection().toString()` }, (result) => {

            // UPDATE POPUP HTML
            var text = document.getElementById('text');
            text.innerHTML = result;

            // SAVE DATA INTO LOCALSTORAGE

            // get time stamp
            var today = new Date();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            today = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear() + ".";

            
            var tab = tabs[0];

            // create an array to store data
            var dataArray = {};

            
            // find out if there is a similar article already saved
            // if NO --> create new entry
            // if YES --> append content to existing entry
            if (localStorage.getItem(tab.title) == null) {

                var url = new URL(tab.url);
                var domain = url.hostname;
                var UID = getUID();

                dataArray["UID"] = UID;
                dataArray["title"] = tab.title;
                dataArray["host"] = url.hostname;
                dataArray["content"] = result;
                dataArray["link"] = url;
                dataArray["tags"] = "";
                dataArray["favicon"] = tab.favIconUrl;
                dataArray["date"] = today;

                localStorage.setItem(tab.title, JSON.stringify(dataArray));

            } else {

                let currentEntry = JSON.parse(localStorage.getItem(tab.title));

                let newContent = [];
                newContent.push(JSON.parse(localStorage.getItem(tab.title)).content);
                newContent.push(result);

                currentEntry.content = newContent;

                localStorage.setItem(tab.title, JSON.stringify(currentEntry));
            }

        });
    });
}

function getUID() {
    var UID = 0;

    var currentUID = localStorage.getItem("currentUID");

    if (currentUID == NaN || currentUID == null) {
        currentUID = -1;
    }

    UID = parseInt(currentUID, 10) + 1;
    localStorage.setItem("currentUID", UID);

    return UID;
}