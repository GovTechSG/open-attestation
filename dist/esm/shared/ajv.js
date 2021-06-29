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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import Ajv from "ajv";
import addFormats from "ajv-formats";
import openAttestationSchemav2 from "../2.0/schema/schema.json";
import openAttestationSchemav3 from "../3.0/schema/schema.json";
var defaultTransform = function (schema) { return schema; };
export var buildAjv = function (options) {
    if (options === void 0) { options = {
        transform: defaultTransform,
    }; }
    var transform = options.transform, ajvOptions = __rest(options, ["transform"]);
    var ajv = new Ajv(__assign({ allErrors: true, allowUnionTypes: true }, ajvOptions));
    addFormats(ajv);
    ajv.addKeyword("deprecationMessage");
    ajv.compile(transform(openAttestationSchemav2));
    ajv.compile(transform(openAttestationSchemav3));
    return ajv;
};
var localAjv = buildAjv();
export var getSchema = function (key, ajv) {
    if (ajv === void 0) { ajv = localAjv; }
    var schema = ajv.getSchema(key);
    if (!schema)
        throw new Error("Could not find " + key + " schema");
    return schema;
};
