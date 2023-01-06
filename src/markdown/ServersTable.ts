import { markdownToHtmlDocument } from "./utils";

export class ServersTable {
  private document: HTMLHtmlElement
  private tableElement: HTMLTableElement | null

  constructor(markdown: string) {
    this.document = markdownToHtmlDocument(markdown)
    this.tableElement = this.document.querySelector('table')
  }

  *getRows() {
    if (!this.tableElement) {
      return []
    }

    const rows = this.tableElement.querySelectorAll('tr')
    for (const row of Array.from(rows)) {
      const cells = Array.from(row.querySelectorAll('td'))
      const urlCell = cells.find(cell => isServerURL(cell.textContent ?? ''))
      const descriptionCell = cells.find(cell => cell !== urlCell)

      const url = urlCell?.textContent
      if (!url) {
        continue
      }

      yield {
        url,
        description: descriptionCell?.textContent ?? undefined
      }
    }
  }

  toJSON() {
    return Array.from(this.getRows())
  }
}

function isServerURL(text: string) {
  try {
    new URL(text.trim())
    return true
  } catch {
    return false
  }
}
