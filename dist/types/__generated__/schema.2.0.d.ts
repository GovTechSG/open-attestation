export interface OpenAttestationDocument {
    $template?: TemplateObject | string;
    attachments?: Attachment[];
    /**
     * URL of the stored document
     */
    documentUrl?: string;
    /**
     * Internal reference, usually serial number, of this document
     */
    id?: string;
    issuers: Issuer[];
    recipient?: Recipient;
}
export interface TemplateObject {
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
    url?: string;
}
/**
 * Type of renderer template
 */
export declare enum TemplateType {
    EmbeddedRenderer = "EMBEDDED_RENDERER"
}
export interface Attachment {
    /**
     * Base64 encoding of attachment
     */
    data: string;
    /**
     * Name of attachment, with appropriate extensions
     */
    filename: string;
    /**
     * Type of attachment
     */
    type: string;
}
export interface Issuer {
    /**
     * Issuer's id, DID can be used
     */
    id?: string;
    identityProof?: IdentityProof;
    /**
     * Issuer's name
     */
    name: string;
    revocation?: Revocation;
    /**
     * Smart contract address of token registry
     */
    tokenRegistry?: string;
    /**
     * Smart contract address of document store
     */
    documentStore?: string;
    /**
     * Smart contract address of certificate store. Same as documentStore
     */
    certificateStore?: string;
}
export interface IdentityProof {
    /**
     * Url of the website referencing to document store
     */
    location?: string;
    type: IdentityProofType;
    /**
     * Public key associated
     */
    key?: string;
}
export declare enum IdentityProofType {
    DNSDid = "DNS-DID",
    DNSTxt = "DNS-TXT",
    Did = "DID"
}
export interface Revocation {
    /**
     * Smart contract address or url of certificate revocation list for Revocation Store type
     * revocation
     */
    location?: string;
    type?: RevocationType;
}
export declare enum RevocationType {
    None = "NONE",
    RevocationStore = "REVOCATION_STORE"
}
export interface Recipient {
    /**
     * Recipient's name
     */
    name?: string;
}
