console.log("from TextTip.js");

(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = factory();
  else if (typeof define === "function" && define.amd) define([], factory);
  else if (typeof exports === "object") exports["TextTip"] = factory();
  else root["TextTip"] = factory();
})(window, function () {
  return /******/ (function (modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {};
    /******/
    /******/ // The require function
    /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      }
      /******/ // Create a new module (and put it into the cache)
      /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      });
      /******/
      /******/ // Execute the module function
      /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      );
      /******/
      /******/ // Flag the module as loaded
      /******/ module.l = true;
      /******/
      /******/ // Return the exports of the module
      /******/ return module.exports;
      /******/
    }
    /******/
    /******/
    /******/ // expose the modules object (__webpack_modules__)
    /******/ __webpack_require__.m = modules;
    /******/
    /******/ // expose the module cache
    /******/ __webpack_require__.c = installedModules;
    /******/
    /******/ // define getter function for harmony exports
    /******/ __webpack_require__.d = function (exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter,
        });
        /******/
      }
      /******/
    };
    /******/
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = function (exports) {
      /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: "Module",
        });
        /******/
      }
      /******/ Object.defineProperty(exports, "__esModule", { value: true });
      /******/
    };
    /******/
    /******/ // create a fake namespace object
    /******/ // mode & 1: value is a module id, require it
    /******/ // mode & 2: merge all properties of value into the ns
    /******/ // mode & 4: return value when already ns object
    /******/ // mode & 8|1: behave like require
    /******/ __webpack_require__.t = function (value, mode) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (
        mode & 4 &&
        typeof value === "object" &&
        value &&
        value.__esModule
      )
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, "default", {
        enumerable: true,
        value: value,
      });
      /******/ if (mode & 2 && typeof value != "string")
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function (key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    };
    /******/
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = function (module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module["default"];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, "a", getter);
      /******/ return getter;
      /******/
    };
    /******/
    /******/ // Object.prototype.hasOwnProperty.call
    /******/ __webpack_require__.o = function (object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/ // __webpack_public_path__
    /******/ __webpack_require__.p = "";
    /******/
    /******/
    /******/ // Load entry module and return exports
    /******/ return __webpack_require__(
      (__webpack_require__.s = "./src/TextTip.ts")
    );
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ "./src/TextTip.css":
        /*!*************************!*\
  !*** ./src/TextTip.css ***!
  \*************************/
        /*! no static exports found */
        /***/ function (module, exports, __webpack_require__) {
          // extracted by mini-css-extract-plugin
          /***/
        },

      /***/ "./src/TextTip.ts":
        /*!************************!*\
  !*** ./src/TextTip.ts ***!
  \************************/
        /*! exports provided: default */
        /***/ function (module, __webpack_exports__, __webpack_require__) {
          "use strict";
          __webpack_require__.r(__webpack_exports__);
          /* harmony export (binding) */ __webpack_require__.d(
            __webpack_exports__,
            "default",
            function () {
              return TextTip;
            }
          );
          /* harmony import */ var _TextTip_css__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(/*! ./TextTip.css */ "./src/TextTip.css");
          /* harmony import */ var _TextTip_css__WEBPACK_IMPORTED_MODULE_0___default =
            /*#__PURE__*/ __webpack_require__.n(
              _TextTip_css__WEBPACK_IMPORTED_MODULE_0__
            );
          function _typeof(obj) {
            if (
              typeof Symbol === "function" &&
              typeof Symbol.iterator === "symbol"
            ) {
              _typeof = function _typeof(obj) {
                return typeof obj;
              };
            } else {
              _typeof = function _typeof(obj) {
                return obj &&
                  typeof Symbol === "function" &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? "symbol"
                  : typeof obj;
              };
            }
            return _typeof(obj);
          }

          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }

          function _defineProperty(obj, key, value) {
            if (key in obj) {
              Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true,
              });
            } else {
              obj[key] = value;
            }
            return obj;
          }

          var IconFormat;

          (function (IconFormat) {
            IconFormat["URL"] = "url";
            IconFormat["SVGSprite"] = "svgsprite";
            IconFormat["Font"] = "font";
          })(IconFormat || (IconFormat = {}));

          var TextTip = function TextTip(config) {
            var _this = this;

            _classCallCheck(this, TextTip);

            _defineProperty(this, "config", {
              scope: "body",
              minLength: 1,
              maxLength: Infinity,
              iconFormat: IconFormat.URL,
              buttons: [],
              theme: "default",
              mobileOSBehaviour: "hide",
            });

            _defineProperty(this, "scopeEl", void 0);

            _defineProperty(this, "tipEl", void 0);

            _defineProperty(this, "tipWidth", void 0);

            _defineProperty(this, "id", void 0);

            _defineProperty(this, "open", false);

            _defineProperty(this, "isMobileOS", false);

            _defineProperty(this, "_setupScope", function () {
              if (typeof _this.config.scope === "string") {
                _this.scopeEl = document.querySelector(_this.config.scope);
              }

              if (!_this.scopeEl) {
                throw new Error("TextTip: Cannot find supplied scope");
              }

              _this.scopeEl.setAttribute(
                "data-texttip-scope-id",
                _this.id.toString()
              );
            });

            _defineProperty(this, "_setupTooltip", function () {
              var inner = document.createElement("div");
              inner.classList.add("texttip__inner");

              _this.config.buttons.forEach(function (btn, index) {
                if (!btn.callback || !btn.icon || !btn.title) {
                  console.error(
                    "TextTip: All buttons should have a callback, icon and title property"
                  );
                  throw new Error(
                    "TextTip: All buttons should have a callback, icon and title property"
                  );
                }

                var btnEl = document.createElement("div");
                btnEl.classList.add("texttip__btn");
                btnEl.setAttribute("role", "button");
                btnEl.setAttribute("data-texttip-btn-index", index.toString());
                btnEl.style.transitionDelay = 40 * (index + 1) + "ms";

                switch (_this.config.iconFormat) {
                  case IconFormat.URL:
                    btn.icon = chrome.runtime.getURL(btn.icon);
                    btnEl.innerHTML = '<img src="'
                      .concat(btn.icon, '" alt="')
                      .concat(btn.title, '">');
                    break;

                  case IconFormat.SVGSprite:
                    /*
                     * The base64 image overlay hack is needed to make the click events work
                     * without it the events are swallowed completely for some reason (probably shadow dom related)
                     */
                    btnEl.innerHTML =
                      '\n\t\t\t\t\t\t<svg xmlns="http://www.w3.org/2000/svg" title="'
                        .concat(
                          btn.title,
                          '" pointer-events="none">\n\t\t\t\t\t\t\t<use xlink:href="'
                        )
                        .concat(
                          btn.icon,
                          '"></use>\n\t\t\t\t\t\t</svg>\n\t\t\t\t\t\t<img class="texttip__btn-cover" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" alt="" aria-hidden="true" />\n\t\t\t\t\t\t'
                        );
                    break;

                  case IconFormat.Font:
                    btnEl.innerHTML = '<i class="'
                      .concat(btn.icon, '" title="')
                      .concat(btn.title, '"></i>');
                    break;
                }

                inner.appendChild(btnEl);
              });

              var tooltip = document.createElement("div");
              tooltip.classList.add(
                "texttip",
                "texttip--theme-" + _this.config.theme
              );
              tooltip.setAttribute(
                "data-textip-iconformat",
                _this.config.iconFormat
              );
              tooltip.setAttribute("data-texttip-id", _this.id.toString());
              tooltip.setAttribute("role", "tooltip");
              tooltip.setAttribute("aria-hidden", "true");
              tooltip.appendChild(inner);
              document.body.appendChild(tooltip);
              _this.tipEl = tooltip;
              _this.tipWidth = _this.tipEl.offsetWidth;
            });

            _defineProperty(this, "_setupEvents", function () {
              document.addEventListener(
                "selectionchange",
                _this._onSelectionChanged
              );

              _this.tipEl
                .querySelectorAll(".texttip__btn")
                .forEach(function (btn, index) {
                  btn.addEventListener("click", _this._onButtonClick);
                });
            });

            _defineProperty(this, "_onSelectionChanged", function (event) {
              if (_this._selectionValid()) {
                _this._updatePosition();

                _this._show();
              } else {
                _this._hide();
              }
            });

            _defineProperty(this, "_selectionValid", function () {
              var selection = window.getSelection();
              var selStr = selection.toString();
              var selLength = selStr.length;

              if (
                selLength < _this.config.minLength ||
                selLength > _this.config.maxLength
              ) {
                return false;
              }

              var anchorNodeParent = selection.anchorNode.parentElement;
              var focusNodeParent = selection.focusNode.parentElement;
              if (!anchorNodeParent || !focusNodeParent) return false;
              var anchorParent = anchorNodeParent.closest(
                '[data-texttip-scope-id="'.concat(_this.id, '"]')
              );
              var focusParent = focusNodeParent.closest(
                '[data-texttip-scope-id="'.concat(_this.id, '"]')
              ); // Selection must start and end within specified scope

              return !!anchorParent && !!focusParent;
            });

            _defineProperty(this, "_updatePosition", function () {
              var selection = window.getSelection(); // Allows us to measure where the selection is on the page relative to the viewport

              var range = selection.getRangeAt(0);

              var _range$getBoundingCli = range.getBoundingClientRect(),
                selTop = _range$getBoundingCli.top,
                selLeft = _range$getBoundingCli.left,
                selWidth = _range$getBoundingCli.width; // Middle of selection width

              var newTipLeft = selLeft + selWidth / 2 - window.scrollX; // Right above selection

              var newTipBottom = window.innerHeight - selTop - window.scrollY; // Stop tooltip bleeding off of left or right edge of screen
              // Use a buffer of 20px so we don't bump right against the edge
              // The tooltip transforms itself left minus 50% of it's width in css
              // so this will need to be taken into account

              var buffer = 20;
              var tipHalfWidth = _this.tipWidth / 2; // "real" means after taking the css transform into account

              var realTipLeft = newTipLeft - tipHalfWidth;
              var realTipRight = realTipLeft + _this.tipWidth;

              if (realTipLeft < buffer) {
                // Correct for left edge overlap
                newTipLeft = buffer + tipHalfWidth;
              } else if (realTipRight > window.innerWidth - buffer) {
                // Correct for right edge overlap
                newTipLeft = window.innerWidth - buffer - tipHalfWidth;
              }

              _this.tipEl.style.left = newTipLeft + "px";
              _this.tipEl.style.bottom = newTipBottom + "px";
            });

            _defineProperty(this, "_onButtonClick", function (event) {
              event.preventDefault();
              event.stopPropagation();
              var btn = event.currentTarget;
              var btnIndex = parseInt(
                btn.getAttribute("data-texttip-btn-index"),
                10
              );
              var selection = window.getSelection();

              _this.config.buttons[btnIndex].callback(selection.toString());
            });

            _defineProperty(this, "_show", function () {
              if (_this.open) {
                return;
              }

              console.log("TextTip:  show");

              _this.open = true;

              _this.tipEl.classList.add("texttip--show");

              _this.tipEl.setAttribute("aria-hidden", "true"); // Callback

              if (_this.config.on && typeof _this.config.on.show === "function")
                _this.config.on.show();
            });

            _defineProperty(this, "_hide", function () {
              if (!_this.open) return;
              _this.open = false;

              _this.tipEl.classList.remove("texttip--show");
              console.log("TextTip:  hide");

              _this.tipEl.setAttribute("aria-hidden", "false"); // Callback

              if (_this.config.on && typeof _this.config.on.hide === "function")
                _this.config.on.hide();
            });

            if (typeof window.getSelection === "undefined") {
              console.log(
                "TextTip: Selection api not supported in this browser"
              );
              throw new Error(
                "TextTip: Selection api not supported in this browser"
              );
            }

            if (_typeof(config) !== "object") {
              console.log("TextTip: No config supplied");
              throw new Error("TextTip: No config supplied");
            }

            Object.assign(this.config, config);

            if (typeof config.buttons === "undefined") {
              console.log("TextTip: No buttons supplied");
              throw new Error("TextTip: No buttons supplied");
            }

            this.isMobileOS = /iPad|iPhone|iPod|Android/i.test(
              navigator.userAgent
            );
            this.id = TextTip._getID(); // Hide on mobile OS's, they have their own conflicting tooltips

            if (this.config.mobileOSBehaviour === "hide" && this.isMobileOS)
              return;

            this._setupScope();

            this._setupTooltip();

            this._setupEvents();
          };

          _defineProperty(TextTip, "instanceCount", 0);

          _defineProperty(TextTip, "_getID", function () {
            return ++TextTip.instanceCount;
          });

          /***/
        },

      /******/
    }
  )["default"];
});
/// sourceMappingURL; =TextTip.js.map
