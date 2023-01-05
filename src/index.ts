import { marked } from "marked"
import type { OpenAPIV3_1 } from "openapi-types"

type MarkdownText = string

interface InputMarkdowns {
  index: MarkdownText
  paths: MarkdownText[]
  components: MarkdownText[]
}

export function generateOpenApiSchema(markdowns: InputMarkdowns): OpenAPIV3_1.Document {
  const index = markdownToHtmlDocument(markdowns.index)
  const paths = markdowns.paths.map(markdownToHtmlDocument)

  return {}
}

function markdownToHtmlDocument(markdown: string) {
  const html = marked.parse(markdown)
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom.documentElement
}