import { get, omitBy, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
import { flatten } from "../shared/serialize/flatten";
var isKeyOrValueUndefined = function (value, key) { return value === undefined || key === undefined; };
export var flattenHashArray = function (data) {
    var flattenedData = omitBy(flatten(data), isKeyOrValueUndefined);
    return Object.keys(flattenedData).map(function (k) {
        var obj = {};
        obj[k] = flattenedData[k];
        return keccak256(JSON.stringify(obj));
    });
};
export var digestDocument = function (document) {
    // Prepare array of hashes from filtered data
    var hashedDataArray = get(document, "privacy.obfuscatedData", []);
    // Prepare array of hashes from visible data
    var unhashedData = get(document, "data");
    var hashedUnhashedDataArray = flattenHashArray(unhashedData);
    // Combine both array and sort them to ensure determinism
    var combinedHashes = hashedDataArray.concat(hashedUnhashedDataArray);
    var sortedHashes = sortBy(combinedHashes);
    // Finally, return the digest of the entire set of data
    return keccak256(JSON.stringify(sortedHashes));
};
