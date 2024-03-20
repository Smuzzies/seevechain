(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./components/Analytics/index.js":
/*!***************************************!*\
  !*** ./components/Analytics/index.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Analytics; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/preact/compat/dist/compat.module.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "../node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var components_Spinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! components/Spinner */ "./components/Spinner/index.js");
/* harmony import */ var components_Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! components/Header */ "./components/Header/index.js");
/* harmony import */ var components_LineChart__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! components/LineChart */ "./components/LineChart/index.js");
/* harmony import */ var preact_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! preact/hooks */ "../node_modules/preact/hooks/dist/hooks.module.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! moment */ "../node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _index_sass__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./index.sass */ "./components/Analytics/index.sass");
/* harmony import */ var _index_sass__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_index_sass__WEBPACK_IMPORTED_MODULE_7__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








function Analytics() {
  var _useState = Object(preact_hooks__WEBPACK_IMPORTED_MODULE_5__["useState"])(null),
    _useState2 = _slicedToArray(_useState, 2),
    analytics = _useState2[0],
    setAnalytics = _useState2[1];
  function getAnalytics() {
    axios__WEBPACK_IMPORTED_MODULE_1___default.a.get('/api/visitor_analytics').then(function (_ref) {
      var data = _ref.data;
      if (data.error) console.error('error get /api/visitor_analytics', data.error);
      setAnalytics({
        uniqueVisits: data.uniqueVisits
      });
    });
  }
  Object(preact_hooks__WEBPACK_IMPORTED_MODULE_5__["useEffect"])(function () {
    getAnalytics();
    setInterval(function () {
      getAnalytics();
    }, 10000);
  }, []);
  if (!analytics) return react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    className: "Analytics"
  }, react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(components_Spinner__WEBPACK_IMPORTED_MODULE_2__["default"], null));
  var labels = [];
  var series = [];
  analytics.uniqueVisits.reverse().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  }).forEach(function (_ref2) {
    var count = _ref2.count,
      date = _ref2.date;
    labels.push(moment__WEBPACK_IMPORTED_MODULE_6___default()(date).format('YYYY-MM-DD'));
    series.push(count);
  });
  return react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    className: "Analytics"
  }, react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(components_Header__WEBPACK_IMPORTED_MODULE_3__["default"], null, "Today: ", analytics.uniqueVisits[0].count), react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    className: "Analytics-chartContainer"
  }, react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement(components_LineChart__WEBPACK_IMPORTED_MODULE_4__["default"], {
    labels: labels,
    datasets: [{
      label: 'VTHO Burn',
      data: series
    }],
    options: {
      legend: {
        display: false
      },
      maintainAspectRatio: false
    }
  })));
}

/***/ }),

/***/ "./components/Analytics/index.sass":
/*!*****************************************!*\
  !*** ./components/Analytics/index.sass ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./components/Header/index.js":
/*!************************************!*\
  !*** ./components/Header/index.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Header; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/preact/compat/dist/compat.module.js");
/* harmony import */ var _index_sass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.sass */ "./components/Header/index.sass");
/* harmony import */ var _index_sass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_index_sass__WEBPACK_IMPORTED_MODULE_1__);


function Header(_ref) {
  var children = _ref.children,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 'md' : _ref$size;
  var className = "Header Header-".concat(size);
  return react__WEBPACK_IMPORTED_MODULE_0__["default"].createElement("div", {
    className: className
  }, children);
}

/***/ }),

/***/ "./components/Header/index.sass":
/*!**************************************!*\
  !*** ./components/Header/index.sass ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

}]);
//# sourceMappingURL=3.bundle.js.map