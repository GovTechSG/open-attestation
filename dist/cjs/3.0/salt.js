"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSalt = exports.encodeSalt = exports.salt = exports.secureRandomString = void 0;
var crypto_1 = require("crypto");
var js_base64_1 = require("js-base64");
var traverseAndFlatten_1 = require("./traverseAndFlatten");
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
var secureRandomString = function () { return crypto_1.randomBytes(ENTROPY_IN_BYTES).toString("hex"); };
exports.secureRandomString = secureRandomString;
var salt = function (data) {
    // Check for illegal characters e.g. '.', '[' or ']'
    illegalCharactersCheck(data);
    return traverseAndFlatten_1.traverseAndFlatten(data, { iteratee: function (_a) {
            var path = _a.path;
            return ({ value: exports.secureRandomString(), path: path });
        } });
};
exports.salt = salt;
var encodeSalt = function (salts) { return js_base64_1.Base64.encode(JSON.stringify(salts)); };
exports.encodeSalt = encodeSalt;
var decodeSalt = function (salts) {
    var decoded = JSON.parse(js_base64_1.Base64.decode(salts));
    decoded.forEach(function (salt) {
        if (salt.value.length !== ENTROPY_IN_BYTES * 2)
            throw new Error("Salt must be " + ENTROPY_IN_BYTES + " bytes");
    });
    return decoded;
};
exports.decodeSalt = decodeSalt;
