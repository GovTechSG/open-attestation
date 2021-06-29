import { getLogger } from "../logger";
import { SchemaId } from "../@types/document";
import { getData } from "../utils";
var logger = getLogger("validate");
export var validateSchema = function (document, validator) {
    var _a;
    if (!validator) {
        throw new Error("No schema validator provided");
    }
    var valid = validator(document.version === SchemaId.v3 ? document : getData(document));
    if (!valid) {
        logger.debug("There are errors in the document: " + JSON.stringify(validator.errors));
        return (_a = validator.errors) !== null && _a !== void 0 ? _a : [];
    }
    logger.debug("Document is a valid open attestation document v" + document.version);
    return [];
};
