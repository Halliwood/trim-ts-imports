export interface TrimTsImportOption {
    errorDetail?: boolean
}

export interface SourceLoc {
    line: number;
    col: number;
}

export type TrimErrorCallback = (message: string, start?: SourceLoc, end?: SourceLoc) => void;

export interface ImportTrimer {
    trimFile(file: string);
    trim(fileContent: string): Promise<string>;
}