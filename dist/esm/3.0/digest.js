import { get, sortBy } from "lodash";
import { keccak256 } from "js-sha3";
export var digestCredential = function (document, salts, obfuscatedData) {
    // Prepare array of hashes from visible data
    var hashedUnhashedDataArray = salts
        .filter(function (salt) { return get(document, salt.path); })
        .map(function (salt) {
        var _a;
        return keccak256(JSON.stringify((_a = {}, _a[salt.path] = salt.value + ":" + get(document, salt.path), _a)));
    });
    // Combine both array and sort them to ensure determinism
    var combinedHashes = obfuscatedData.concat(hashedUnhashedDataArray);
    var sortedHashes = sortBy(combinedHashes);
    // Finally, return the digest of the entire set of data
    return keccak256(JSON.stringify(sortedHashes));
};
