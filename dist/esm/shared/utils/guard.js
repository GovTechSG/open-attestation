import { diagnose } from "./diagnose";
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export var isWrappedV3Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose({ version: "3.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
};
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export var isWrappedV2Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose({ version: "2.0", kind: "wrapped", document: document, debug: false, mode: mode }).length === 0;
};
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export var isSignedWrappedV2Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose({ version: "2.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
};
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export var isSignedWrappedV3Document = function (document, _a) {
    var _b = _a === void 0 ? { mode: "non-strict" } : _a, mode = _b.mode;
    return diagnose({ version: "3.0", kind: "signed", document: document, debug: false, mode: mode }).length === 0;
};
