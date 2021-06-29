"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
var lodash_1 = require("lodash");
var digest_1 = require("./digest");
var merkle_1 = require("../shared/merkle");
var verify = function (document) {
    var _a, _b, _c, _d;
    var signature = lodash_1.get(document, "signature");
    if (!signature) {
        return false;
    }
    // Checks target hash
    var digest = digest_1.digestDocument(document);
    var targetHash = lodash_1.get(document, "signature.targetHash");
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    return merkle_1.checkProof((_b = (_a = document === null || document === void 0 ? void 0 : document.signature) === null || _a === void 0 ? void 0 : _a.proof) !== null && _b !== void 0 ? _b : [], (_c = document === null || document === void 0 ? void 0 : document.signature) === null || _c === void 0 ? void 0 : _c.merkleRoot, (_d = document === null || document === void 0 ? void 0 : document.signature) === null || _d === void 0 ? void 0 : _d.targetHash);
};
exports.verify = verify;
