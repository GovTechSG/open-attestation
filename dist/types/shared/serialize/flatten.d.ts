import { FlatleyOptions } from "flatley";
/**
 * Calls external flatten library but ensures that global filters are always applied
 * @param data
 * @param options
 */
export declare const flatten: (data: any, options?: FlatleyOptions | undefined) => any;
