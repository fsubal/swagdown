import semver from "semver"
import { findHeadingById, MarkdownHeading } from "./heading"

const DEFAULT_VERSION = '1.0.0'

/**
 * Markdown から OpenAPI の info 部分を取り出す
 */
export class Info {
  private titleElement = this.document.querySelector('h1')

  constructor(private document: HTMLHtmlElement) { }

  get title() {
    return this.titleElement?.textContent ?? 'Example API Documentation'
  }

  get description() {
    if (!this.titleElement) {
      return ''
    }

    const children = new MarkdownHeading(this.titleElement).children

    return children.map(node => node.textContent).join('')
  }

  get version() {
    const heading = findHeadingById('version', this.document)
    if (!heading) {
      return DEFAULT_VERSION
    }

    const children = new MarkdownHeading(heading).children

    const versionNode = children.find(node => (
      semver.valid(node.textContent)
    ))

    return versionNode?.textContent ?? DEFAULT_VERSION
  }
}
