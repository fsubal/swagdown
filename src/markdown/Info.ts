import semver from "semver"
import { findHeadingById, MarkdownHeading } from "./MarkdownHeading"
import { markdownToHtmlDocument } from "./utils"

const DEFAULT_VERSION = '1.0.0'

/**
 * Markdown から OpenAPI の info 部分を取り出す
 */
export class Info {
  private document: HTMLHtmlElement
  private titleElement: HTMLHeadingElement | null

  constructor(markdown: string) {
    this.document = markdownToHtmlDocument(markdown)
    this.titleElement = this.document.querySelector('h1')
  }

  get title() {
    return this.titleElement?.textContent ?? 'Example API Documentation'
  }

  get description() {
    if (!this.titleElement) {
      return ''
    }

    const heading = new MarkdownHeading(this.titleElement)

    const descriptions: string[] = []
    for (const node of heading.eachChildInSection()) {
      if (node.textContent) {
        descriptions.push(node.textContent)
      }
    }

    return descriptions.join('')
  }

  get version() {
    const heading = findHeadingById('version', this.document)
    if (!heading) {
      return DEFAULT_VERSION
    }

    for (const node of heading.eachChildInSection()) {
      if (!node.textContent) {
        continue
      }

      const trimmed = node.textContent.trim()
      if (semver.valid(trimmed)) {
        return trimmed
      }
    }

    return DEFAULT_VERSION
  }
}
