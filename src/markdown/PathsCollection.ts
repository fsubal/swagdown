import { OpenAPIV3_1 } from "openapi-types";
import { Path, PathItem } from "./Path";

export class PathsCollection {
  private paths: Path[]

  constructor(items: PathItem[]) {
    this.paths = items.map(item => new Path(item))
  }

  toJSON() {
    const paths: OpenAPIV3_1.PathsObject = {}

    for (const path of this.paths) {
      paths[path.pathTemplate] = {
        ...paths[path.pathTemplate],
        [path.method]: path.toJSON()
      }
    }

    return paths
  }
}
