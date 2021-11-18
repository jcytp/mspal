
export default class Dom {
  static special_elems = new Map([
    ["#__window", window],
    ["#__html", document.documentElement],
    ["#__header", document.header],
    ["#__body", document.body],
  ])

  static get(selector) {
    if (Dom.special_elems.has(selector)) {
      return Dom.special_elems.get(selector)
    }
    return document.querySelector(selector)
  }
  static getList(selector) {
    return document.querySelectorAll(selector)
  }
  
  static newElem(tagname, initializer) {
    const elem = document.createElement(tagname)
    initializer(elem)
    return elem
  }

  static getUrlPath(url=null) {
    const target_url = url || location.href
    const pat = /^[^:]+:\/\/[^\/]+\/(.*)$/
    const m = pat.exec(target_url)
    return `/${m[1]}`
  }

  static mapToObject(map) {
    return [...map].reduce((l,[k,v]) => Object.assign(l, {[k]:v}), {})
  }
}
