import API from "./API.js"
import util from "./util.js"

export default class Component {
  constructor(id) {
    this.css_path = '../css/'
    this.id = id
    this.html = ''
    this.children = new Map()
    this.css = new Array()
    this.apis = new Map()
    this.handlers = new Map()
  }
  setHtml(html) {
    this.html = html
  }
  addChild(elem_id, component_id) {
    this.children.set(elem_id, component_id)
  }
  addCSS(css_id) {
    this.children.push(css_id)
  }
  addAPI(name, api) {
    this.apis.set(name, api)
  }
  addHandler(name, handler) {
    this.handlers.set(name, handler)
  }
  async lender(target_id) {
    console.debug(`### Component.lender(${this.id} -> ${target_id})`)
    const node = util.id(target_id)
    if (node) {
      // html
      node.innerHTML = this.html
      // css
      for (const css_id of this.css) {
        const css_api = new API({
          url: `${this.css_path}${css_id}.css` 
        })
        css_source = css_api.call()
        util.id("__html").appendChild()
        const style = util.newElem("STYLE", parent="__html", id=`css_${css_id}`)
        style.innerText = css_source
      }
      // handlers
      for (const [name, handler] of this.handlers) {
        handler.set()
      }
    }
  }
  async callAPI(name) {
    const api = this.apis.get(name)
    if (api) {
      return await api.call()
    }
  }
}

