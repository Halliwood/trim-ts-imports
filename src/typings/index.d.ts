export interface TrimTsImportOption {
    errorDetail?: boolean
}

export interface SourceLoc {
    line: number;
    col: number;
}

export type TrimErrorCallback = (message: string, start?: SourceLoc, end?: SourceLoc) => void;