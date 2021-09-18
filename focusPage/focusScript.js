var params = new URL(document.location).searchParams;
var articleName = params.get("page");
articleName = url_decode(articleName);

var masterInfo = JSON.parse(localStorage.getItem(articleName));

// return to dashboard
document.getElementById("backBtn").onclick = () => {
  window.open("../mainPage/main.html", "_self");
};

// set page heading
document.getElementsByClassName("pageHeading")[0].innerText = articleName;

// overview bar
// -- source
document.getElementById("source").innerHTML =
  "<a href=" + masterInfo.link + ">" + masterInfo.host + "</a>";

createBlockquote();

addTagBar();

addProject();

addNote();

// --------------
// FUNCTIONS

function createBlockquote() {
  var allData = document.getElementById("allData");
  var contents = masterInfo.content;

  contents.forEach((content) => {
    var text = document.createElement("blockquote");
    text.innerHTML = content.selection.replaceAll("<", "[").replaceAll(">", "]");
    text.className = content.color;

    // dropdown
    text.appendChild(createActionMenu(text));

    allData.appendChild(text);
  });
}

function createActionMenu(targetDiv) {
  var container = makeElement("", "div", "dropdown dropstart", targetDiv);
  var a = makeElement(
    '<i class="icon-xxs" data-feather="more-vertical"></i>',
    "a",
    "text-muted text-primary-hover",
    container
  );
  a.href = "#";
  a.role = "button";
  a.id = "dropdownTask";
  a.setAttribute("data-bs-toggle", "dropdown");
  a.setAttribute("aria-haspopup", true);
  a.setAttribute("aria-expanded", false);

  var dropdown = makeElement("", "div", "dropdown-menu", container);
  dropdown.setAttribute("aria-labelledby", "dropdownTask");
  var item1 = makeElement("Delete Highlight", "a", "dropdown-item", dropdown);

  return container;
}

function addTagBar() {
  var whitelist = localStorage.getItem("whitelist").split(",");
  var activeTags = [];

  var tagBarDiv = document.getElementById("tags");
  if (masterInfo.tags == null || masterInfo.tags == "") {
    tagBarDiv.value = "";
  } else {
    tagBarDiv.value = masterInfo.tags.split(",");
    activeTags.push(masterInfo.tags.split(","));
  }

  // ----- tagify code ------
  var tagify = new Tagify(tagBarDiv, {
    delimiters: ",| ", // add new tags when a comma or a space character is entered
    whitelist: whitelist,
    transformTag: transformTag,
    placeholder: "Type to Add Tags.",
    templates: {
      dropdownItemNoMatch: function (data) {
        return `No suggestion found for: ${data.value}`;
      },
    },
  });

  // ADD FUNCTIONALITY
  tagify.on("add", function (e) {
    var newInput = e.detail.data.value;
    var activeTags = localStorage.getItem("activeTags").split(",");
    activeTags.push(newInput);
    activeTags = activeTags.filter((tag) => tag.length > 0);

    // add to the master whitelist
    if (!whitelist.includes(newInput)) {
      whitelist.push(newInput);
      localStorage.setItem("whitelist", whitelist);
    }

    if (masterInfo.tags == "") {
      masterInfo.tags = newInput;
    } else {
      var currentTags = masterInfo.tags.split(",");
      currentTags.push(newInput);
      masterInfo.tags = currentTags.join(",");
    }

    localStorage.setItem("activeTags", activeTags);
    localStorage.setItem(articleName, JSON.stringify(masterInfo));
  });

  // REMOVE FUNCTIONALITY
  tagify.on("remove", function (e) {
    var removeItem = e.detail.data.value;
    var activeTags = localStorage.getItem("activeTags").split(",");
    activeTags.splice(activeTags.indexOf(removeItem), 1);

    var currentTags = masterInfo.tags.split(",");
    currentTags.splice(currentTags.indexOf(removeItem), 1);
    masterInfo.tags = currentTags.join(",");

    localStorage.setItem("activeTags", activeTags);
    localStorage.setItem(articleName, JSON.stringify(masterInfo));
  });
}

function addProject() {
  var activeProjects = localStorage.getItem("activeProjects").split(",");
  var projectBarDiv = document.getElementById("project");

  projectBarDiv.value = masterInfo.project;

  if (activeProjects === null || (activeProjects.length == 1 && activeProjects[0] == "")) {
    placeholder = "Type to create new Project.";
  }

  var placeholder = "";
  if (masterInfo.project == "") {
    if (activeProjects === null || (activeProjects.length == 1 && activeProjects[0] == "")) {
      placeholder = "Type to create new Project.";
    } else {
      placeholder = "Pick an existing project, or type to add a new one.";
    }
  }

  // ----- tagify code ------
  var tagify = new Tagify(projectBarDiv, {
    delimiters: null,
    whitelist: activeProjects,
    editTags: false,
    maxTags: 1,
    placeholder: placeholder,
    dropdown: {
      maxItems: 20,
      classname: "tags-look",
      enabled: 0, // <- show suggestions on focus
      closeOnSelect: true,
    },
    keepInvalidTags: false,
    autoComplete: {
      enabled: true,
    },
    templates: {
      dropdownItemNoMatch: function (data) {
        return `Project "${data.value}" has not been created. `;
      },
    },
  });

  if (masterInfo.project != "") {
    tagify.setReadonly(true);
    document.querySelector("#project-overview > tags").style.border = "none";
    document.querySelector("#project-overview > tags > span").style.display = "none";
    document.querySelector("#project-overview > tags").appendChild(projectEditBtn(tagify));
  }

  tagify.on("add", function (e) {
    var input = e.detail.data.value;
    masterInfo.project = input;
    localStorage.setItem(articleName, JSON.stringify(masterInfo));

    tagify.setReadonly(true);
    document.querySelector("#project-overview > tags").style.border = "none";
    document.querySelector("#project-overview > tags > span").style.display = "none";

    var inputElememt = e.detail.tag;
    inputElememt.insertAdjacentElement("afterend", projectEditBtn(tagify));

    var activeProjects = localStorage.getItem("activeProjects").split(",");
    if (activeProjects == "") activeProjects = input;
    else activeProjects.push(input);

    localStorage.setItem("activeProjects", activeProjects);
  });

  tagify.on("remove", function (e) {
    var input = e.detail.data.value;
    masterInfo.project = "";
    localStorage.setItem(articleName, JSON.stringify(masterInfo));

    var activeProjects = localStorage.getItem("activeProjects").split(",");
    var index = activeProjects.indexOf(input);
    activeProjects.splice(index, 1);

    localStorage.setItem("activeProjects", activeProjects);
  });
}

function projectEditBtn(tagify) {
  var editBtn = document.createElement("button");
  editBtn.className = "btn btn-light btn-sm";
  editBtn.innerText = "Edit";
  editBtn.style.marginLeft = "1rem";
  editBtn.onclick = () => {
    tagify.setReadonly(false);
    document.querySelector("#project-overview > tags").style.border = "";
    document.querySelector("#project-overview > tags > span").style.display = "";
    document
      .querySelector("#project-overview > tags > span")
      .setAttribute("data-placeholder", "Delete Existing Project to Add new one.");
    editBtn.remove();
  };

  return editBtn;
}

function makeElement(message, elementType, className, targetNode) {
  var ele = document.createElement(elementType);
  ele.innerHTML = message;
  ele.className = className;
  targetNode.appendChild(ele);
  return ele;
}

function addNote() {
  var noteArea = document.getElementById("noteArea");
  noteArea.value = masterInfo.note;

  var text = noteArea.value;
  var lines = text.split(/\r|\r\n|\n/);
  noteArea.rows = lines.length + 1;

  if (noteArea.rows > 10) noteArea.rows = 10;

  var saveNoteBtn = document.getElementById("saveNote");
  var area = document.getElementById("noteArea");

  saveNoteBtn.onclick = function () {
    masterInfo.note = area.value;
    localStorage.setItem(articleName, JSON.stringify(masterInfo));
    saveNoteBtn.innerText = "Saved";
    saveNoteBtn.classList.add("btn-primary");
    saveNoteBtn.classList.add("text-white");
  };

  // Change button back to Save when user change the input

  if (area.addEventListener) {
    area.addEventListener(
      "input",
      function () {
        saveNoteBtn.innerText = "Save";
        saveNoteBtn.classList.remove("btn-primary");
        saveNoteBtn.classList.remove("text-white");
      },
      false
    );
  } else if (area.attachEvent) {
    area.attachEvent("onpropertychange", function () {
      saveNoteBtn.innerText = "Save";
      saveNoteBtn.classList.remove("btn-primary");
      saveNoteBtn.classList.remove("text-white");
    });
  }
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

function url_decode(str) {
  str = str.replaceAll("-", " ");
  str = str.replaceAll("|_|", "-");
  return str;
}
