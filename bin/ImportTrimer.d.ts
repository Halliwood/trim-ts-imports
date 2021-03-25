export declare class ImportTrimer {
    private tsAnalysor;
    private file;
    constructor();
    trimFile(file: string): void;
    trim(fileContent: string): Promise<string>;
}
