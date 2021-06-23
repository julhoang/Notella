// TAGIFY CODE

var whitelist = [],
    archive = [],
    keys = Object.keys(localStorage),
    i = 0,
    key;


function retrieveStorageData() {
    if (localStorage.getItem("currentUID") == null) {
        return;
    }

    whitelist = localStorage.getItem("whitelist").split(",");

    for (; key = keys[i]; i++) {
        if (key == "currentUID" || key == "whitelist" || key == "sorting") continue;
        var keyArray = JSON.parse(localStorage.getItem(key));
        archive.push(keyArray);
    }

    return whitelist;
}


function sorting(array, key, trend) {

    if (key == "UID") {
        if (trend == "up") {
            array.sort((a, b) => a.UID - b.UID);
            localStorage.setItem("sorting", "up");
        } else {
            array.sort((a, b) => b.UID - a.UID);
            localStorage.setItem("sorting", "down");
        }
    }

    return array;
}


function addTagsToAllCards(argument) {
    var cards = document.querySelectorAll('.card');

    for (let i = 0; i < cards.length; i++) {

        var tagBarBtn = cards[i].querySelector(".card_tagBar p");

        if (archive[i].tags == null) {
            tagBarBtn.value = "";
        } else {
            tagBarBtn.value = archive[i].tags.split(",");
        }

        var articleTitle = cards[i].getElementsByTagName("h3")[0].innerHTML;
            articleTitle = articleTitle.replace("\n", "");
        
        // ----- tagify code ------
        var tagify = new Tagify(tagBarBtn, {
            delimiters: ",| ", // add new tags when a comma or a space character is entered
            whitelist: whitelist,
            transformTag: transformTag,
            placeholder: "Type to Add Tags",
            templates: {
                dropdownItemNoMatch: function(data) {
                    return `
                    No suggestion found for: ${data.value}
                    `
                }
            }
        });

        // ADD FUNCTIONALITY
        tagify.on('add', function(e) {
       
            var newInput = e.detail.data.value;
            
            // add to the master whitelist
            if (!whitelist.includes(newInput)) {
                whitelist.push(newInput); 
                localStorage.setItem("whitelist", whitelist);
            }

            var articleTitle = cards[i].getElementsByTagName("h3")[0].innerHTML;
            articleTitle = articleTitle.replace("\n", "");

            // UPDATE TAGS DATA on LOCAL STORAGE
            var currentEntry = JSON.parse(localStorage.getItem(articleTitle));
            
            if (currentEntry.tags == "") {
                currentEntry.tags = newInput;
            } else {
                currentEntry.tags += "," + newInput;
            }

            currentEntry.tags = currentEntry.tags.replaceAll(",,", ",");

            localStorage.setItem(articleTitle, JSON.stringify(currentEntry));
        })

        // REMOVE FUNCTIONALITY
        tagify.on('remove', function(e) {
            // UPDATE TAGs DATA on LOCAL STORAGE
            var removeItem = e.detail.data.value;

            var articleTitle = cards[i].getElementsByTagName("h3")[0].innerHTML;
            articleTitle = articleTitle.replace("\n", "");

            var currentEntry = JSON.parse(localStorage.getItem(articleTitle));

            console.log(currentEntry.tags);
            currentEntry.tags = currentEntry.tags.replace(removeItem, "");
            currentEntry.tags = currentEntry.tags.replaceAll(",,", ",");

            var articleTitle = cards[i].getElementsByTagName("h3")[0].innerHTML;
            articleTitle = articleTitle.replace("\n", "");

            localStorage.setItem(articleTitle, JSON.stringify(currentEntry));
        })

    } // for loop
}


// generate a random color (in HSL format)
function getRandomColor() {
    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    var h = rand(1, 360) | 0,
        s = rand(40, 70) | 0,
        l = rand(65, 72) | 0;

    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function transformTag(tagData) {
    tagData.style = "--tag-bg:" + getRandomColor();
}


// CALLING METHODS
retrieveStorageData();

var currentSorting = localStorage.getItem("sorting");
archive = sorting(archive, "UID", currentSorting);

addTagsToAllCards();

