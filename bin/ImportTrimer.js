"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTrimer = void 0;
var fs_1 = __importDefault(require("fs"));
var TsAnalysor_1 = require("./TsAnalysor");
var ImportTrimer = /** @class */ (function () {
    function ImportTrimer() {
        this.tsAnalysor = new TsAnalysor_1.TsAnalysor();
    }
    ImportTrimer.prototype.trimFile = function (file) {
        this.file = file;
        var fileContent = fs_1.default.readFileSync(file, 'utf-8');
        this.trim(fileContent).then(function (newContent) {
            if (newContent != fileContent) {
                fs_1.default.writeFileSync(file, newContent, 'utf-8');
            }
        });
    };
    ImportTrimer.prototype.trim = function (fileContent) {
        return this.tsAnalysor.trim(fileContent);
    };
    return ImportTrimer;
}());
exports.ImportTrimer = ImportTrimer;
