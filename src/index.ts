import { marked } from "marked"
import type { OpenAPIV3_1 } from "openapi-types"
import { Info } from "./markdown/Info"
import { Path } from "./markdown/Path"

type MarkdownText = string

interface InputMarkdowns {
  index: MarkdownText
  paths: MarkdownText[]
  components: MarkdownText[]
}

export function generateOpenApiSchema(markdowns: InputMarkdowns): OpenAPIV3_1.Document {
  const info = new Info(markdownToHtmlDocument(markdowns.index))
  const paths = markdowns.paths.map(markdown => new Path('/', 'get', '', markdownToHtmlDocument(markdown)))

  return {
    openapi: '3.1.0',
    info: {
      title: info.title,
      description: info.description,
      version: info.version
    },
    paths: paths.reduce((paths, path) => ({
      ...paths,
      ...path.toJSON()
    }), {}),
    components: []
  }
}

function markdownToHtmlDocument(markdown: string) {
  const html = marked.parse(markdown)
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom.documentElement as HTMLHtmlElement
}