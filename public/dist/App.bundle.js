/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/javascripts/index-app.js":
/*!*****************************************!*\
  !*** ./public/javascripts/index-app.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/data */ \"./public/javascripts/modules/data.js\");\n/* harmony import */ var _modules_bling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/bling */ \"./public/javascripts/modules/bling.js\");\n\n\n\nif ((0,_modules_bling__WEBPACK_IMPORTED_MODULE_1__.$)('#live')) {\n    new _modules_data__WEBPACK_IMPORTED_MODULE_0__.default();\n}\n\n//# sourceURL=webpack://cac-project/./public/javascripts/index-app.js?");

/***/ }),

/***/ "./public/javascripts/modules/bling.js":
/*!*********************************************!*\
  !*** ./public/javascripts/modules/bling.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"$\": () => (/* binding */ $),\n/* harmony export */   \"$$\": () => (/* binding */ $$)\n/* harmony export */ });\n// based on https://gist.github.com/paulirish/12fb951a8b893a454b32\n\nconst $ = document.querySelector.bind(document);\nconst $$ = document.querySelectorAll.bind(document);\n\nNode.prototype.on = window.on = function (name, fn) {\n  this.addEventListener(name, fn);\n};\n\nNodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line\n\nNodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {\n  this.forEach(elem => {\n    elem.on(name, fn);\n  });\n};\n\n\n\n//# sourceURL=webpack://cac-project/./public/javascripts/modules/bling.js?");

/***/ }),

/***/ "./public/javascripts/modules/data.js":
/*!********************************************!*\
  !*** ./public/javascripts/modules/data.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Live)\n/* harmony export */ });\n/* harmony import */ var _bling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bling */ \"./public/javascripts/modules/bling.js\");\n\nclass Live {\n    constructor() {\n        this.openedYet = false;\n        this.live = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('#live');\n        this.injectHTML();\n        this.openConnection();\n        this.events();\n    }\n\n    // Events\n    events() {}\n\n    // Methods\n\n    connectSocket() {\n        if ((0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('#live')) {\n            if (!this.openedYet) {}\n            this.openedYet = true;\n        }\n        this.openConnection();\n    }\n\n    openConnection() {\n        this.socket = io();\n    }\n\n    injectHTML() {\n        this.live.innerHTML = `\n        <div> </div>\n      `;\n    }\n}\n\n//# sourceURL=webpack://cac-project/./public/javascripts/modules/data.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/javascripts/index-app.js");
/******/ 	
/******/ })()
;