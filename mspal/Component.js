import API from "./API.js"
import Handler from "./Handler.js"
import Page from "./Page.js"
import util from "./util.js"

export default class Component {
  constructor(id) {
    this.id = id
    this.html = ''
    this.children = new Map()
    this.styles = new Array()
    this.apis = new Map()
    this.handlers = new Map()
    this.onload = null
  }
  setHtml(html) {
    this.html = html
  }
  addChild(elem_id, component_id) {
    this.children.set(elem_id, component_id)
  }
  getChildrenId() {
    const component_id_list = []
    for (const [elem_id, component_id] of this.children) {
      component_id_list.push(component_id)
    }
    return component_id_list
  }
  addStyle(css_id) {
    this.styles.push(css_id)
  }
  getStyles() {
    return this.styles
  }
  addAPI(name, api) {
    this.apis.set(name, api)
  }
  addHandler(name, handler) {
    this.handlers.set(name, handler)
  }
  getHandler(name) {
    return this.handlers.get(name)
  }
  addInnerLink(target_id, path) {
    this.addHandler(`${this.id}_link_${target_id}`, new Handler({
      target: target_id,
      type: 'click',
      listener: (ev) => {
        ev.preventDefault()
        Page.move(path)
      },
    }))
  }
  async lender(target_id) {
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
  async callAPI(name, form_id=null, params=new Map()) {
    if (form_id) {
      const form_data = new FormData(util.id(form_id))
      console.log(form_data.entries())
      for (const pair of form_data.entries()) {
        if (!params.has(pair[0])) {
          params.set(pair[0], pair[1])
        }
      }
      console.log(params)
    }
    const api = this.apis.get(name)
    if (api) {
      return await api.call(params)
    }
  }
}

