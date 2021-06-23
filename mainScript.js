window.addEventListener('storage', () => {
    // When local storage changes, force reload page and update archive []
    location.reload();

    retrieveStorageData();
});


// Purpose: to get data from localStorage and save into archive array
var myList = document.getElementById("allData");

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
        archive = [];
        return;
    }

    for (; key = keys[i]; i++) {
        if (key == "currentUID" || key == "whitelist" || key == "sorting") continue;
        var keyArray = JSON.parse(localStorage.getItem(key));
        archive.push(keyArray);
    }

    return archive;
}


function makeCard(array) {

    var newDiv = document.createElement("div"); // card container
    newDiv.className = "card";
    newDiv.id = array.UID;

    createElement(array.title, "h3", "card_title", newDiv);

    for (let i = 0; i < array.content.length; i++) {
        createElement(array.content[i], "p", "card_content", newDiv);
    }

    createLink(array.host, array.link, newDiv);

    // create Tag Bar
    var newTagDiv = document.createElement("div");
    newTagDiv.className = "card_tagBar";
    newTagDiv.innerHTML = "Tags: ";
    newTagDiv.append(document.createElement("p"));

    newDiv.appendChild(newTagDiv);
    myList.appendChild(newDiv);
}


function createElement(item, type, className, targetNode) {
    var newTag = document.createElement(type);
    newTag.innerHTML = item + "\n";
    newTag.className = className;
    targetNode.appendChild(newTag);
}


function createLink(hostname, url, targetNode) {
    var newTag = document.createElement("a");
    var text = document.createTextNode(hostname);

    newTag.appendChild(text);
    newTag.href = url;
    newTag.className = "card_hostname";

    targetNode.appendChild(newTag);
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

    $("allData").empty();

    for (let i = 0; i < array.length; i++) {
        makeCard(array[i]);
    }
}



// ----------------------
// CALLING METHODS

retrieveStorageData();

var currentSorting = localStorage.getItem("sorting");

archive = sorting(archive, "UID", currentSorting);

displayCards(archive);