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
import { cloneDeep, pick, unset } from "lodash";
import { flatten } from "../shared/serialize/flatten";
import { toBuffer } from "../shared/utils";
export var obfuscateData = function (_data, fields) {
    var data = cloneDeep(_data); // Prevents alteration of original data
    var fieldsToRemove = Array.isArray(fields) ? fields : [fields];
    // Obfuscate data by hashing them with the key
    var dataToObfuscate = flatten(pick(data, fieldsToRemove));
    var obfuscatedData = Object.keys(dataToObfuscate).map(function (k) {
        var obj = {};
        obj[k] = dataToObfuscate[k];
        return toBuffer(obj).toString("hex");
    });
    // Return remaining data
    fieldsToRemove.forEach(function (path) {
        unset(data, path);
    });
    return {
        data: data,
        obfuscatedData: obfuscatedData,
    };
};
// TODO the return type could be improve by using Exclude eventually to remove the obfuscated properties
export var obfuscateDocument = function (document, fields) {
    var _a, _b;
    var existingData = document.data;
    var _c = obfuscateData(existingData, fields), data = _c.data, obfuscatedData = _c.obfuscatedData;
    var currentObfuscatedData = (_b = (_a = document === null || document === void 0 ? void 0 : document.privacy) === null || _a === void 0 ? void 0 : _a.obfuscatedData) !== null && _b !== void 0 ? _b : [];
    var newObfuscatedData = currentObfuscatedData.concat(obfuscatedData);
    return __assign(__assign({}, document), { data: data, privacy: __assign(__assign({}, document.privacy), { obfuscatedData: newObfuscatedData }) });
};
