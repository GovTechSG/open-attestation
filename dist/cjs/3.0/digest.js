"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digestCredential = void 0;
var lodash_1 = require("lodash");
var js_sha3_1 = require("js-sha3");
var digestCredential = function (document, salts, obfuscatedData) {
    // Prepare array of hashes from visible data
    var hashedUnhashedDataArray = salts
        .filter(function (salt) { return lodash_1.get(document, salt.path); })
        .map(function (salt) {
        var _a;
        return js_sha3_1.keccak256(JSON.stringify((_a = {}, _a[salt.path] = salt.value + ":" + lodash_1.get(document, salt.path), _a)));
    });
    // Combine both array and sort them to ensure determinism
    var combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
    var sortedHashes = lodash_1.sortBy(combinedHashes);
    // Finally, return the digest of the entire set of data
    return js_sha3_1.keccak256(JSON.stringify(sortedHashes));
};
exports.digestCredential = digestCredential;
