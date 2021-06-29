"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWrapDocumentOptionV3 = void 0;
var document_1 = require("./document");
var isWrapDocumentOptionV3 = function (options) {
    return (options === null || options === void 0 ? void 0 : options.version) === document_1.SchemaId.v3;
};
exports.isWrapDocumentOptionV3 = isWrapDocumentOptionV3;
