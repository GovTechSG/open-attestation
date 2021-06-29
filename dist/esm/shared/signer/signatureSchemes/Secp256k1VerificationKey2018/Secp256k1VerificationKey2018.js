import { Wallet, utils } from "ethers";
import { SigningKey } from "../../../@types/sign";
export var name = "Secp256k1VerificationKey2018";
export var sign = function (message, keyOrSigner, options) {
    if (options === void 0) { options = {}; }
    var signer;
    if (SigningKey.guard(keyOrSigner)) {
        var wallet = new Wallet(keyOrSigner.private);
        if (!keyOrSigner.public.toLowerCase().includes(wallet.address.toLowerCase())) {
            throw new Error("Private key is wrong for " + keyOrSigner.public);
        }
        signer = wallet;
    }
    else {
        signer = keyOrSigner;
    }
    return signer.signMessage(options.signAsString ? message : utils.arrayify(message));
};
