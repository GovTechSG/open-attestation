"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.digestDocument = exports.flattenHashArray = void 0;
var lodash_1 = require("lodash");
var js_sha3_1 = require("js-sha3");
var flatten_1 = require("../shared/serialize/flatten");
var isKeyOrValueUndefined = function (value, key) { return value === undefined || key === undefined; };
var flattenHashArray = function (data) {
    var flattenedData = lodash_1.omitBy(flatten_1.flatten(data), isKeyOrValueUndefined);
    return Object.keys(flattenedData).map(function (k) {
        var obj = {};
        obj[k] = flattenedData[k];
        return js_sha3_1.keccak256(JSON.stringify(obj));
    });
};
exports.flattenHashArray = flattenHashArray;
var digestDocument = function (document) {
    // Prepare array of hashes from filtered data
    var hashedDataArray = lodash_1.get(document, "privacy.obfuscatedData", []);
    // Prepare array of hashes from visible data
    var unhashedData = lodash_1.get(document, "data");
    var hashedUnhashedDataArray = exports.flattenHashArray(unhashedData);
    // Combine both array and sort them to ensure determinism
    var combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
    var sortedHashes = lodash_1.sortBy(combinedHashes);
    // Finally, return the digest of the entire set of data
    return js_sha3_1.keccak256(JSON.stringify(sortedHashes));
};
exports.digestDocument = digestDocument;
