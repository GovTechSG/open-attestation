"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaltData = exports.saltData = exports.unsalt = exports.uuidSalt = exports.typedStringToPrimitive = exports.primitiveToTypedString = exports.deepMap = void 0;
var lodash_1 = require("lodash");
var isUUID_1 = __importDefault(require("validator/lib/isUUID"));
var uuid_1 = require("uuid");
var UUIDV4_LENGTH = 37;
var PRIMITIVE_TYPES = ["string", "number", "boolean", "undefined"];
/* eslint-disable no-use-before-define */
/**
 * Curried function that takes (iteratee)(value),
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 */
var recursivelyApply = function (iteratee) { return function (value) {
    if (lodash_1.includes(PRIMITIVE_TYPES, typeof value) || value === null) {
        return iteratee(value);
    }
    return exports.deepMap(value, iteratee); // eslint-disable-line @typescript-eslint/no-use-before-define
}; };
/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 */
var deepMap = function (collection, iteratee) {
    if (iteratee === void 0) { iteratee = lodash_1.identity; }
    if (collection instanceof Array) {
        return lodash_1.map(collection, recursivelyApply(iteratee));
    }
    if (typeof collection === "object") {
        return lodash_1.mapValues(collection, recursivelyApply(iteratee));
    }
    return collection;
};
exports.deepMap = deepMap;
/* eslint-enable no-use-before-define */
// disabling this because of mutual recursion
var startsWithUuidV4 = function (input) {
    if (input && typeof input === "string") {
        var elements = input.split(":");
        return isUUID_1.default(elements[0], 4);
    }
    return false;
};
/**
 * Detects the type of a value and returns a string with type annotation
 */
function primitiveToTypedString(value) {
    switch (typeof value) {
        case "number":
        case "string":
        case "boolean":
        case "undefined":
            return typeof value + ":" + String(value);
        default:
            if (value === null) {
                // typeof null is 'object' so we have to check for it
                return "null:null";
            }
            throw new Error("Parsing error, value is not of primitive type: " + value);
    }
}
exports.primitiveToTypedString = primitiveToTypedString;
/**
 * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
 */
function typedStringToPrimitive(input) {
    var _a = input.split(":"), type = _a[0], valueArray = _a.slice(1);
    var value = valueArray.join(":"); // just in case there are colons in the value
    switch (type) {
        case "number":
            return Number(value);
        case "string":
            return String(value);
        case "boolean":
            return value === "true";
        case "null":
            return null;
        case "undefined":
            return undefined;
        default:
            throw new Error("Parsing error, type annotation not found in string: " + input);
    }
}
exports.typedStringToPrimitive = typedStringToPrimitive;
/**
 * Returns a salted value using a randomly generated uuidv4 string for salt
 */
function uuidSalt(value) {
    var salt = uuid_1.v4();
    return salt + ":" + primitiveToTypedString(value);
}
exports.uuidSalt = uuidSalt;
/**
 * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
 * Returns an appropriately typed value when given a salted string with type annotation
 */
function unsalt(value) {
    if (startsWithUuidV4(value)) {
        var untypedValue = value.substring(UUIDV4_LENGTH).trim();
        return typedStringToPrimitive(untypedValue);
    }
    return value;
}
exports.unsalt = unsalt;
// Use uuid salting method to recursively salt data
var saltData = function (data) { return exports.deepMap(data, uuidSalt); };
exports.saltData = saltData;
var unsaltData = function (data) { return exports.deepMap(data, unsalt); };
exports.unsaltData = unsaltData;
