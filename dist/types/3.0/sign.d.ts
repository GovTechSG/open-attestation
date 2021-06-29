import { OpenAttestationDocument, SignedWrappedDocument, WrappedDocument } from "./types";
import { SigningKey, SUPPORTED_SIGNING_ALGORITHM } from "../shared/@types/sign";
import { ethers } from "ethers";
export declare const signDocument: <T extends OpenAttestationDocument>(document: SignedWrappedDocument<T> | WrappedDocument<T>, algorithm: SUPPORTED_SIGNING_ALGORITHM, keyOrSigner: SigningKey | ethers.Signer) => Promise<SignedWrappedDocument<T>>;
