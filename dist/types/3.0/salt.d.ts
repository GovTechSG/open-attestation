import { Salt } from "./types";
export declare const secureRandomString: () => string;
export declare const salt: (data: any) => Salt[];
export declare const encodeSalt: (salts: Salt[]) => string;
export declare const decodeSalt: (salts: string) => Salt[];
