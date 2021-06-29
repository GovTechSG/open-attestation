/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 */
export declare const deepMap: (collection: any, iteratee?: (arg: any) => any) => any;
/**
 * Detects the type of a value and returns a string with type annotation
 */
export declare function primitiveToTypedString(value: any): string;
/**
 * Returns an appropriately typed value given a string with type annotations, e.g: "number:5"
 */
export declare function typedStringToPrimitive(input: string): string | number | boolean | null | undefined;
/**
 * Returns a salted value using a randomly generated uuidv4 string for salt
 */
export declare function uuidSalt(value: string): string;
/**
 * Value salted string in the format "salt:type:value", example: "ee7f3323-1634-4dea-8c12-f0bb83aff874:number:5"
 * Returns an appropriately typed value when given a salted string with type annotation
 */
export declare function unsalt(value: string): string | number | boolean | null | undefined;
export declare const saltData: (data: any) => any;
export declare const unsaltData: (data: any) => any;
