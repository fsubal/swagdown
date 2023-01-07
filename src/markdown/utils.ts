import { marked } from "marked"

export function markdownToHtmlDocument(markdown: string) {
  const html = marked.parse(markdown)
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom.documentElement as HTMLHtmlElement
}

export function deepAssign(target: Record<string, any>, paths: string[], value: unknown) {
  let a = paths
  let o: any = target
  while (a.length - 1) {
    let n = a.shift()!
    if (!(n in o)) {
      o[n] = {}
    }

    o = o[n]
  }

  o[a[0]] = value
}
