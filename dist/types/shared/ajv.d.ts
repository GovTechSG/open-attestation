import Ajv from "ajv";
import { CurrentOptions } from "ajv/dist/core";
export declare const buildAjv: (options?: CurrentOptions & {
    transform: (schema: Record<string, any>) => Record<string, any>;
}) => Ajv;
export declare const getSchema: (key: string, ajv?: Ajv) => import("ajv/dist/types").AnyValidateFunction<unknown>;
