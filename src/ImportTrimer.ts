import fs from 'fs';
import parser = require('@typescript-eslint/typescript-estree');
import { ModifiedLine, TsAnalysor } from './TsAnalysor';
import { SourceLoc, TrimErrorCallback } from './typings';
import { TrimTsImportsHints } from './Strings';

export class ImportTrimer {

    private tsAnalysor: TsAnalysor;
    private file: string | undefined;

    constructor() {
        this.tsAnalysor = new TsAnalysor();
    }

    trimFile(file: string) {
        this.file = file;
        let fileContent = fs.readFileSync(file, 'utf-8');
        let newContent = this.trim(fileContent, this.onTrimFileError);
        
        if(fileContent != newContent) {
            fs.writeFileSync(file, newContent, 'utf-8');
        }
    }

    trim(fileContent: string, onError: TrimErrorCallback) {
        let ast = parser.parse(fileContent, { loc: true });
        // fs.writeFileSync('ast.json', JSON.stringify(ast));
        let modifiedLines = this.tsAnalysor.collect(ast, onError);
        let newContent = fileContent;
        if(modifiedLines.length > 0) {
            let lines = fileContent.split(/\r?\n/);
            
            modifiedLines.sort((a: ModifiedLine, b: ModifiedLine)=>{ return b.loc.startLine - a.loc.startLine; })
            for(let ml of modifiedLines) {
                if(ml.content) {
                    if(ml.loc.startLine == ml.loc.endLine) {
                        lines[ml.loc.startLine - 1] = ml.content;
                    } else {
                        lines.splice(ml.loc.startLine - 1, ml.loc.endLine - ml.loc.startLine + 1, ml.content);
                    }
                } else {
                    lines.splice(ml.loc.startLine - 1, ml.loc.endLine - ml.loc.startLine + 1);
                }
            }
            newContent = lines.join('\n');
        }
        return newContent;
    }

    private onTrimFileError(message: string, start?: SourceLoc, end?: SourceLoc) {
        console.log('\x1B[36m%s\x1B[0m\x1B[33m%d:%d\x1B[0m - \x1B[31merror\x1B[0m: %s', this.file, start ? start.line : -1, start ? start.col : -1, message);
        console.log(TrimTsImportsHints.ContactMsg);
    }
}