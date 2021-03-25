import fs from 'fs';
import { TsAnalysor } from './TsAnalysor';

export class ImportTrimer {

    private tsAnalysor: TsAnalysor;
    private file: string | undefined;

    constructor() {
        this.tsAnalysor = new TsAnalysor();
    }

    trimFile(file: string) {
        this.file = file;
        let fileContent = fs.readFileSync(file, 'utf-8');
        this.trim(fileContent).then((newContent: string) => {
            if(newContent != fileContent) {
                fs.writeFileSync(file, newContent, 'utf-8');
            }
        });
    }

    trim(fileContent: string) {
        return this.tsAnalysor.trim(fileContent);
    }

    // private onTrimFileError(message: string, start?: SourceLoc, end?: SourceLoc) {
    //     console.log('\x1B[36m%s\x1B[0m\x1B[33m%d:%d\x1B[0m - \x1B[31merror\x1B[0m: %s', this.file, start ? start.line : -1, start ? start.col : -1, message);
    //     console.log(TrimTsImportsHints.ContactMsg);
    // }
}