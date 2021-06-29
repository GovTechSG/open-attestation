import { randomBytes } from "crypto";
import { Base64 } from "js-base64";
import { traverseAndFlatten } from "./traverseAndFlatten";
var ENTROPY_IN_BYTES = 32;
var illegalCharactersCheck = function (data) {
    Object.entries(data).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (key.includes(".")) {
            throw new Error("Key names must not have . in them");
        }
        if (key.includes("[") || key.includes("]")) {
            throw new Error("Key names must not have '[' or ']' in them");
        }
        if (value && typeof value === "object") {
            return illegalCharactersCheck(value); // Recursively search if property contains sub-properties
        }
    });
};
// Using 32 bytes of entropy as compared to 16 bytes in uuid
// Using hex encoding as compared to base64 for constant string length
export var secureRandomString = function () { return randomBytes(ENTROPY_IN_BYTES).toString("hex"); };
export var salt = function (data) {
    // Check for illegal characters e.g. '.', '[' or ']'
    illegalCharactersCheck(data);
    return traverseAndFlatten(data, { iteratee: function (_a) {
            var path = _a.path;
            return ({ value: secureRandomString(), path: path });
        } });
};
export var encodeSalt = function (salts) { return Base64.encode(JSON.stringify(salts)); };
export var decodeSalt = function (salts) {
    var decoded = JSON.parse(Base64.decode(salts));
    decoded.forEach(function (salt) {
        if (salt.value.length !== ENTROPY_IN_BYTES * 2)
            throw new Error("Salt must be " + ENTROPY_IN_BYTES + " bytes");
    });
    return decoded;
};
