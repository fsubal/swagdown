import { marked } from "marked"

export function markdownToHtmlDocument(markdown: string) {
  const html = marked.parse(markdown)
  const dom = new DOMParser().parseFromString(html, 'text/html')

  return dom.documentElement as HTMLHtmlElement
}
