("use strict");
(function () {
  // More action drop-down
  if ($(".dropdown-menu a.dropdown-toggle").length) {
    $(".dropdown-menu a.dropdown-toggle").on("click", function (e) {
      if (!$(this).next().hasClass("show")) {
        $(this).parents(".dropdown-menu").first().find(".show").removeClass("show");
      }
      var $subMenu = $(this).next(".dropdown-menu");
      $subMenu.toggleClass("show");

      $(this)
        .parents("li.nav-item.dropdown.show")
        .on("hidden.bs.dropdown", function (e) {
          $(".dropdown-submenu .show").removeClass("show");
        });

      return false;
    });
  }

  // Default Tooltip
  if ($('[data-bs-toggle="tooltip"]').length) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Scrollspy

  if ($('[data-bs-spy="scroll"]').length) {
    var dataSpyList = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));
    dataSpyList.forEach(function (dataSpyEl) {
      bootstrap.ScrollSpy.getInstance(dataSpyEl).refresh();
    });
  }

  // offcanvas
  if ($(".offcanvas").length) {
    var offcanvasElementList = [].slice.call(document.querySelectorAll(".offcanvas"));
    var offcanvasList = offcanvasElementList.map(function (offcanvasEl) {
      return new bootstrap.Offcanvas(offcanvasEl);
    });
  }
})();
