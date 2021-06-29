import { OpenAttestationDocument } from "../../__generated__/schema.3.0";
import { WrappedDocument } from "../../3.0/types";
export declare function validateW3C<T extends OpenAttestationDocument>(credential: WrappedDocument<T>): Promise<void>;
