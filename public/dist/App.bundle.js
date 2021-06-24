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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_bling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/bling */ \"./public/javascripts/modules/bling.js\");\n/* harmony import */ var _modules_details__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/details */ \"./public/javascripts/modules/details.js\");\n\n\n// import chat from './modules/test'\n// chat()\nif (document.querySelector(\"#chat-wrapper\")) {\n    new _modules_details__WEBPACK_IMPORTED_MODULE_1__.default();\n}\n\n//# sourceURL=webpack://cac-project/./public/javascripts/index-app.js?");

/***/ }),

/***/ "./public/javascripts/modules/bling.js":
/*!*********************************************!*\
  !*** ./public/javascripts/modules/bling.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"$\": () => (/* binding */ $),\n/* harmony export */   \"$$\": () => (/* binding */ $$)\n/* harmony export */ });\n// based on https://gist.github.com/paulirish/12fb951a8b893a454b32\n\nconst $ = document.querySelector.bind(document);\nconst $$ = document.querySelectorAll.bind(document);\n\nNode.prototype.on = window.on = function (name, fn) {\n  this.addEventListener(name, fn);\n};\n\nNodeList.prototype.__proto__ = Array.prototype; // eslint-disable-line\n\nNodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {\n  this.forEach(elem => {\n    elem.on(name, fn);\n  });\n};\n\n\n\n//# sourceURL=webpack://cac-project/./public/javascripts/modules/bling.js?");

/***/ }),

/***/ "./public/javascripts/modules/details.js":
/*!***********************************************!*\
  !*** ./public/javascripts/modules/details.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Socket)\n/* harmony export */ });\n/* harmony import */ var _bling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bling */ \"./public/javascripts/modules/bling.js\");\n\n\nclass Socket {\n    constructor() {\n        this.form = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('#businessDetailsForm');\n        this.regNumber = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('.regNumber');\n        this.businessName = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('.businessName');\n        this.dateOfReg = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('.dateOfReg');\n        this.natureOfBusiness = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('.natureOfBusiness');\n        this.state = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('.state');\n        this.details = (0,_bling__WEBPACK_IMPORTED_MODULE_0__.$)('#myTable');\n        this.events();\n        this.openConnection();\n    }\n\n    // events\n    events() {\n        this.form.on('submit', e => {\n            e.preventDefault();\n            this.sendDetailsToServer();\n        });\n    }\n\n    // Methods\n    openConnection() {\n        this.socket = io();\n        this.socket.on('welcome', data => {\n            this.userName = data.userName;\n        });\n\n        // collect details from server when a user saves data\n        this.socket.on('detailsFromServer', data => {\n            this.displayDetailsFromServer(data);\n            if (data.length) {\n                for (let x = 0; x < data.length; x++) {}\n            }\n        });\n    }\n\n    displayDetailsFromServer(data) {\n        let businesses = document.createElement('tr');\n        businesses.innerHTML = `\n            <tr>\n            <td>${data.regNumber}</td>\n            <td>${data.businessName}</td>\n            <td>${data.natureOfBusiness}</td>\n            <td>${data.state}</td>\n            <td>${data.dateOfReg}</td>\n        `;\n        this.details.appendChild(businesses);\n        // this.details.insertAdjacentHTML('beforeend', `\n        //     <div>${data.regNumber}</div>\n        //     <p>sent by ${data.userName}</p> \n        // `)\n    }\n\n    sendDetailsToServer() {\n        this.socket.emit('detailsFromBrowser', { regNumber: this.regNumber.value });\n        this.details.insertAdjacentHTML('beforeend', `\n            <div>${this.regNumber.value}</div>\n            <p>sent by ${this.userName}</p>\n        `);\n    }\n}\n\n//# sourceURL=webpack://cac-project/./public/javascripts/modules/details.js?");

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