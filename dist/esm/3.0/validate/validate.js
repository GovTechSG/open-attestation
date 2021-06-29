var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { documentLoaders, expand } from "jsonld";
import fetch from "node-fetch";
var getId = function (objectOrString) {
    if (typeof objectOrString === "string") {
        return objectOrString;
    }
    return objectOrString.id;
};
/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */
var dateFullYear = /[0-9]{4}/;
var dateMonth = /(0[1-9]|1[0-2])/;
var dateMDay = /([12]\d|0[1-9]|3[01])/;
var timeHour = /([01][0-9]|2[0-3])/;
var timeMinute = /[0-5][0-9]/;
var timeSecond = /([0-5][0-9]|60)/;
var timeSecFrac = /(\.[0-9]+)?/;
var timeNumOffset = new RegExp("[-+]".concat(timeHour.source, ":").concat(timeMinute.source));
var timeOffset = new RegExp("([zZ]|".concat(timeNumOffset.source, ")"));
var partialTime = new RegExp("".concat(timeHour.source, ":").concat(timeMinute.source, ":").concat(timeSecond.source).concat(timeSecFrac.source));
var fullDate = new RegExp("".concat(dateFullYear.source, "-").concat(dateMonth.source, "-").concat(dateMDay.source));
var fullTime = new RegExp("".concat(partialTime.source).concat(timeOffset.source));
var rfc3339 = new RegExp("".concat(fullDate.source, "[ tT]").concat(fullTime.source));
var isValidRFC3339 = function (str) {
    return rfc3339.test(str);
};
/* Based on https://tools.ietf.org/html/rfc3986 and https://github.com/ajv-validator/ajv/search?q=uri&unscoped_q=uri */
var uri = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
var rfc3986 = new RegExp(uri);
var isValidRFC3986 = function (str) {
    return rfc3986.test(str);
};
var preloadedContextList = [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
];
var contexts = new Map();
var nodeDocumentLoader = documentLoaders.xhr ? documentLoaders.xhr() : documentLoaders.node();
var preload = true;
var documentLoader = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, preloadedContextList_1, url_1, promise, promise;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (preload) {
                    preload = false;
                    for (_i = 0, preloadedContextList_1 = preloadedContextList; _i < preloadedContextList_1.length; _i++) {
                        url_1 = preloadedContextList_1[_i];
                        contexts.set(url_1, fetch(url_1, { headers: { accept: "application/json" } }).then(function (res) { return res.json(); }));
                    }
                }
                if (!contexts.get(url)) return [3 /*break*/, 2];
                promise = contexts.get(url);
                _a = {
                    contextUrl: undefined
                };
                return [4 /*yield*/, promise];
            case 1: return [2 /*return*/, (_a.document = _b.sent(),
                    _a.documentUrl = url,
                    _a)];
            case 2:
                promise = nodeDocumentLoader(url);
                contexts.set(url, promise.then(function (_a) {
                    var document = _a.document;
                    return document;
                }));
                return [2 /*return*/, promise];
        }
    });
}); };
export function validateW3C(credential) {
    return __awaiter(this, void 0, void 0, function () {
        var issuerId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // ensure first context is 'https://www.w3.org/2018/credentials/v1' as it's mandatory, see https://www.w3.org/TR/vc-data-model/#contexts
                    if (!Array.isArray(credential["@context"]) ||
                        (Array.isArray(credential["@context"]) && credential["@context"][0] !== "https://www.w3.org/2018/credentials/v1")) {
                        throw new Error("https://www.w3.org/2018/credentials/v1 needs to be first in the list of contexts");
                    }
                    issuerId = getId(credential.issuer);
                    if (!isValidRFC3986(issuerId)) {
                        throw new Error("Property 'issuer' id must be a valid RFC 3986 URI");
                    }
                    // ensure issuanceDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#issuance-date
                    if (!isValidRFC3339(credential.issuanceDate)) {
                        throw new Error("Property 'issuanceDate' must be a valid RFC 3339 date");
                    }
                    // ensure expirationDate is a valid RFC3339 date, see https://www.w3.org/TR/vc-data-model/#expiration
                    if (credential.expirationDate && !isValidRFC3339(credential.expirationDate)) {
                        throw new Error("Property 'expirationDate' must be a valid RFC 3339 date");
                    }
                    // https://www.w3.org/TR/vc-data-model/#types
                    if (!credential.type || !Array.isArray(credential.type)) {
                        throw new Error("Property 'type' must exist and be an array");
                    }
                    if (!credential.type.includes("VerifiableCredential")) {
                        throw new Error("Property 'type' must have VerifiableCredential as one of the items");
                    }
                    return [4 /*yield*/, expand(credential, {
                            expansionMap: function (info) {
                                if (info.unmappedProperty) {
                                    throw new Error("\"The property " + (info.activeProperty ? info.activeProperty + "." : "") + info.unmappedProperty + " in the input was not defined in the context\"");
                                }
                            },
                            documentLoader: documentLoader,
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
