import { OpenAPIV3_1 } from "openapi-types";
import { findHeadingById, MarkdownHeading } from "./MarkdownHeading";
import { markdownToHtmlDocument } from "./utils";

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head'

export interface PathItem {
  pathTemplate: string
  method: HttpMethod
  description: string
  markdown: string
}

/**
 * Markdown から OpenAPI の paths[] 部分を取り出す
 */
export class Path {
  readonly pathTemplate: string
  readonly method: HttpMethod
  readonly description: string
  private document: HTMLHtmlElement
  private requestHeading: MarkdownHeading | null
  private responsesHeading: MarkdownHeading | null

  constructor({ pathTemplate, method, description, markdown }: PathItem) {
    this.pathTemplate = pathTemplate
    this.method = method
    this.description = description
    this.document = markdownToHtmlDocument(markdown)
    this.requestHeading = findHeadingById('request', this.document)
    this.responsesHeading = findHeadingById('responses', this.document)
  }

  get parameters() {
    return []
  }

  get requestBody() {
    return {
      content: {}
    }
  }

  get responses() {
    return {}
  }

  toJSON(): OpenAPIV3_1.OperationObject {
    return {
      description: this.description,
      parameters: [],
      requestBody: this.requestBody,
      responses: this.responses
    }
  }
}
