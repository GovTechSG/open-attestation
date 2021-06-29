"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obfuscateVerifiableCredential = void 0;
var utils_1 = require("../shared/utils");
var lodash_1 = require("lodash");
var salt_1 = require("./salt");
var traverseAndFlatten_1 = require("./traverseAndFlatten");
var obfuscate = function (_data, fields) {
    var data = lodash_1.cloneDeep(_data); // Prevents alteration of original data
    var fieldsAsArray = [].concat(fields);
    // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
    // object obfuscation, where the object itself is not part of the salts, but each individual keys are
    var fieldsToRemove = traverseAndFlatten_1.traverseAndFlatten(lodash_1.pick(data, fieldsAsArray), {
        iteratee: function (_a) {
            var path = _a.path;
            return path;
        },
    });
    var salts = salt_1.decodeSalt(data.proof.salts);
    // Obfuscate data by hashing them with the key
    var obfuscatedData = fieldsToRemove.map(function (field) {
        var _a;
        var value = lodash_1.get(data, field);
        var salt = salts.find(function (s) { return s.path === field; });
        if (!salt) {
            throw new Error("Salt not found for " + field);
        }
        return utils_1.toBuffer((_a = {}, _a[salt.path] = salt.value + ":" + value, _a)).toString("hex");
    });
    // remove fields from the object
    fieldsAsArray.forEach(function (field) { return lodash_1.unset(data, field); });
    data.proof.salts = salt_1.encodeSalt(salts.filter(function (s) { return !fieldsToRemove.includes(s.path); }));
    return {
        data: data,
        obfuscatedData: obfuscatedData,
    };
};
var obfuscateVerifiableCredential = function (document, fields) {
    var _a = obfuscate(document, fields), data = _a.data, obfuscatedData = _a.obfuscatedData;
    var currentObfuscatedData = document.proof.privacy.obfuscated;
    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
    return __assign(__assign({}, data), { proof: __assign(__assign({}, data.proof), { privacy: __assign(__assign({}, data.proof.privacy), { obfuscated: newObfuscatedData }) }) });
};
exports.obfuscateVerifiableCredential = obfuscateVerifiableCredential;
