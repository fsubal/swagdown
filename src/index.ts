import type { OpenAPIV3_1 } from "openapi-types"
import { Info } from "./markdown/Info"
import { PathItem } from "./markdown/Path"
import { PathsCollection } from "./markdown/PathsCollection"

type MarkdownText = string

interface InputMarkdowns {
  index: MarkdownText
  paths: PathItem[]
  components: MarkdownText[]
}

export function generateOpenApiSchema(markdowns: InputMarkdowns): OpenAPIV3_1.Document {
  const info = new Info(markdowns.index)
  const paths = new PathsCollection(markdowns.paths)

  return {
    openapi: '3.1.0',
    info: {
      title: info.title,
      description: info.description,
      version: info.version
    },
    paths: paths.toJSON(),
    components: []
  }
}

