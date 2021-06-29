import debug from "debug";
interface Logger {
    trace: debug.Debugger;
    debug: debug.Debugger;
    info: debug.Debugger;
    warn: debug.Debugger;
    error: debug.Debugger;
}
export declare const getLogger: (namespace: string) => Logger;
export {};
