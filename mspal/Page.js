import util from './util.js'
import API from "./API.js"
import Handler from "./Handler.js"

export default class Page {
  static instance = null

  constructor(settings = {}) {
    console.debug(`### Page.constructor(${settings})`)
    this.base_path = settings.base_path ? settings.base_path : ""
    this.domain = settings.domain ? settings.domain : document.location.host
    this.routes_path = settings.routes_path ? settings.routes_path : `${this.base_path}routes.json`
    this.components_path = settings.components_path ? settings.components_path : `${this.base_path}components/`
    this.style_path = settings.style_path ? settings.style_path : `${this.base_path}css/`
    this.root_id = settings.root_id ? settings.root_id : "spa-root"
    this.history_prefix = settings.history_prefix ? settings.history_prefix : "mspal|"
    this.unused_style_class = settings.unused_style_class ? settings.unused_style_class : "mspal_unused_style"
    this.routes = new Map()
    this.components = new Map()
    this.styles = new Map()
    this.back_handler = new Handler({
      target: "__window",
      type: "popstate",
      listener: async (ev) => {
        const page = Page.instance
        if (page.domain == document.location.host && ev.state.startsWith(page.history_prefix)) {
          const top_component_id = ev.state.substr(page.history_prefix.length)
          page.open(top_component_id)
        }
      }
    })
  }

  /* ------------------------------------------------------------ */

  async loadRoutes() {
    const api = new API({
      url: this.routes_path
    })
    const response = await api.call()
    const routes = await response.json()
    for (const [uri, component_id] of routes) {
      this.routes.set(uri, component_id)
    }
  }
  findRoute(uri) {
    console.debug(`### Page.findRoute(${uri})`)
    for (const [uri_pattern, component_id] of this.routes) {
      if (util.matchRuleWild(uri, uri_pattern)) {
        return component_id
      }
    }
    return null
  }

  async loadComponents(component_id) {
    console.debug(`### Page.loadComponents(${component_id})`)
    if (this.components.has(component_id)) {
      return
    }
    const module = await import (`${this.components_path}${component_id}.js`)
    const component = module ? (module.default ? module.default : null) : null
    if (!component) {
      console.error(`Page.loadComponents() load module error | component_id: ${component_id}`)
      return
    }
    this.components.set(component_id, component)
    const promise_list = []
    for (const [id, cmp_id] of component.children) {
      const promise = new Promise(async resolve => {
        await this.loadComponents(cmp_id)
        resolve()
      })
      promise_list.push(promise)
    }
    await Promise.all(promise_list)
  }
  
  getComponentsStyles(component_id) {
    const component = this.components.get(component_id)
    let style_id_list = component.getStyles()
    for (const child_id of component.getChildrenId()) {
      style_id_list = style_id_list.concat(this.getComponentsStyles(child_id))
    }
    return style_id_list
  }
  async loadComponentStyles(component_id) {
    console.debug(`### Page.loadComponentStyles(${component_id})`)
    const style_id_list = this.getComponentsStyles(component_id)
    const promise_list = []
    for (const style_id of style_id_list) {
      const promise = new Promise(async resolve => {
        if (!this.styles.has(style_id)) {
          const style_api = new API({
            url: `${this.style_path}${style_id}.css`
          })
          const response = await style_api.call()
          const style_source = await response.text()
          this.styles.set(style_id, style_source)
        }
        resolve()
      })
      promise_list.push(promise)
    }
    await Promise.all(promise_list)
  }

  lenderComponents(target_id, component_id) {
    const component = this.components.get(component_id)
    component.lender(target_id)
    for (const style_id of component.styles) {
      if (!util.id(`style_${style_id}`)) {
        const style = util.newElem("STYLE", "__html", `style_${style_id}`)
        style.innerText = this.styles.get(style_id)
      } else {
        util.id(`style_${style_id}`).className = ""
      }
    }
    for (const [id, cmp_id] of component.children) {
      this.lenderComponents(id, cmp_id)
    }
    component.onload ? component.onload() : null
  }

  setUnusedStylesFlag() {
    for (const [style_id, source] of this.styles) {
      const node = util.id(`style_${style_id}`)
      if (node) {
        node.className = this.unused_style_class
      }
    }
  }
  removeUnusedStyles() {
    const remove_list = util.class(this.unused_style_class)
    for (const node of remove_list) {
      node.parentNode.removeChild(node)
    }
  }

  async open(component_id) {
    console.debug(`### Page.open(${component_id})`)
    await this.loadComponents(component_id)
    await this.loadComponentStyles(component_id)
    this.setUnusedStylesFlag()
    this.lenderComponents(util.id(this.root_id) ? this.root_id : "__body", component_id)
    this.removeUnusedStyles()
  }

  /* ------------------------------------------------------------ */

  static async init(settings) {
    console.debug(`### Page.init(${settings})`)
    Page.instance = new Page(settings)
    const page = Page.instance
    // # read from routes.json
    await page.loadRoutes()
    page.back_handler.set()
    const path = document.location.pathname.replace(page.base_path, "")
    const top_component_id = page.findRoute(path)
    if (!top_component_id) {
      console.error(`page initialize error | component for this uri not defined.`)
      return
    }
    history.replaceState(`${page.history_prefix}${top_component_id}`, "", document.location.pathname)
    page.open(top_component_id)
  }

  static async move(path) {
    console.debug(`### Page.move(${path})`)
    const page = Page.instance
    const top_component_id = page.findRoute(path)
    if (!top_component_id) {
      console.error(`page move error | component for next uri not defined.`)
      return
    }
    history.pushState(`${page.history_prefix}${top_component_id}`, "", `${page.base_path}${path}`)
    page.open(top_component_id)
  }
}