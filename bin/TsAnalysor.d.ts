export interface TrimTsImportOption {
    errorDetail?: boolean;
}
export interface SourceLoc {
    line: number;
    col: number;
}
export interface ModifiedLine {
    loc: {
        startLine: number;
        endLine: number;
    };
    content: string;
}
export declare type TrimErrorCallback = (message: string, start?: SourceLoc, end?: SourceLoc) => void;
export declare class TsAnalysor {
    private option;
    private ids;
    private imports;
    constructor(option?: TrimTsImportOption);
    trim(fileContent: string): Promise<string>;
    private processAST;
    private processArrayExpression;
    private processArrayPattern;
    private processArrowFunctionExpression;
    private processAssignmentExpression;
    private processAssignmentPattern;
    private processBinaryExpression;
    private processBlockStatement;
    private processCallExpression;
    private processClassBody;
    private processClassDeclaration;
    private processClassExpression;
    private processClassProperty;
    private processConditionalExpression;
    private processExportNamedDeclaration;
    private processExpressionStatement;
    private processForInStatement;
    private processForOfStatement;
    private processForStatement;
    private processFunctionDeclaration;
    private processFunctionExpression;
    private processFunctionExpressionInternal;
    private processIdentifier;
    private processIfStatement;
    private processImportDeclaration;
    private processImportDefaultSpecifier;
    private processLogicalExpression;
    private processMemberExpression;
    private processMethodDefinition;
    private processNewExpression;
    private processObjectExpression;
    private processObjectPattern;
    private processProgram;
    private processProperty;
    private processReturnStatement;
    private processSequenceExpression;
    private processSwitchCase;
    private processSwitchStatement;
    private processThrowStatement;
    private processTSAsExpression;
    private processTryStatement;
    private processTSTypeParameterInstantiation;
    private processUnaryExpression;
    private processUpdateExpression;
    private processVariableDeclaration;
    private processVariableDeclarator;
    private processWhileStatement;
    private processTSInterfaceBody;
    private processTSAbstractMethodDefinition;
    private processTSArrayType;
    private processTSModuleBlock;
    private processTSModuleDeclaration;
    private processTSImportEqualsDeclaration;
    private processTSInterfaceDeclaration;
    private processTSTypeAnnotation;
    private processTSTypeReference;
    private codeFromAST;
    private codeFromIdentifier;
    private codeFromImportDeclaration;
    private codeFromImportDefaultSpecifier;
    private codeFromImportNamespaceSpecifier;
    private codeFromImportSpecifier;
    private codeFromLiteral;
    private codeFromMemberExpression;
    private codeFromTSQualifiedName;
    private setIdUsed;
    private assert;
}
