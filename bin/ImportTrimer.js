"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTrimer = void 0;
var fs_1 = __importDefault(require("fs"));
var parser = require("@typescript-eslint/typescript-estree");
var TsAnalysor_1 = require("./TsAnalysor");
var ImportTrimer = /** @class */ (function () {
    function ImportTrimer() {
        this.tsAnalysor = new TsAnalysor_1.TsAnalysor();
    }
    ImportTrimer.prototype.trim = function (file) {
        var fileContent = fs_1.default.readFileSync(file, 'utf-8');
        var ast = parser.parse(fileContent, { loc: true });
        // fs.writeFileSync('ast.json', JSON.stringify(ast));
        var modifiedLines = this.tsAnalysor.collect(ast, file);
        if (modifiedLines.length > 0) {
            var lines = fileContent.split(/\r?\n/);
            modifiedLines.sort(function (a, b) { return b.loc.startLine - a.loc.startLine; });
            for (var _i = 0, modifiedLines_1 = modifiedLines; _i < modifiedLines_1.length; _i++) {
                var ml = modifiedLines_1[_i];
                if (ml.content) {
                    if (ml.loc.startLine == ml.loc.endLine) {
                        lines[ml.loc.startLine - 1] = ml.content;
                    }
                    else {
                        lines.splice(ml.loc.startLine - 1, ml.loc.endLine - ml.loc.startLine + 1, ml.content);
                    }
                }
                else {
                    lines.splice(ml.loc.startLine - 1, ml.loc.endLine - ml.loc.startLine + 1);
                }
            }
            fs_1.default.writeFileSync(file, lines.join('\n'), 'utf-8');
        }
    };
    return ImportTrimer;
}());
exports.ImportTrimer = ImportTrimer;
