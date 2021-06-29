import { Options } from "jsonld";
interface Options<T> {
    iteratee: (data: {
        value: any;
        path: string;
    }) => T;
    path?: string;
}
export declare function traverseAndFlatten<T>(data: any[], options: Options<T>): T[];
export declare function traverseAndFlatten<T>(data: string | number | boolean | null, options: Options<T>): T;
export declare function traverseAndFlatten<T>(data: any, options: Options<T>): T[];
export {};
