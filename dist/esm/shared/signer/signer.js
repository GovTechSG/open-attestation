import { defaultSigners } from "./signatureSchemes";
export var signerBuilder = function (signers) { return function (alg, message, keyOrSigner, options) {
    var signer = signers.get(alg);
    if (!signer)
        throw new Error(alg + " is not supported as a signing algorithm");
    return signer(message, keyOrSigner, options);
}; };
export var sign = signerBuilder(defaultSigners);
export { defaultSigners };
