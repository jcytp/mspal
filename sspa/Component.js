import util from "./util.js"

export default class Component {
  constructor(id) {
    this.id = id
    this.html = ''
    this.children = new Map()
    this.apis = new Map()
    this.handlers = new Map()
  }
  setHtml(html) {
    this.html = html
  }
  addChild(elem_id, component_id) {
    this.children.set(elem_id, component_id)
  }
  addAPI(name, api) {
    this.apis.set(name, api)
  }
  addHandler(name, handler) {
    this.handlers.set(name, handler)
  }
  lender(target_id) {
    console.debug(`### Component.lender(${this.id} -> ${target_id})`)
    const node = util.id(target_id)
    if (node) {
      // html
      node.innerHTML = this.html
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

