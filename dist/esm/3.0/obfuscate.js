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
import { toBuffer } from "../shared/utils";
import { cloneDeep, get, unset, pick } from "lodash";
import { decodeSalt, encodeSalt } from "./salt";
import { traverseAndFlatten } from "./traverseAndFlatten";
var obfuscate = function (_data, fields) {
    var data = cloneDeep(_data); // Prevents alteration of original data
    var fieldsAsArray = [].concat(fields);
    // fields to remove will contain the list of each expanded keys from the fields passed in parameter, it's for instance useful in case of
    // object obfuscation, where the object itself is not part of the salts, but each individual keys are
    var fieldsToRemove = traverseAndFlatten(pick(data, fieldsAsArray), {
        iteratee: function (_a) {
            var path = _a.path;
            return path;
        },
    });
    var salts = decodeSalt(data.proof.salts);
    // Obfuscate data by hashing them with the key
    var obfuscatedData = fieldsToRemove.map(function (field) {
        var _a;
        var value = get(data, field);
        var salt = salts.find(function (s) { return s.path === field; });
        if (!salt) {
            throw new Error("Salt not found for " + field);
        }
        return toBuffer((_a = {}, _a[salt.path] = salt.value + ":" + value, _a)).toString("hex");
    });
    // remove fields from the object
    fieldsAsArray.forEach(function (field) { return unset(data, field); });
    data.proof.salts = encodeSalt(salts.filter(function (s) { return !fieldsToRemove.includes(s.path); }));
    return {
        data: data,
        obfuscatedData: obfuscatedData,
    };
};
export var obfuscateVerifiableCredential = function (document, fields) {
    var _a = obfuscate(document, fields), data = _a.data, obfuscatedData = _a.obfuscatedData;
    var currentObfuscatedData = document.proof.privacy.obfuscated;
    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
    return __assign(__assign({}, data), { proof: __assign(__assign({}, data.proof), { privacy: __assign(__assign({}, data.proof.privacy), { obfuscated: newObfuscatedData }) }) });
};
