import { flatten as flatleyFlatten } from "flatley";
import { cloneDeep } from "lodash";
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
export var flatten = function (data, options) {
    var _a;
    var newOptions = options ? cloneDeep(options) : {};
    if (newOptions.coercion) {
        (_a = newOptions.coercion).push.apply(_a, filters);
    }
    else {
        newOptions.coercion = filters;
    }
    return flatleyFlatten(data, newOptions);
};
