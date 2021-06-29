declare type Version = "2.0" | "3.0";
declare type Kind = "wrapped" | "signed";
export declare type Mode = "strict" | "non-strict";
interface DiagnoseError {
    message: string;
}
/**
 * Tools to give information about the validity of a document. It will return and eventually output the errors found.
 * @param version 2.0 or 3.0
 * @param kind wrapped or signed
 * @param debug turn on to output in the console, the errors found
 * @param mode strict or non-strict. Strict will perform additional check on the data. For instance strict validation will ensure that a target hash is a 32 bytes hex string while non strict validation will just check that target hash is a string.
 * @param document the document to validate
 */
export declare const diagnose: ({ version, kind, document, debug, mode, }: {
    version: Version;
    kind: Kind;
    document: any;
    debug?: boolean | undefined;
    mode: Mode;
}) => DiagnoseError[];
export {};
