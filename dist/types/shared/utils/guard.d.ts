import { OpenAttestationDocument as OpenAttestationDocumentV3, WrappedDocument as WrappedDocumentV3 } from "../../3.0/types";
import { OpenAttestationDocument as OpenAttestationDocumentV2, WrappedDocument as WrappedDocumentV2 } from "../../2.0/types";
import { Mode } from "./diagnose";
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export declare const isWrappedV3Document: (document: any, { mode }?: {
    mode: Mode;
}) => document is WrappedDocumentV3<OpenAttestationDocumentV3>;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export declare const isWrappedV2Document: (document: any, { mode }?: {
    mode: Mode;
}) => document is WrappedDocumentV2<OpenAttestationDocumentV2>;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export declare const isSignedWrappedV2Document: (document: any, { mode }?: {
    mode: Mode;
}) => document is import("../../2.0/types").SignedWrappedDocument<OpenAttestationDocumentV2>;
/**
 *
 * @param document
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 */
export declare const isSignedWrappedV3Document: (document: any, { mode }?: {
    mode: Mode;
}) => document is import("../../3.0/types").SignedWrappedDocument<OpenAttestationDocumentV3>;
