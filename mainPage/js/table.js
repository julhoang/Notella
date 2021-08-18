var $table = $("#table");

function operateFormatter(value, row, index) {
  return [
    "<button type='button' class='btn btn-primary btn-sm viewBtn'>View Detail</button>",
    "<button type='button' class='btn btn-outline-danger btn-sm remove'>Delete Article</button>",
  ].join("");
}

window.addEventListener("resize", () => {
  var w = window.innerWidth;
  if (w < 800) {
    $table.bootstrapTable("refreshOptions", {
      cardView: true,
    });
  } else {
    $table.bootstrapTable("refreshOptions", {
      cardView: false,
    });
  }
});

window.operateEvents = {
  "click .viewBtn": function (e, value, row, index) {
    var newUrl = location.origin + "/focusPage/focus.html?page=" + url_encode(row.article);
    window.open(newUrl, "_self");
  },

  "click .remove": function (e, value, row, index) {
    document.getElementById("modal-title").innerHTML =
      "Are you sure you want to delete article <span class='modal-bold'>" +
      row.article +
      "</span>?";
    document.getElementById("modal-hidden-info").innerHTML =
      "<div id='delete-id'>" +
      row.id +
      "</div>" +
      "<div id='delete-title'>" +
      row.article +
      "</div>";

    var myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
      keyboard: true,
    });

    myModal.toggle(); // open modal

    document.getElementById("modal-deleteBtn").onclick = () => {
      myModal.toggle(); // close modal
      deleteArticle(document.getElementById("delete-title").innerText);
      $table.bootstrapTable("remove", {
        field: "id",
        values: [document.getElementById("delete-id").innerText],
      });
    };
  },
};

function url_encode(str) {
  str = str.replaceAll("-", "|_|");
  str = str.replaceAll(" ", "-");
  return str;
}

function deleteArticle(title) {
  var infoArray = JSON.parse(localStorage.getItem(title));

  // update overview article bar
  document.getElementById("totalArticlesCount").innerText =
    parseInt(document.getElementById("totalArticlesCount").innerText, 10) - 1;

  // update overview highlight bar
  var contents = infoArray.content;
  var currentHighlightCount = parseInt(
    document.getElementById("totalHighlightsCount").innerText,
    10
  );
  document.getElementById("totalHighlightsCount").innerText =
    currentHighlightCount - contents.length;

  // update overview tag count
  if (infoArray.tags.length > 0) {
    var tagsList = infoArray.tags.split(",");
    var activeTags = localStorage.getItem("activeTags").split(",");

    tagsList.forEach((tag) => {
      activeTags.splice(activeTags.indexOf(tag), 1);
    });
    var countDuplicateTags = {};
    activeTags.forEach(function (x) {
      if (x != "") countDuplicateTags[x] = (countDuplicateTags[x] || 0) + 1;
    });
    document.getElementById("totalTagsCount").innerText = Object.keys(countDuplicateTags).length;
    localStorage.setItem("activeTags", activeTags);
  }

  // update overview project bar
  if (infoArray.project.length > 0) {
    var activeProjects = localStorage.getItem("activeProjects").split(",");
    activeProjects.splice(activeProjects.indexOf(infoArray.project), 1);

    var countDuplicateProjects = {};
    activeProjects.forEach(function (x) {
      if (x != "") countDuplicateProjects[x] = (countDuplicateProjects[x] || 0) + 1;
    });
    document.getElementById("totalProjectsCount").innerText =
      Object.keys(countDuplicateProjects).length;

    localStorage.setItem("activeProjects", activeProjects);
  }

  localStorage.removeItem(title);
}
