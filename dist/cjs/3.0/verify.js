"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
var digest_1 = require("./digest");
var merkle_1 = require("../shared/merkle");
var salt_1 = require("./salt");
var verify = function (document) {
    if (!document.proof) {
        return false;
    }
    // Remove proof from document
    // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
    var proof = document.proof, documentWithoutProof = __rest(document, ["proof"]);
    var decodedSalts = salt_1.decodeSalt(document.proof.salts);
    // Checks to ensure there are no added/removed values, so visibleSalts.length must match decodedSalts.length
    var visibleSalts = salt_1.salt(documentWithoutProof);
    if (visibleSalts.length !== decodedSalts.length)
        return false;
    // Checks target hash
    var digest = digest_1.digestCredential(documentWithoutProof, decodedSalts, document.proof.privacy.obfuscated);
    var targetHash = document.proof.targetHash;
    if (digest !== targetHash)
        return false;
    // Calculates merkle root from target hash and proof, then compare to merkle root in document
    return merkle_1.checkProof(document.proof.proofs, document.proof.merkleRoot, document.proof.targetHash);
};
exports.verify = verify;
