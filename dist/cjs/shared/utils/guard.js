"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSignedWrappedV3Document = exports.isSignedWrappedV2Document = exports.isWrappedV2Document = exports.isWrappedV3Document = void 0;
var diagnose_1 = require("./diagnose");
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
var isWrappedV3Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose_1.diagnose({ version: "3.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
};
exports.isWrappedV3Document = isWrappedV3Document;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
var isWrappedV2Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose_1.diagnose({ version: "2.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
};
exports.isWrappedV2Document = isWrappedV2Document;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
var isSignedWrappedV2Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose_1.diagnose({ version: "2.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
};
exports.isSignedWrappedV2Document = isSignedWrappedV2Document;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
var isSignedWrappedV3Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose_1.diagnose({ version: "3.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
};
exports.isSignedWrappedV3Document = isSignedWrappedV3Document;
