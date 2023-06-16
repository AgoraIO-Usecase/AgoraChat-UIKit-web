export declare function noop(): void;
export declare function rcWarning(valid: boolean, message: string): void;
type Warning = (valid: boolean, component: string, message?: string) => void;
declare let warning: Warning;
export default warning;
