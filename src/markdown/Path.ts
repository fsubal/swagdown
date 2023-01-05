import { OpenAPIV3_1 } from "openapi-types";
import { findHeadingById } from "./heading";

/**
 * Markdown から OpenAPI の paths[] 部分を取り出す
 */
export class Path {
  private requestHeading = findHeadingById('request', this.document)
  private responsesHeading = findHeadingById('responses', this.document)

  constructor(
    private pathTemplate: string,
    private method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head',
    private description: string,
    private document: HTMLHtmlElement
  ) { }

  get responses() {
    return []
  }

  toJSON(): OpenAPIV3_1.PathItemObject {
    return {
      [this.pathTemplate]: {
        [this.method]: {
          description: this.description,
          parameters: [],
          requestBody: [],
          responses: this.responses
        }
      }
    }
  }
}