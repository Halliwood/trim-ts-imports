import { Accessibility, ArrayExpression, ArrayPattern, ArrowFunctionExpression, AssignmentExpression, AssignmentPattern, AwaitExpression, BigIntLiteral, BinaryExpression, BlockStatement, BreakStatement, CallExpression, CatchClause, ClassBody, ClassDeclaration, ClassExpression, ClassProperty, ConditionalExpression, ContinueStatement, DebuggerStatement, Decorator, DoWhileStatement, EmptyStatement, EntityName, ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ExportSpecifier, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement, FunctionDeclaration, FunctionExpression, Identifier, IfStatement, ImportDeclaration, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, LabeledStatement, Literal, LogicalExpression, MemberExpression, MetaProperty, MethodDefinition, NewExpression, ObjectExpression, ObjectPattern, Program, Property, RestElement, ReturnStatement, SequenceExpression, SpreadElement, Super, SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateElement, TemplateLiteral, ThisExpression, ThrowStatement, TryStatement, UnaryExpression, UpdateExpression, VariableDeclaration, VariableDeclarator, WhileStatement, WithStatement, YieldExpression, TSEnumDeclaration, BindingName, TSArrayType, TSAsExpression, TSClassImplements, TSInterfaceDeclaration, TSTypeAssertion, TSModuleDeclaration, TSModuleBlock, TSDeclareFunction, TSAbstractMethodDefinition, TSInterfaceBody, TSImportEqualsDeclaration, TSMethodSignature, TSQualifiedName, TSTypeAnnotation, TSTypeParameterInstantiation, TSTypeReference, TSVoidKeyword, BaseNode } from '@typescript-eslint/types/dist/ts-estree';
import { AST, AST_NODE_TYPES, TSESTreeOptions } from '@typescript-eslint/typescript-estree';
import util = require('util');
import path = require('path');
import { TrimTsImportsHints } from './Strings';
import { SourceLoc, TrimErrorCallback, TrimTsImportOption } from './typings';

interface IASTNode extends BaseNode {
    type: AST_NODE_TYPES;
}

export interface ModifiedLine {
    loc: {
        startLine: number;
        endLine: number;
    };
    content: string;
}

export class TsAnalysor {
    private option: TrimTsImportOption;

    private filePath: string | undefined;

    private ids: string[] | undefined;
    private imports: ImportDeclaration[] | undefined;

    private onError: TrimErrorCallback | undefined;

    constructor(option?: TrimTsImportOption) {
        this.option = option || {};
    }

    collect(ast: AST<any>, onError?: TrimErrorCallback) {
        this.onError = onError;
        this.ids = [];
        this.imports = [];
        this.processAST(ast);

        console.log(`used types: ${this.ids.join(', ')}`);

        let modifiedLines: ModifiedLine[] = [];
        for(let ipt of this.imports) {
            let notUsedCnt = 0;
            for(let i = 0, len = ipt.specifiers.length; i < len; i++) {
                let s = (ipt as any).specifierNames[i];
                if(this.ids.indexOf(s) < 0) {
                    //没有用到的id
                    console.log(`unused type: ${s}`);
                    (ipt.specifiers[i] as any).__notUsed = true;
                    notUsedCnt++;
                }
            }
            if(notUsedCnt > 0) {
                let content = '';
                if(notUsedCnt < ipt.specifiers.length) {
                    content = this.codeFromAST(ipt);
                }
                let line: ModifiedLine = { content, loc: { startLine: ipt.loc.start.line, endLine: ipt.loc.end.line } };
                modifiedLines.push(line);
            }
        }
        return modifiedLines;
    }

    private processAST(ast: any) {
        switch (ast.type) {
            case AST_NODE_TYPES.ArrayExpression:
                this.processArrayExpression(ast);
                break;

            case AST_NODE_TYPES.ArrayPattern:
                this.processArrayPattern(ast);
                break;

            case AST_NODE_TYPES.ArrowFunctionExpression:
                this.processArrowFunctionExpression(ast);
                break;

            case AST_NODE_TYPES.AssignmentExpression:
                this.processAssignmentExpression(ast);
                break;

            case AST_NODE_TYPES.AssignmentPattern:
                this.processAssignmentPattern(ast);
                break;

            case AST_NODE_TYPES.BinaryExpression:
                this.processBinaryExpression(ast);
                break;

            case AST_NODE_TYPES.BlockStatement:
                this.processBlockStatement(ast);
                break;

            case AST_NODE_TYPES.CallExpression:
                this.processCallExpression(ast);
                break;

            case AST_NODE_TYPES.ClassBody:
                this.processClassBody(ast);
                break;

            case AST_NODE_TYPES.ClassDeclaration:
                this.processClassDeclaration(ast);
                break;

            case AST_NODE_TYPES.ClassExpression:
                this.processClassExpression(ast);
                break;

            case AST_NODE_TYPES.ClassProperty:
                this.processClassProperty(ast);
                break;

            case AST_NODE_TYPES.ConditionalExpression:
                this.processConditionalExpression(ast);
                break;

            case AST_NODE_TYPES.ExportNamedDeclaration:
                this.processExportNamedDeclaration(ast);
                break;

            case AST_NODE_TYPES.ExpressionStatement:
                this.processExpressionStatement(ast);
                break;

            case AST_NODE_TYPES.ForInStatement:
                this.processForInStatement(ast);
                break;

            case AST_NODE_TYPES.ForOfStatement:
                this.processForOfStatement(ast);
                break;

            case AST_NODE_TYPES.ForStatement:
                this.processForStatement(ast);
                break;

            case AST_NODE_TYPES.FunctionDeclaration:
                this.processFunctionDeclaration(ast);
                break;

            case AST_NODE_TYPES.FunctionExpression:
                this.processFunctionExpression(ast);
                break;

            case AST_NODE_TYPES.Identifier:
                this.processIdentifier(ast);
                break;

            case AST_NODE_TYPES.IfStatement:
                this.processIfStatement(ast);
                break;

            case AST_NODE_TYPES.ImportDeclaration:
                this.processImportDeclaration(ast);
                break;

            case AST_NODE_TYPES.ImportDefaultSpecifier:
                this.processImportDefaultSpecifier(ast);
                break;

            case AST_NODE_TYPES.LogicalExpression:
                this.processLogicalExpression(ast);
                break;

            case AST_NODE_TYPES.MemberExpression:
                this.processMemberExpression(ast);
                break;

            case AST_NODE_TYPES.MethodDefinition:
                this.processMethodDefinition(ast);
                break;

            case AST_NODE_TYPES.NewExpression:
                this.processNewExpression(ast);
                break;

            case AST_NODE_TYPES.ObjectExpression:
                this.processObjectExpression(ast);
                break;

            case AST_NODE_TYPES.ObjectPattern:
                this.processObjectPattern(ast);
                break;

            case AST_NODE_TYPES.Program:
                this.processProgram(ast);
                break;

            case AST_NODE_TYPES.Property:
                this.processProperty(ast);
                break;

            case AST_NODE_TYPES.ReturnStatement:
                this.processReturnStatement(ast);
                break;

            case AST_NODE_TYPES.SequenceExpression:
                this.processSequenceExpression(ast);
                break;

            case AST_NODE_TYPES.SwitchCase:
                this.processSwitchCase(ast);
                break;

            case AST_NODE_TYPES.SwitchStatement:
                this.processSwitchStatement(ast);
                break;

            case AST_NODE_TYPES.ThrowStatement:
                this.processThrowStatement(ast);
                break;

            case AST_NODE_TYPES.TryStatement:
                this.processTryStatement(ast);
                break;
            
            case AST_NODE_TYPES.TSAsExpression:
                this.processTSAsExpression(ast);
                break;

            case AST_NODE_TYPES.TSTypeParameterInstantiation:
                this.processTSTypeParameterInstantiation(ast);
                break;

            case AST_NODE_TYPES.UnaryExpression:
                this.processUnaryExpression(ast);
                break;

            case AST_NODE_TYPES.UpdateExpression:
                this.processUpdateExpression(ast);
                break;

            case AST_NODE_TYPES.VariableDeclaration:
                this.processVariableDeclaration(ast);
                break;

            case AST_NODE_TYPES.VariableDeclarator:
                this.processVariableDeclarator(ast);
                break;

            case AST_NODE_TYPES.WhileStatement:
                this.processWhileStatement(ast);
                break;

            case AST_NODE_TYPES.TSInterfaceBody:
                this.processTSInterfaceBody(ast);
                break;

            case AST_NODE_TYPES.TSAbstractMethodDefinition:
                this.processTSAbstractMethodDefinition(ast);
                break;
            
            case AST_NODE_TYPES.TSArrayType:
                this.processTSArrayType(ast);
                break;

            case AST_NODE_TYPES.TSModuleBlock:
                this.processTSModuleBlock(ast);
                break;

            case AST_NODE_TYPES.TSModuleDeclaration:
                this.processTSModuleDeclaration(ast);
                break;
            
            case AST_NODE_TYPES.TSImportEqualsDeclaration:
                this.processTSImportEqualsDeclaration(ast);
                break;

            case AST_NODE_TYPES.TSInterfaceDeclaration:
                this.processTSInterfaceDeclaration(ast);
                break;

            case AST_NODE_TYPES.TSTypeAnnotation:
                this.processTSTypeAnnotation(ast);
                break;

            case AST_NODE_TYPES.TSTypeReference:
                this.processTSTypeReference(ast);
                break;

            default:
                break;
        }
    }

    private processArrayExpression(ast: ArrayExpression) {
        for (let i = 0, len = ast.elements.length; i < len; i++) {
            this.processAST(ast.elements[i]);
        }
    }

    private processArrayPattern(ast: ArrayPattern) {
        this.assert(false, ast, 'Not support ArrayPattern yet!');
    }

    private processArrowFunctionExpression(ast: ArrowFunctionExpression) {
        if (ast.params) {
            for (let i = 0, len = ast.params.length; i < len; i++) {
                let oneParam = ast.params[i];
                this.processAST(oneParam);
            }
        }
        if (ast.body) {
            this.processAST(ast.body);
        }
        this.assert(!ast.generator, ast, 'Not support generator yet!');
        this.assert(!ast.async, ast, 'Not support async yet!');
        this.assert(!ast.expression, ast, 'Not support expression yet!');
    }

    private processAssignmentExpression(ast: AssignmentExpression) {
        this.processBinaryExpression(ast as any);
    }

    private processAssignmentPattern(ast: AssignmentPattern) {
        if((ast as any).__isFuncParam) (ast.left as any).__isFuncParam = true;
        this.processAST(ast.left);
    }

    private processBinaryExpression(ast: BinaryExpression) {
        this.processAST(ast.left);
        this.processAST(ast.right);
    }

    private processBlockStatement(ast: BlockStatement) {
        for (let i = 0, len = ast.body.length; i < len; i++) {
            let bodyEle = ast.body[i];
            this.processAST(bodyEle);
        }
    }

    private processCallExpression(ast: CallExpression) {
        this.processAST(ast.callee);
        if(ast.callee.type == AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.callee);
        }
        for (let i = 0, len = ast.arguments.length; i < len; i++) {
            let arg = ast.arguments[i];
            if(arg.type == AST_NODE_TYPES.Identifier) {
                this.setIdUsed(arg);
            }
            this.processAST(arg);
        }
        if(ast.typeParameters) {
            this.processAST(ast.typeParameters);
        }
    }

    private processClassBody(ast: ClassBody) {
        for (let i = 0, len = ast.body.length; i < len; i++) {
            this.processAST(ast.body[i]);
        }
    }

    private processClassDeclaration(ast: ClassDeclaration) {
        if (ast.typeParameters) {
            // typeParameters?: TSTypeParameterDeclaration;
        }
        if (ast.superTypeParameters) {
            this.processAST(ast.superTypeParameters);
        }
        if (!ast.id) {
            this.assert(false, ast, 'Class name is necessary!');
        }
        this.processAST(ast.id);
        if(ast.superClass && ast.superClass.type == AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.superClass);
        }
        
        this.processClassBody(ast.body);
    }

    private processClassExpression(ast: ClassExpression) {
        this.processClassDeclaration(ast as any);
    }

    private processClassProperty(ast: ClassProperty) {
        this.codeFromAST(ast.key);
        if(ast.value) {
            this.processAST(ast.value);
        }
        if(ast.typeAnnotation) {
            this.processAST(ast.typeAnnotation);
        }
    }

    private processConditionalExpression(ast: ConditionalExpression) {
        this.processAST(ast.test);
        this.processAST(ast.consequent);
        this.processAST(ast.alternate);
    }

    private processExportNamedDeclaration(ast: ExportNamedDeclaration) {
        this.processAST(ast.declaration);
    }

    private processExpressionStatement(ast: ExpressionStatement) {
        this.processAST(ast.expression);
    }

    private processForInStatement(ast: ForInStatement) {
        this.processAST(ast.left);
        this.processAST(ast.right);
        this.processAST(ast.body);
    }

    private processForOfStatement(ast: ForOfStatement) {
        this.processAST(ast.left);
        this.processAST(ast.right);
        this.processAST(ast.body);
    }

    private processForStatement(ast: ForStatement) {
        this.processAST(ast.init);
        this.processAST(ast.test);
        this.processAST(ast.update);
        this.processAST(ast.body);
    }

    private processFunctionDeclaration(ast: FunctionDeclaration) {
        this.processFunctionExpression(ast as any);
    }

    private processFunctionExpression(ast: FunctionExpression) {
        this.processFunctionExpressionInternal(undefined, false, undefined, undefined, ast);
        if(ast.returnType) {
            this.processAST(ast.returnType);
        }
    }

    private processFunctionExpressionInternal(funcName: string | undefined, isStatic: boolean, kind: string | undefined, accessibility: Accessibility | undefined, ast: FunctionExpression) {
        if (ast.id) {
            funcName = this.codeFromAST(ast.id);
        }
        if (ast.params) {
            for (let i = 0, len = ast.params.length; i < len; i++) {
                let oneParam = ast.params[i];
                (oneParam as any).__parent = ast;
                (oneParam as any).__isFuncParam = true;
                this.processAST(oneParam);
                if(oneParam.type == AST_NODE_TYPES.Identifier && oneParam.typeAnnotation) {
                    this.processAST(oneParam.typeAnnotation);
                }
            }
        }
        if(ast.body) this.processAST(ast.body);
    }

    private processIdentifier(ast: Identifier) {
    }

    private processIfStatement(ast: IfStatement) {
        this.processAST(ast.test);
        this.processAST(ast.consequent);
        if (ast.alternate && (ast.alternate.type != AST_NODE_TYPES.BlockStatement || (ast.alternate as BlockStatement).body.length > 0)) {
            this.processAST(ast.alternate);
        }
    }

    private processImportDeclaration(ast: ImportDeclaration) {
        let sourceValue = ast.source.value as string;
        let dotPos = sourceValue.lastIndexOf('/');
        let idStr = sourceValue;
        let importModule = '';
        if(dotPos > 0) {
            idStr = sourceValue.substr(dotPos + 1);
            importModule = sourceValue.substring(0, dotPos);
        }

        let specifierNames: string[] = [];
        for(let i = 0, len = ast.specifiers.length; i < len; i++) {
            let sf = ast.specifiers[i];
            if(sf.type == AST_NODE_TYPES.ImportSpecifier || sf.type == AST_NODE_TYPES.ImportDefaultSpecifier) {
                specifierNames.push(this.codeFromAST(sf.local));
            } else {
                this.assert(false, sf, `${sf.type} not supported.`)
            }
        }
        (ast as any).specifierNames = specifierNames;
        this.imports?.push(ast);
    }

    private processImportDefaultSpecifier(ast: ImportDefaultSpecifier) {

    }

    private processLogicalExpression(ast: LogicalExpression) {
        this.processAST(ast.left);
        this.processAST(ast.right);
    }

    private processMemberExpression(ast: MemberExpression) {
        if(ast.object.type == AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.object);
        }
        this.processAST(ast.object);
        this.processAST(ast.property);
    }

    private processMethodDefinition(ast: MethodDefinition) {
        let funcName: string;
        if (ast.key) {
            funcName = this.codeFromAST(ast.key);
        }
        this.processFunctionExpressionInternal(funcName!, ast.static, ast.kind, ast.accessibility, ast.value as FunctionExpression);
    }

    private processNewExpression(ast: NewExpression) {
        this.processAST(ast.callee);
        if(ast.callee.type == AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.callee);
        }
        for (let i = 0, len = ast.arguments.length; i < len; i++) {
            this.processAST(ast.arguments[i]);
        }
    }

    private processObjectExpression(ast: ObjectExpression) {
        for (let i = 0, len = ast.properties.length; i < len; i++) {
            this.processAST(ast.properties[i]);
        }
    }

    private processObjectPattern(ast: ObjectPattern) {
        this.assert(false, ast, 'Not support ObjectPattern yet!');
    }

    private processProgram(ast: Program) {
        for (let i = 0, len = ast.body.length; i < len; i++) {
            let stm = ast.body[i];
            this.processAST(stm);
        }
    }

    private processProperty(ast: Property) {
        this.processAST(ast.key);
        this.processAST(ast.value);
    }

    private processReturnStatement(ast: ReturnStatement) {
        if(ast.argument) {
            this.processAST(ast.argument);
        }
    }

    private processSequenceExpression(ast: SequenceExpression) {
        for (var i = 0, len = ast.expressions.length; i < len; i++) {
            this.processAST(ast.expressions[i]);
        }
    }

    private processSwitchCase(ast: SwitchCase) {
        if (ast.test) {
            this.processAST(ast.test);
        }
        for (let i = 0, len = ast.consequent.length; i < len; i++) {
            if (ast.consequent[i].type != AST_NODE_TYPES.BreakStatement) {
                this.processAST(ast.consequent[i]);
            }
        }
    }

    private processSwitchStatement(ast: SwitchStatement) {
        this.processAST(ast.discriminant) ;
        for (let i = 0, len = ast.cases.length; i < len; i++) {
            this.processSwitchCase(ast.cases[i]);
        }
    }

    private processThrowStatement(ast: ThrowStatement) {
        this.processAST(ast.argument);
    }

    private processTSAsExpression(ast: TSAsExpression) {
        this.processAST(ast.expression);
        this.processAST(ast.typeAnnotation);
    }

    private processTryStatement(ast: TryStatement) {
        this.processAST(ast.block);
        if (ast.handler) {
            this.processAST(ast.handler);
        }
        if (ast.finalizer) {
            this.processAST(ast.finalizer);
        }
    }

    private processTSTypeParameterInstantiation(ast: TSTypeParameterInstantiation) {
        for(let i = 0, len = ast.params.length; i < len; i++) {
            this.processAST(ast.params[i]);
        }
    }

    private processUnaryExpression(ast: UnaryExpression) {
        this.processAST(ast.argument);
    }

    private processUpdateExpression(ast: UpdateExpression) {
        this.processAST(ast.argument);
    }

    private processVariableDeclaration(ast: VariableDeclaration) {
        for (let i = 0, len = ast.declarations.length; i < len; i++) {
            let d = ast.declarations[i];
            this.processVariableDeclarator(d);
        }
    }

    private processVariableDeclarator(ast: VariableDeclarator) {
        this.processAST(ast.id);
        if(ast.id.type == AST_NODE_TYPES.Identifier && ast.id.typeAnnotation) {
            this.processAST(ast.id.typeAnnotation);
        }
        if (ast.init) {
            this.processAST(ast.init);
        }
    }

    private processWhileStatement(ast: WhileStatement) {
        this.processAST(ast.test);
        this.processAST(ast.body);
    }

    private processTSInterfaceBody(ast: TSInterfaceBody) {
        for(let i = 0, len = ast.body.length; i < len; i++) {
            this.codeFromAST(ast.body[i]);
        }
    }

    private processTSAbstractMethodDefinition(ast: TSAbstractMethodDefinition) {
        this.processMethodDefinition(ast as any);
    }

    private processTSArrayType(ast: TSArrayType) {
        this.processAST(ast.elementType);
    }

    private processTSModuleBlock(ast: TSModuleBlock) {
        for(let i = 0, len = ast.body.length; i < len; i++) {
            this.processAST(ast.body[i]);
        }
    }

    private processTSModuleDeclaration(ast: TSModuleDeclaration) {
        let mid = this.codeFromAST(ast.id);
        this.processAST(ast.body);
    }

    private processTSImportEqualsDeclaration(ast: TSImportEqualsDeclaration) {
        let idStr = this.codeFromAST(ast.id);
        let refRstr = this.codeFromAST((ast.moduleReference as TSQualifiedName).right); 
        if(idStr == refRstr) {
            this.codeFromAST((ast.moduleReference as TSQualifiedName).left);
        }
    }

    private processTSInterfaceDeclaration(ast: TSInterfaceDeclaration) {
        let className = this.codeFromAST(ast.id);
    }

    private processTSTypeAnnotation(ast: TSTypeAnnotation) {
        this.processAST(ast.typeAnnotation);
    }

    private processTSTypeReference(ast: TSTypeReference) {
        if(ast.typeName.type == AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.typeName);
        }
    }

    private codeFromAST(ast: any): string {
        let str = '';
        switch(ast.type) {
            case AST_NODE_TYPES.Identifier:
                str += this.codeFromIdentifier(ast);
                break;

            case AST_NODE_TYPES.ImportDeclaration:
                str += this.codeFromImportDeclaration(ast);
                break;

            case AST_NODE_TYPES.ImportDefaultSpecifier:
                str += this.codeFromImportDefaultSpecifier(ast);
                break;

            case AST_NODE_TYPES.ImportNamespaceSpecifier:
                str += this.codeFromImportNamespaceSpecifier(ast);
                break;
            
            case AST_NODE_TYPES.ImportSpecifier:
                str += this.codeFromImportSpecifier(ast);
                break;

            case AST_NODE_TYPES.Literal:
                str += this.codeFromLiteral(ast);
                break;

            case AST_NODE_TYPES.MemberExpression:
                str += this.codeFromMemberExpression(ast);
                break;

            case AST_NODE_TYPES.TSQualifiedName:
                str += this.codeFromTSQualifiedName(ast);
                break;
            
            default:
                this.assert(false, ast, '[ERROR]Analyse ast error, not support: ' + (ast as any).type);
                break;
        }
        return str;
    }
    
    private codeFromIdentifier(ast: Identifier): string {
        return ast.name;
    }

    private codeFromImportDeclaration(ast: ImportDeclaration): string {
        let str = 'import ';

        let ssArr: string[] = [];
        let defaultssArr: string[] = [];
        for(let i = 0, len = ast.specifiers.length; i < len; i++) {
            let sf = ast.specifiers[i];
            if((sf as any).__notUsed) continue;
            let ss = this.codeFromAST(sf.local);
            if(sf.type == AST_NODE_TYPES.ImportSpecifier && sf.local.name != sf.imported.name) {
                ss = this.codeFromAST(sf.imported) + ' as ' + ss;
            }
            if(sf.type != AST_NODE_TYPES.ImportDefaultSpecifier) {
                ssArr.push(ss);
            } else {
                defaultssArr.push(ss);
            }
        }
        let specifierStr = '';
        if(defaultssArr.length) {
            specifierStr += defaultssArr.join(', ');
        }
        if(specifierStr) {
            specifierStr += ', ';
        }
        if(ssArr.length) {
            specifierStr += '{ ' + ssArr.join(', ') + ' }';
        }
        str += specifierStr + ' from ' + ast.source.raw + ';';
        
        return str;
    }

    private codeFromImportDefaultSpecifier(ast: ImportDefaultSpecifier): string {
        this.assert(false, ast, 'Not support ImportDefaultSpecifier yet!');
        return '';
    }

    private codeFromImportNamespaceSpecifier(ast: ImportNamespaceSpecifier): string {
        this.assert(false, ast, 'Not support ImportNamespaceSpecifier yet!');
        return '';
    }

    private codeFromImportSpecifier(ast: ImportSpecifier): string {
        let str = this.codeFromAST(ast.imported);
        return str;
    }

    private codeFromLiteral(ast: Literal): string {
        let str = ast.raw;
        return str;
    }

    private codeFromMemberExpression(ast: MemberExpression): string {
        let objStr = this.codeFromAST(ast.object);
        let str = objStr;
        let propertyStr = this.codeFromAST(ast.property);
        if (ast.computed) {
            str += '[' + propertyStr + ']';
        } else {
            str += '.' + propertyStr;
        }
        return str;
    }

    private codeFromTSQualifiedName(ast: TSQualifiedName) {
        this.assert(false, ast)
    }

    private setIdUsed(id: Identifier) {
        let idStr = this.codeFromAST(id);
        if(!this.ids!.includes(idStr)) {
            this.ids!.push(idStr);
        }
    }
  
    private assert(cond: boolean, ast: BaseNode, message?: string) {
        if (!cond) {
            if (this.option.errorDetail) {
                console.log(util.inspect(ast, true, 6));
            }
            if(this.onError) {
                this.onError(message || `Error: ${(<IASTNode>ast).type} not suppoprted`, 
                ast.loc ? { line: ast.loc.start.line, col: ast.loc.start.column } : undefined, 
                ast.loc ? { line: ast.loc.end.line, col: ast.loc.end.column } : undefined);
            }
            console.log('\x1B[36m%s\x1B[0m\x1B[33m%d:%d\x1B[0m - \x1B[31merror\x1B[0m: %s', this.filePath, ast.loc ? ast.loc.start.line : -1, ast.loc ? ast.loc.start.column : -1, message ? message : `Error: ${(<IASTNode>ast).type} not suppoprted`);
            console.log(TrimTsImportsHints.ContactMsg);
        }
    }
}