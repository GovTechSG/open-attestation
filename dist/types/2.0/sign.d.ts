import { WrappedDocument } from "./types";
import { OpenAttestationDocument, SignedWrappedDocument } from "./types";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { ethers } from "ethers";
export declare const signDocument: <T extends OpenAttestationDocument>(document: SignedWrappedDocument<T> | WrappedDocument<T>, algorithm: SUPPORTED_SIGNING_ALGORITHM, keyOrSigner: ethers.Signer | SigningKey) => Promise<SignedWrappedDocument<T>>;
