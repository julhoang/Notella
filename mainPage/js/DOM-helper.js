/* -------
  File: DOM-helper.js
  
  Functionalities:
    1. Create and Handle Overview Bar
---------- */

export function makeOverViewBar(archive) {
  var overviewBar = document.getElementById("overViewBar");

  makeOverViewCard("Articles", 0, overviewBar);
  makeOverViewCard("Highlights", 0, overviewBar);
  makeOverViewCard("Projects", 0, overviewBar);
  makeOverViewCard("Tags", 0, overviewBar);
}

function makeOverViewCard(title, value, parentDiv) {
  var outerDiv = makeElement(
    "",
    "div",
    "col-xl-3 col-lg-6 col-md-12 col-12 mt-6 overviewCardContainer",
    parentDiv
  );
  var cardDiv = makeElement("", "div", "card rounded-3", outerDiv);
  var cardBody = makeElement("", "div", "card-body overviewCard", cardDiv);
  var cardContent = makeElement(
    "",
    "div",
    "d-flex justify-content-between align-items-center",
    cardBody
  );
  var titleContainer = makeElement("", "div", "", cardContent);

  var myTitle = title;
  switch (myTitle) {
    case "Articles":
      myTitle = "📝 " + myTitle;
      break;
    case "Highlights":
      myTitle = "✏️ " + myTitle;
      break;
    case "Projects":
      myTitle = "🗃️ " + myTitle;
      break;
    case "Tags":
      myTitle = "🏷️ " + myTitle;
      break;
  }

  var title = makeElement(myTitle, "h4", "mb-0", titleContainer);
  var iconContainer = makeElement("", "div", "icon-shape icon-md rounded-2", cardContent);

  var count = makeElement(value, "h1", "overViewCount", iconContainer);
  count.id = "total" + arguments[0] + "Count";
}

export function makeElement(message, elementType, className, targetNode) {
  var ele = document.createElement(elementType);
  ele.innerHTML = message;
  ele.className = className;
  targetNode.appendChild(ele);
  return ele;
}
