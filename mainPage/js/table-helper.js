export function makeTable(array) {
  // article > source > highlight count > tag count > project
  var table = document.getElementById("tableBody");

  var newRow = document.createElement("TR");

  var th = document.createElement("TH");
  th.scope = "row";
  th.innerText =
    parseInt(document.querySelector("#tableDiv > table > tbody").childElementCount) + 1;

  newRow.appendChild(th);
  var key = array.title;
  var title_TD = createTD(key, "title", array.title, newRow);
  title_TD.style.fontWeight = "500";
  createTD(key, "host", array.host, newRow, array.link);
  createTD(key, "highlight", array.content.length, newRow);
  var tags = array.tags.split(",");
  tags = tags.filter((tag) => tag.length > 0);
  createTD(key, "tag", tags.length, newRow);
  createTD(key, "project", array.project, newRow);
  var action_TD = createTD(key, "action", "", newRow);
  action_TD.style.width = "8rem";

  table.appendChild(newRow);
  return newRow;
}

function createTD(key, type, text, targetDiv, link) {
  var td = document.createElement("td");

  if (type == "highlight") {
    var allText = [];
    if (text > 0) {
      var contents = JSON.parse(localStorage.getItem(key)).content;

      // add popover
      contents.forEach((content, index) => {
        allText.push("<div class='d-none'>" + content.selection + "</div>"); // allow search selected text
        allText.push(
          "<div class='popover-body'> <i class=\"bi bi-dot\"></i> " +
            trimText(content.selection) +
            "</div>"
        );
      });
    }
    makePopOver("Highlight Count: " + text, text, allText.join(""), td);
  } else if (type == "host") {
    var a = document.createElement("a");
    a.href = link;
    a.innerText = text;
    a.className = "articleLink";
    td.appendChild(a);
  } else if (type == "tag") {
    var contents = "";
    if (text > 0) contents = JSON.parse(localStorage.getItem(key)).tags;
    makePopOver("Tag Count: " + text, text, contents, td);
  } else {
    td.innerText = text;
    if (text == "0") td.innerText = "None";
  }

  targetDiv.appendChild(td);

  return td;
}

function makePopOver(title, text, content, targetDiv) {
  var btn = makeElement(text, "a", "btn btn-primary btn-sm has-popover", targetDiv);
  btn.title = title;
  btn.role = "button";
  btn.setAttribute("data-bs-container", "body");
  btn.setAttribute("tabindex", "0");
  btn.setAttribute("data-bs-trigger", "focus");
  btn.setAttribute("data-bs-toggle", "popover");
  btn.setAttribute("data-bs-title", title);
  btn.setAttribute("data-html", "true");
  if (text != "0") btn.setAttribute("data-bs-content", content);

  return btn;
}

function trimText(text) {
  var words = text.split(" ");
  var word;
  var result = [];
  var count = 0;

  if (text.length <= 50) return text;

  for (word of words) {
    if (count + word.length <= 40) {
      result.push(word);
      count += word.length;
    } else {
      result.push("...");
      result.push(words[words.length - 2]);
      result.push(words[words.length - 1]);
      return result.join(" ");
    }
  }
}

function makeElement(message, elementType, className, targetNode) {
  var ele = document.createElement(elementType);
  ele.innerHTML = message;
  ele.className = className;
  targetNode.appendChild(ele);
  return ele;
}
