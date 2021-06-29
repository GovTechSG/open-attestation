"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = void 0;
var flatley_1 = require("flatley");
var lodash_1 = require("lodash");
var hasPeriodInKey = function (key) {
    if (key.indexOf(".") >= 0) {
        throw new Error("Key names must not have . in them");
    }
    return false;
};
var filters = [{ test: hasPeriodInKey }];
/**
 * Calls external flatten library but ensures that global filters are always applied
 * @param data
 * @param options
 */
var flatten = function (data, options) {
    var _a;
    var newOptions = options ? lodash_1.cloneDeep(options) : {};
    if (newOptions.coercion) {
        (_a = newOptions.coercion).push.apply(_a, filters);
    }
    else {
        newOptions.coercion = filters;
    }
    return flatley_1.flatten(data, newOptions);
};
exports.flatten = flatten;
