import fs from 'fs';
import parser = require('@typescript-eslint/typescript-estree');
import { ModifiedLine, TsAnalysor } from './TsAnalysor';

export class ImportTrimer {

    private tsAnalysor: TsAnalysor;

    constructor() {
        this.tsAnalysor = new TsAnalysor();
    }

    trim(file: string) {
        let fileContent = fs.readFileSync(file, 'utf-8');
        let ast = parser.parse(fileContent, { loc: true });
        // fs.writeFileSync('ast.json', JSON.stringify(ast));
        let modifiedLines = this.tsAnalysor.collect(ast, file);
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
            fs.writeFileSync(file, lines.join('\n'), 'utf-8');
        }

    }
}