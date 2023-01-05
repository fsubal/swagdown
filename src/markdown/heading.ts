const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const MAX_CHILDREN_COUNT = 100

/**
 * マークダウンにおける見出し要素。
 * HTML 上で親子関係にない段落を自分の子要素と認識したいときとかに使う
 */
export class MarkdownHeading {
  constructor(private el: HTMLHeadingElement) { }

  get level() {
    const [level] = this.el.tagName.match(/\d+/) ?? []

    return Number(level)
  }

  /**
   * ある見出しから次の見出しの間に存在する要素（段落、箇条書きなど）の一覧を得る
   *
   * 自分よりレベルの低い見出しは結果に含む
   * （自身が h1 要素の場合、次の h1 までの要素を全部取る。h2 や h3 は結果に含まれる）
   *
   * 自分よりレベルの高い、または同じレベルの見出しにぶつかったらそこで停止する
   * （自身が h2 要素の場合、次にくる h1 または h2 にぶつかるまで探索を続ける）
   */
  get children() {
    const nodes: ChildNode[] = []

    let current: ChildNode = this.el
    while (current.nextSibling != null) {
      const sibling = current.nextSibling

      if (sibling instanceof HTMLHeadingElement) {
        if (!this.isHigherThan(sibling)) {
          break
        }
      }

      if (nodes.length >= MAX_CHILDREN_COUNT) {
        throw new Error(`The section has too many paragraphs or nodes: ${this.el.textContent}`)
      }

      nodes.push(sibling)
      current = sibling
    }

    return nodes
  }

  isHigherThan(other: HTMLHeadingElement) {
    return this.level > new MarkdownHeading(other).level
  }
}

/**
 * id が〇〇な見出し要素を得る。h1~h6 のどれに当てはまるかはどれでも良い
 */
export function findHeadingById<E extends Element = HTMLElement>(id: string, parent: E) {
  const selector = HEADING_TAGS.map(h => `${h}[id="${CSS.escape(id)}"]`).join(',')

  return parent.querySelector<HTMLHeadingElement>(selector)
}
