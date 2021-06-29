import { SchemaId } from "./document";
export var isWrapDocumentOptionV3 = function (options) {
    return (options === null || options === void 0 ? void 0 : options.version) === SchemaId.v3;
};
