import { OpenAPIV3_1 } from "openapi-types"
import ts from "typescript"

export class TypeScriptCodeBlock {
  private sourceFile: ts.SourceFile
  private type?: OpenAPIV3_1.SchemaObject

  constructor(codeElement: HTMLElement, private exportedInterface: string) {
    this.sourceFile = ts.createSourceFile('index.ts', codeElement.innerText, ts.ScriptTarget.ESNext)
    ts.transform(this.sourceFile, [this.transformer])
  }

  private transformer = (context: ts.TransformationContext) => (rootNode: ts.Node): ts.Node => {
    const visit = (node: ts.Node) => {
      if (isExportedInterface(node, this.exportedInterface)) {

      }

      return ts.visitEachChild<ts.Node>(node, visit, context);
    };

    return ts.visitNode(rootNode, visit);
  }

  toJSON() {
    if (!this.type) {
      throw new Error('Could not parse code block')
    }

    return this.type
  }
}

function isExportedInterface(node: ts.Node, interfaceName: string) {
  return false
}