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
    this.msg_actions = new Map()
    this.onload = null
    this.onload_complete = false
    this.root_id = null
  }
  setHtml(html) {
    this.html = html
  }
  saveHtml() {
    const html = util.id(this.root_id).innerHTML
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
  addMsgAction(msg, action) {
    this.msg_actions.set(msg, action)
  }
  receiveMessage(msg, params) {
    const action = this.msg_actions.get(msg)
    if (action) {
      action(params)
    }
  }
  addInnerLink(target_id, path, setup=false) {
    this.addHandler(`${this.id}_link_${target_id}`, new Handler({
      target: target_id,
      type: 'click',
      listener: (ev) => {
        ev.preventDefault()
        Page.move(path)
      },
    }))
    if (setup) {
      this.handlers.get(`${this.id}_link_${target_id}`).set()
    }
  }
  addClickHandler(btn_id, func, setup=false) {
    this.addHandler(`${this.id}_click_${btn_id}`, new Handler({
      target: btn_id,
      type: 'click',
      listener: (ev) => {
        ev.preventDefault()
        func(ev)
      },
    }))
    if (setup) {
      this.handlers.get(`${this.id}_click_${btn_id}`).set()
    }
  }
  async lender(target_id) {
    console.debug(`### Component.lender(${this.id} -> ${target_id})`)
    const node = util.id(target_id)
    if (node) {
      node.innerHTML = this.html
      for (const [name, handler] of this.handlers) {
        handler.set()
      }
      this.root_id = target_id
    }
  }
  async callAPI(name, form_id=null, params=new Map()) {
    if (form_id) {
      const form_data = new FormData(util.id(form_id))
      for (const pair of form_data.entries()) {
        if (!params.has(pair[0])) {
          params.set(pair[0], pair[1])
        }
      }
    }
    const api = this.apis.get(name)
    if (api) {
      return await api.call(params)
    }
  }
}

