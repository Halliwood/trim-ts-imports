"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsAnalysor = void 0;
var typescript_estree_1 = require("@typescript-eslint/typescript-estree");
var util = require("util");
var Strings_1 = require("./Strings");
var TsAnalysor = /** @class */ (function () {
    function TsAnalysor(option) {
        this.option = option || {};
    }
    TsAnalysor.prototype.collect = function (ast, filePath) {
        this.filePath = filePath;
        this.ids = [];
        this.imports = [];
        this.processAST(ast);
        console.log("used types: " + this.ids.join(', '));
        var modifiedLines = [];
        for (var _i = 0, _a = this.imports; _i < _a.length; _i++) {
            var ipt = _a[_i];
            var notUsedCnt = 0;
            for (var i = 0, len = ipt.specifiers.length; i < len; i++) {
                var s = ipt.specifierNames[i];
                if (this.ids.indexOf(s) < 0) {
                    //没有用到的id
                    console.log("unused type: " + s);
                    ipt.specifiers[i].__notUsed = true;
                    notUsedCnt++;
                }
            }
            if (notUsedCnt > 0) {
                var content = '';
                if (notUsedCnt < ipt.specifiers.length) {
                    content = this.codeFromAST(ipt);
                }
                var line = { content: content, loc: { startLine: ipt.loc.start.line, endLine: ipt.loc.end.line } };
                modifiedLines.push(line);
            }
        }
        return modifiedLines;
    };
    TsAnalysor.prototype.processAST = function (ast) {
        switch (ast.type) {
            case typescript_estree_1.AST_NODE_TYPES.ArrayExpression:
                this.processArrayExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ArrayPattern:
                this.processArrayPattern(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ArrowFunctionExpression:
                this.processArrowFunctionExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.AssignmentExpression:
                this.processAssignmentExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.AssignmentPattern:
                this.processAssignmentPattern(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.BinaryExpression:
                this.processBinaryExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.BlockStatement:
                this.processBlockStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.CallExpression:
                this.processCallExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ClassBody:
                this.processClassBody(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ClassDeclaration:
                this.processClassDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ClassExpression:
                this.processClassExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ClassProperty:
                this.processClassProperty(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ConditionalExpression:
                this.processConditionalExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ExportNamedDeclaration:
                this.processExportNamedDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ExpressionStatement:
                this.processExpressionStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ForInStatement:
                this.processForInStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ForOfStatement:
                this.processForOfStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ForStatement:
                this.processForStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.FunctionDeclaration:
                this.processFunctionDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.FunctionExpression:
                this.processFunctionExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.Identifier:
                this.processIdentifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.IfStatement:
                this.processIfStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportDeclaration:
                this.processImportDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportDefaultSpecifier:
                this.processImportDefaultSpecifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.LogicalExpression:
                this.processLogicalExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.MemberExpression:
                this.processMemberExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.MethodDefinition:
                this.processMethodDefinition(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.NewExpression:
                this.processNewExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ObjectExpression:
                this.processObjectExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ObjectPattern:
                this.processObjectPattern(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.Program:
                this.processProgram(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.Property:
                this.processProperty(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ReturnStatement:
                this.processReturnStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.SequenceExpression:
                this.processSequenceExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.SwitchCase:
                this.processSwitchCase(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.SwitchStatement:
                this.processSwitchStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ThrowStatement:
                this.processThrowStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TryStatement:
                this.processTryStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSAsExpression:
                this.processTSAsExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSTypeParameterInstantiation:
                this.processTSTypeParameterInstantiation(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.UnaryExpression:
                this.processUnaryExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.UpdateExpression:
                this.processUpdateExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.VariableDeclaration:
                this.processVariableDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.VariableDeclarator:
                this.processVariableDeclarator(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.WhileStatement:
                this.processWhileStatement(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSInterfaceBody:
                this.processTSInterfaceBody(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSAbstractMethodDefinition:
                this.processTSAbstractMethodDefinition(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSArrayType:
                this.processTSArrayType(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSModuleBlock:
                this.processTSModuleBlock(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSModuleDeclaration:
                this.processTSModuleDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSImportEqualsDeclaration:
                this.processTSImportEqualsDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSInterfaceDeclaration:
                this.processTSInterfaceDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSTypeAnnotation:
                this.processTSTypeAnnotation(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSTypeReference:
                this.processTSTypeReference(ast);
                break;
            default:
                break;
        }
    };
    TsAnalysor.prototype.processArrayExpression = function (ast) {
        for (var i = 0, len = ast.elements.length; i < len; i++) {
            this.processAST(ast.elements[i]);
        }
    };
    TsAnalysor.prototype.processArrayPattern = function (ast) {
        this.assert(false, ast, 'Not support ArrayPattern yet!');
    };
    TsAnalysor.prototype.processArrowFunctionExpression = function (ast) {
        if (ast.params) {
            for (var i = 0, len = ast.params.length; i < len; i++) {
                var oneParam = ast.params[i];
                this.processAST(oneParam);
            }
        }
        if (ast.body) {
            this.processAST(ast.body);
        }
        this.assert(!ast.generator, ast, 'Not support generator yet!');
        this.assert(!ast.async, ast, 'Not support async yet!');
        this.assert(!ast.expression, ast, 'Not support expression yet!');
    };
    TsAnalysor.prototype.processAssignmentExpression = function (ast) {
        this.processBinaryExpression(ast);
    };
    TsAnalysor.prototype.processAssignmentPattern = function (ast) {
        if (ast.__isFuncParam)
            ast.left.__isFuncParam = true;
        this.processAST(ast.left);
    };
    TsAnalysor.prototype.processBinaryExpression = function (ast) {
        this.processAST(ast.left);
        this.processAST(ast.right);
    };
    TsAnalysor.prototype.processBlockStatement = function (ast) {
        for (var i = 0, len = ast.body.length; i < len; i++) {
            var bodyEle = ast.body[i];
            this.processAST(bodyEle);
        }
    };
    TsAnalysor.prototype.processCallExpression = function (ast) {
        this.processAST(ast.callee);
        if (ast.callee.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.callee);
        }
        for (var i = 0, len = ast.arguments.length; i < len; i++) {
            var arg = ast.arguments[i];
            if (arg.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
                this.setIdUsed(arg);
            }
            this.processAST(arg);
        }
        if (ast.typeParameters) {
            this.processAST(ast.typeParameters);
        }
    };
    TsAnalysor.prototype.processClassBody = function (ast) {
        for (var i = 0, len = ast.body.length; i < len; i++) {
            this.processAST(ast.body[i]);
        }
    };
    TsAnalysor.prototype.processClassDeclaration = function (ast) {
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
        if (ast.superClass && ast.superClass.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.superClass);
        }
        this.processClassBody(ast.body);
    };
    TsAnalysor.prototype.processClassExpression = function (ast) {
        this.processClassDeclaration(ast);
    };
    TsAnalysor.prototype.processClassProperty = function (ast) {
        this.codeFromAST(ast.key);
        if (ast.value) {
            this.processAST(ast.value);
        }
        if (ast.typeAnnotation) {
            this.processAST(ast.typeAnnotation);
        }
    };
    TsAnalysor.prototype.processConditionalExpression = function (ast) {
        this.processAST(ast.test);
        this.processAST(ast.consequent);
        this.processAST(ast.alternate);
    };
    TsAnalysor.prototype.processExportNamedDeclaration = function (ast) {
        this.processAST(ast.declaration);
    };
    TsAnalysor.prototype.processExpressionStatement = function (ast) {
        this.processAST(ast.expression);
    };
    TsAnalysor.prototype.processForInStatement = function (ast) {
        this.processAST(ast.left);
        this.processAST(ast.right);
        this.processAST(ast.body);
    };
    TsAnalysor.prototype.processForOfStatement = function (ast) {
        this.processAST(ast.left);
        this.processAST(ast.right);
        this.processAST(ast.body);
    };
    TsAnalysor.prototype.processForStatement = function (ast) {
        this.processAST(ast.init);
        this.processAST(ast.test);
        this.processAST(ast.update);
        this.processAST(ast.body);
    };
    TsAnalysor.prototype.processFunctionDeclaration = function (ast) {
        this.processFunctionExpression(ast);
    };
    TsAnalysor.prototype.processFunctionExpression = function (ast) {
        this.processFunctionExpressionInternal(undefined, false, undefined, undefined, ast);
        if (ast.returnType) {
            this.processAST(ast.returnType);
        }
    };
    TsAnalysor.prototype.processFunctionExpressionInternal = function (funcName, isStatic, kind, accessibility, ast) {
        if (ast.id) {
            funcName = this.codeFromAST(ast.id);
        }
        if (ast.params) {
            for (var i = 0, len = ast.params.length; i < len; i++) {
                var oneParam = ast.params[i];
                oneParam.__parent = ast;
                oneParam.__isFuncParam = true;
                this.processAST(oneParam);
                if (oneParam.type == typescript_estree_1.AST_NODE_TYPES.Identifier && oneParam.typeAnnotation) {
                    this.processAST(oneParam.typeAnnotation);
                }
            }
        }
        if (ast.body)
            this.processAST(ast.body);
    };
    TsAnalysor.prototype.processIdentifier = function (ast) {
    };
    TsAnalysor.prototype.processIfStatement = function (ast) {
        this.processAST(ast.test);
        this.processAST(ast.consequent);
        if (ast.alternate && (ast.alternate.type != typescript_estree_1.AST_NODE_TYPES.BlockStatement || ast.alternate.body.length > 0)) {
            this.processAST(ast.alternate);
        }
    };
    TsAnalysor.prototype.processImportDeclaration = function (ast) {
        var _a;
        var sourceValue = ast.source.value;
        var dotPos = sourceValue.lastIndexOf('/');
        var idStr = sourceValue;
        var importModule = '';
        if (dotPos > 0) {
            idStr = sourceValue.substr(dotPos + 1);
            importModule = sourceValue.substring(0, dotPos);
        }
        var specifierNames = [];
        for (var i = 0, len = ast.specifiers.length; i < len; i++) {
            var sf = ast.specifiers[i];
            if (sf.type == typescript_estree_1.AST_NODE_TYPES.ImportSpecifier || sf.type == typescript_estree_1.AST_NODE_TYPES.ImportDefaultSpecifier) {
                specifierNames.push(this.codeFromAST(sf.local));
            }
            else {
                this.assert(false, sf, sf.type + " not supported.");
            }
        }
        ast.specifierNames = specifierNames;
        (_a = this.imports) === null || _a === void 0 ? void 0 : _a.push(ast);
    };
    TsAnalysor.prototype.processImportDefaultSpecifier = function (ast) {
    };
    TsAnalysor.prototype.processLogicalExpression = function (ast) {
        this.processAST(ast.left);
        this.processAST(ast.right);
    };
    TsAnalysor.prototype.processMemberExpression = function (ast) {
        if (ast.object.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.object);
        }
        this.processAST(ast.object);
        this.processAST(ast.property);
    };
    TsAnalysor.prototype.processMethodDefinition = function (ast) {
        var funcName;
        if (ast.key) {
            funcName = this.codeFromAST(ast.key);
        }
        this.processFunctionExpressionInternal(funcName, ast.static, ast.kind, ast.accessibility, ast.value);
    };
    TsAnalysor.prototype.processNewExpression = function (ast) {
        this.processAST(ast.callee);
        if (ast.callee.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.callee);
        }
        for (var i = 0, len = ast.arguments.length; i < len; i++) {
            this.processAST(ast.arguments[i]);
        }
    };
    TsAnalysor.prototype.processObjectExpression = function (ast) {
        for (var i = 0, len = ast.properties.length; i < len; i++) {
            this.processAST(ast.properties[i]);
        }
    };
    TsAnalysor.prototype.processObjectPattern = function (ast) {
        this.assert(false, ast, 'Not support ObjectPattern yet!');
    };
    TsAnalysor.prototype.processProgram = function (ast) {
        for (var i = 0, len = ast.body.length; i < len; i++) {
            var stm = ast.body[i];
            this.processAST(stm);
        }
    };
    TsAnalysor.prototype.processProperty = function (ast) {
        this.processAST(ast.key);
        this.processAST(ast.value);
    };
    TsAnalysor.prototype.processReturnStatement = function (ast) {
        if (ast.argument) {
            this.processAST(ast.argument);
        }
    };
    TsAnalysor.prototype.processSequenceExpression = function (ast) {
        for (var i = 0, len = ast.expressions.length; i < len; i++) {
            this.processAST(ast.expressions[i]);
        }
    };
    TsAnalysor.prototype.processSwitchCase = function (ast) {
        if (ast.test) {
            this.processAST(ast.test);
        }
        for (var i = 0, len = ast.consequent.length; i < len; i++) {
            if (ast.consequent[i].type != typescript_estree_1.AST_NODE_TYPES.BreakStatement) {
                this.processAST(ast.consequent[i]);
            }
        }
    };
    TsAnalysor.prototype.processSwitchStatement = function (ast) {
        this.processAST(ast.discriminant);
        for (var i = 0, len = ast.cases.length; i < len; i++) {
            this.processSwitchCase(ast.cases[i]);
        }
    };
    TsAnalysor.prototype.processThrowStatement = function (ast) {
        this.processAST(ast.argument);
    };
    TsAnalysor.prototype.processTSAsExpression = function (ast) {
        this.processAST(ast.expression);
        this.processAST(ast.typeAnnotation);
    };
    TsAnalysor.prototype.processTryStatement = function (ast) {
        this.processAST(ast.block);
        if (ast.handler) {
            this.processAST(ast.handler);
        }
        if (ast.finalizer) {
            this.processAST(ast.finalizer);
        }
    };
    TsAnalysor.prototype.processTSTypeParameterInstantiation = function (ast) {
        for (var i = 0, len = ast.params.length; i < len; i++) {
            this.processAST(ast.params[i]);
        }
    };
    TsAnalysor.prototype.processUnaryExpression = function (ast) {
        this.processAST(ast.argument);
    };
    TsAnalysor.prototype.processUpdateExpression = function (ast) {
        this.processAST(ast.argument);
    };
    TsAnalysor.prototype.processVariableDeclaration = function (ast) {
        for (var i = 0, len = ast.declarations.length; i < len; i++) {
            var d = ast.declarations[i];
            this.processVariableDeclarator(d);
        }
    };
    TsAnalysor.prototype.processVariableDeclarator = function (ast) {
        this.processAST(ast.id);
        if (ast.id.type == typescript_estree_1.AST_NODE_TYPES.Identifier && ast.id.typeAnnotation) {
            this.processAST(ast.id.typeAnnotation);
        }
        if (ast.init) {
            this.processAST(ast.init);
        }
    };
    TsAnalysor.prototype.processWhileStatement = function (ast) {
        this.processAST(ast.test);
        this.processAST(ast.body);
    };
    TsAnalysor.prototype.processTSInterfaceBody = function (ast) {
        for (var i = 0, len = ast.body.length; i < len; i++) {
            this.codeFromAST(ast.body[i]);
        }
    };
    TsAnalysor.prototype.processTSAbstractMethodDefinition = function (ast) {
        this.processMethodDefinition(ast);
    };
    TsAnalysor.prototype.processTSArrayType = function (ast) {
        this.processAST(ast.elementType);
    };
    TsAnalysor.prototype.processTSModuleBlock = function (ast) {
        for (var i = 0, len = ast.body.length; i < len; i++) {
            this.processAST(ast.body[i]);
        }
    };
    TsAnalysor.prototype.processTSModuleDeclaration = function (ast) {
        var mid = this.codeFromAST(ast.id);
        this.processAST(ast.body);
    };
    TsAnalysor.prototype.processTSImportEqualsDeclaration = function (ast) {
        var idStr = this.codeFromAST(ast.id);
        var refRstr = this.codeFromAST(ast.moduleReference.right);
        if (idStr == refRstr) {
            this.codeFromAST(ast.moduleReference.left);
        }
    };
    TsAnalysor.prototype.processTSInterfaceDeclaration = function (ast) {
        var className = this.codeFromAST(ast.id);
    };
    TsAnalysor.prototype.processTSTypeAnnotation = function (ast) {
        this.processAST(ast.typeAnnotation);
    };
    TsAnalysor.prototype.processTSTypeReference = function (ast) {
        if (ast.typeName.type == typescript_estree_1.AST_NODE_TYPES.Identifier) {
            this.setIdUsed(ast.typeName);
        }
    };
    TsAnalysor.prototype.codeFromAST = function (ast) {
        var str = '';
        switch (ast.type) {
            case typescript_estree_1.AST_NODE_TYPES.Identifier:
                str += this.codeFromIdentifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportDeclaration:
                str += this.codeFromImportDeclaration(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportDefaultSpecifier:
                str += this.codeFromImportDefaultSpecifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportNamespaceSpecifier:
                str += this.codeFromImportNamespaceSpecifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.ImportSpecifier:
                str += this.codeFromImportSpecifier(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.Literal:
                str += this.codeFromLiteral(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.MemberExpression:
                str += this.codeFromMemberExpression(ast);
                break;
            case typescript_estree_1.AST_NODE_TYPES.TSQualifiedName:
                str += this.codeFromTSQualifiedName(ast);
                break;
            default:
                this.assert(false, ast, '[ERROR]Analyse ast error, not support: ' + ast.type);
                break;
        }
        return str;
    };
    TsAnalysor.prototype.codeFromIdentifier = function (ast) {
        return ast.name;
    };
    TsAnalysor.prototype.codeFromImportDeclaration = function (ast) {
        var str = 'import ';
        var ssArr = [];
        var defaultssArr = [];
        for (var i = 0, len = ast.specifiers.length; i < len; i++) {
            var sf = ast.specifiers[i];
            if (sf.__notUsed)
                continue;
            var ss = this.codeFromAST(sf.local);
            if (sf.type == typescript_estree_1.AST_NODE_TYPES.ImportSpecifier && sf.local.name != sf.imported.name) {
                ss = this.codeFromAST(sf.imported) + ' as ' + ss;
            }
            if (sf.type != typescript_estree_1.AST_NODE_TYPES.ImportDefaultSpecifier) {
                ssArr.push(ss);
            }
            else {
                defaultssArr.push(ss);
            }
        }
        var specifierStr = '';
        if (defaultssArr.length) {
            specifierStr += defaultssArr.join(', ');
        }
        if (specifierStr) {
            specifierStr += ', ';
        }
        if (ssArr.length) {
            specifierStr += '{ ' + ssArr.join(', ') + ' }';
        }
        str += specifierStr + ' from ' + ast.source.raw + ';';
        return str;
    };
    TsAnalysor.prototype.codeFromImportDefaultSpecifier = function (ast) {
        this.assert(false, ast, 'Not support ImportDefaultSpecifier yet!');
        return '';
    };
    TsAnalysor.prototype.codeFromImportNamespaceSpecifier = function (ast) {
        this.assert(false, ast, 'Not support ImportNamespaceSpecifier yet!');
        return '';
    };
    TsAnalysor.prototype.codeFromImportSpecifier = function (ast) {
        var str = this.codeFromAST(ast.imported);
        return str;
    };
    TsAnalysor.prototype.codeFromLiteral = function (ast) {
        var str = ast.raw;
        return str;
    };
    TsAnalysor.prototype.codeFromMemberExpression = function (ast) {
        var objStr = this.codeFromAST(ast.object);
        var str = objStr;
        var propertyStr = this.codeFromAST(ast.property);
        if (ast.computed) {
            str += '[' + propertyStr + ']';
        }
        else {
            str += '.' + propertyStr;
        }
        return str;
    };
    TsAnalysor.prototype.codeFromTSQualifiedName = function (ast) {
        ast.left;
    };
    TsAnalysor.prototype.setIdUsed = function (id) {
        var idStr = this.codeFromAST(id);
        if (!this.ids.includes(idStr)) {
            this.ids.push(idStr);
        }
    };
    TsAnalysor.prototype.assert = function (cond, ast, message) {
        if (!cond) {
            if (this.option.errorDetail) {
                console.log(util.inspect(ast, true, 6));
            }
            console.log('\x1B[36m%s\x1B[0m\x1B[33m%d:%d\x1B[0m - \x1B[31merror\x1B[0m: %s', this.filePath, ast.loc ? ast.loc.start.line : -1, ast.loc ? ast.loc.start.column : -1, message ? message : 'Error');
            console.log(Strings_1.TrimTsImportsHints.ContactMsg);
        }
    };
    return TsAnalysor;
}());
exports.TsAnalysor = TsAnalysor;
