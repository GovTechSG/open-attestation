export function traverseAndFlatten(data, _a) {
    var iteratee = _a.iteratee, _b = _a.path, path = _b === void 0 ? "" : _b;
    if (Array.isArray(data)) {
        return data.flatMap(function (v, index) { return traverseAndFlatten(v, { iteratee: iteratee, path: path + "[" + index + "]" }); });
    }
    // Since null datas are allowed but typeof null === "object", the "&& data" is used to skip this
    if (typeof data === "object" && data) {
        return Object.keys(data).flatMap(function (key) {
            return traverseAndFlatten(data[key], { iteratee: iteratee, path: path ? path + "." + key : key });
        });
    }
    if (typeof data === "string" || typeof data === "number" || typeof data === "boolean" || data === null) {
        return iteratee({ value: data, path: path });
    }
    throw new Error("Unexpected data '" + data + "' in '" + path + "'");
}
