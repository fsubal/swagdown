import { OpenAPIV3_1 } from "openapi-types"
import ts from "typescript"
import { deepAssign } from "./utils"

const SOURCE_FILE_NAME = 'index.ts'

export class TypeScriptCodeBlock {
  private sourceFile: ts.SourceFile
  private program: ts.Program
  private typeChecker: ts.TypeChecker

  private schema?: OpenAPIV3_1.NonArraySchemaObject

  constructor(codeElement: HTMLElement, private exportedInterface: string) {
    this.sourceFile = ts.createSourceFile(SOURCE_FILE_NAME, codeElement.innerText, ts.ScriptTarget.ESNext)
    this.program = ts.createProgram({ rootNames: [SOURCE_FILE_NAME], options: {} })
    this.typeChecker = this.program.getTypeChecker()

    ts.transform(this.sourceFile, [this.transformer])
  }

  private transformer = (context: ts.TransformationContext) => (rootNode: ts.Node): ts.Node => {
    const visit = (node: ts.Node) => {
      const symbol = this.typeChecker.getTypeAtLocation(node)
      if (isExportedInterface(symbol, this.exportedInterface)) {
        const schema: OpenAPIV3_1.NonArraySchemaObject = {
          type: 'object',
          properties: {}
        }

        for (const [paths, property] of traverseProperties(symbol, this.typeChecker)) {
          deepAssign(schema.properties!, paths, property)
        }

        this.schema = schema
        return
      }

      return ts.visitEachChild<ts.Node>(node, visit, context);
    };

    return ts.visitNode(rootNode, visit);
  }

  toJSON() {
    if (!this.schema) {
      throw new Error(`Could not parse code block. Forgot to export interface ${this.exportedInterface} ?`)
    }

    return this.schema
  }
}

function isExportedInterface(type: ts.Type, interfaceName: string): type is ts.InterfaceType {
  if (!type.isClassOrInterface()) {
    return false
  }

  const name = type.getSymbol()?.getName()
  if (!name) {
    return false
  }

  return name === interfaceName
}

function* traverseProperties(
  type: ts.InterfaceType,
  typeChecker: ts.TypeChecker
): Generator<[string[], OpenAPIV3_1.SchemaObject]> {
  for (const property of type.getProperties()) {
    const key = property.escapedName
    const value = property.valueDeclaration!

    const resolvedType = resolveType(value.kind)

    switch (resolvedType) {
      case undefined: {
        // unknown type
        yield [
          [key.toString()],
          { description: '' }
        ]
        break
      }

      case 'array': {
        yield [
          [key.toString()],
          { type: resolvedType, description: '', example: [], items: {} }
        ]
        break
      }

      default: {
        yield [
          [key.toString()],
          { type: resolvedType, description: '', example: 1 }
        ]
        break
      }
    }
  }
}

function resolveType(kind: ts.SyntaxKind): OpenAPIV3_1.SchemaObject['type'] {
  return 'number' as const
}

// function parseDocComment(type: ts.InterfaceType, checker: ts.TypeChecker): Partial<OpenAPIV3_1.NonArraySchemaObject> {
//   const parts = type.getSymbol()?.getDocumentationComment(checker)
//   if (!parts) {
//     return {}
//   }

//   const docComment: Partial<OpenAPIV3_1.NonArraySchemaObject> = {}

//   parts.forEach(part => ({
//     // TODO
//   }))

//   return docComment
// }
