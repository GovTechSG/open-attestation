export interface OpenAttestationDocument {
    /**
     * List of URI to determine the terminology used in the verifiable credential as explained
     * by https://www.w3.org/TR/vc-data-model/#contexts
     */
    "@context": Array<{
        [key: string]: any;
    } | string>;
    attachments?: Attachment[];
    credentialStatus?: CredentialStatus;
    credentialSubject: {
        [key: string]: any;
    }[] | {
        [key: string]: any;
    };
    /**
     * The date and time when this credential expires
     */
    expirationDate?: string;
    /**
     * URI to the subject of the credential as explained by
     * https://www.w3.org/TR/vc-data-model/#credential-subject
     */
    id?: string;
    /**
     * The date and time when this credential becomes valid (may be deprecated in favor of
     * issued/validFrom a future version of W3C's VC Data Model)
     */
    issuanceDate: string;
    /**
     * The date and time when this credential becomes valid
     */
    issued?: string;
    issuer: Issuer | string;
    /**
     * Human readable name of this credential
     */
    name?: string;
    openAttestationMetadata: OpenAttestationMetadata;
    /**
     * Internal reference, usually a serial number, of this document
     */
    reference?: string;
    /**
     * Specific verifiable credential type as explained by
     * https://www.w3.org/TR/vc-data-model/#types
     */
    type: string[] | string;
    /**
     * The date and time when this credential becomes valid
     */
    validFrom?: string;
    /**
     * The date and time when this credential expires
     */
    validUntil?: string;
}
export interface Attachment {
    /**
     * Base64 encoding of this attachment
     */
    data: string;
    /**
     * Name of this attachment, with appropriate extensions
     */
    fileName: string;
    /**
     * Media type (or MIME type) of this attachment
     */
    mimeType: string;
}
export interface CredentialStatus {
    id: string;
    /**
     * Express the credential status type (also referred to as the credential status method). It
     * is expected that the value will provide enough information to determine the current
     * status of the credential. For example, the object could contain a link to an external
     * document noting whether or not the credential is suspended or revoked.
     */
    type: string;
}
export interface Issuer {
    /**
     * URI when dereferenced, results in a document containing machine-readable information
     * about the issuer that can be used to verify the information expressed in the credential.
     * More information in https://www.w3.org/TR/vc-data-model/#issuer
     */
    id: string;
    /**
     * Issuer's name
     */
    name: string;
}
export interface OpenAttestationMetadata {
    identityProof: IdentityProof;
    proof: Proof;
    template?: Template;
}
export interface IdentityProof {
    /**
     * Identifier to be shown to end user upon verifying the identity
     */
    identifier: string;
    type: IdentityProofType;
}
export declare enum IdentityProofType {
    DNSDid = "DNS-DID",
    DNSTxt = "DNS-TXT",
    Did = "DID"
}
export interface Proof {
    /**
     * Proof Open Attestation method
     */
    method: Method;
    revocation?: Revocation;
    /**
     * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
     */
    type: ProofType;
    /**
     * Proof value of issuer(s). Smart contract address for TOKEN_REGISTRY & DOCUMENT_STORE, did
     * for DID method
     */
    value: string;
}
/**
 * Proof Open Attestation method
 */
export declare enum Method {
    Did = "DID",
    DocumentStore = "DOCUMENT_STORE",
    TokenRegistry = "TOKEN_REGISTRY"
}
export interface Revocation {
    /**
     * Smart contract address or url of certificate revocation list for Revocation Store type
     * revocation
     */
    location?: string;
    /**
     * Revocation method (if required by proof method)
     */
    type: RevocationType;
}
/**
 * Revocation method (if required by proof method)
 */
export declare enum RevocationType {
    None = "NONE",
    RevocationStore = "REVOCATION_STORE"
}
/**
 * Proof method name as explained by https://www.w3.org/TR/vc-data-model/#types
 */
export declare enum ProofType {
    OpenAttestationProofMethod = "OpenAttestationProofMethod"
}
export interface Template {
    /**
     * Template name to be use by template renderer to determine the template to use
     */
    name: string;
    /**
     * Type of renderer template
     */
    type: TemplateType;
    /**
     * URL of a decentralised renderer to render this document
     */
    url: string;
}
/**
 * Type of renderer template
 */
export declare enum TemplateType {
    EmbeddedRenderer = "EMBEDDED_RENDERER"
}
