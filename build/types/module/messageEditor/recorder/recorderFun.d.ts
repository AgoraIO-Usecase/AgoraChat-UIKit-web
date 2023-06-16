declare const HZRecorder: {
    (this: any, stream: any, config: {
        sampleBits: number;
        sampleRate: number;
    }): void;
    setErrorInfoText(errorMessage: any): void;
    get(callback: (arg0: any, arg1: MediaStream) => void, config?: object): void;
};
export default HZRecorder;
