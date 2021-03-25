"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = __importDefault(require("cli"));
var ImportTrimer_1 = require("./ImportTrimer");
var args = cli_1.default.parse({
    file: ['f', 'The file to process', 'file', '']
});
if (!args.file) {
    cli_1.default.error('-f or --file is requred.');
    cli_1.default.exit(1);
}
var trimer = new ImportTrimer_1.ImportTrimer();
trimer.trimFile(args.file);
exports.default = trimer;
