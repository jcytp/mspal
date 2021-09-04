import util from './util.js'
import API from "./API.js"
import Handler from "./Handler.js"

export default class Page {
  static instans = null

  constructor(obj = {}) {
    this.domain = obj.domain ? obj.domain : document.location.host
    this.routes_path = obj.routes_path ? obj.routes_path : "../routes.json"
    this.root_id = obj.root_id ? obj.root_id : "sspa-root"
    this.routes = new Map()
    this.components = new Map()
    this.back_handler = new Handler({
      target: "__window",
      type: "popstate",
      listener: async (ev) => {
        if (this.domain == document.location.host && ev.state.startsWith("sspa|")) {
          const top_component_id = ev.state.substr(5)
          this.open(top_component_id)
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
    for (const [uri_pattern, component_id] of this.routes) {
      if (util.matchRuleWild(uri, uri_pattern)) {
        return component_id
      }
    }
    return null
  }

  async loadComponents(component_id) {
    if (this.components.has(component_id)) {
      return this.components.get(component_id)
    } else {
      const module = await import (`../components/${component_id}.js`)
      const component = module ? (module.default ? module.default : null) : null
      if (component) {
        this.components.set(component_id, component)
        for (const [id, cmp_id] of component.children) {
          await this.loadComponents(cmp_id)
        }
      } else {
        console.error(`sspa Error: Components "${component_id}" Not Found.`)
      }
      return component
    }
  }

  lenderComponents(target_id, component_id) {
    const component = this.components.get(component_id)
    component.lender(target_id)
    for (const [id, cmp_id] of component.children) {
      this.lenderComponents(id, cmp_id)
    }
  }

  async open(component_id) {
    console.debug(`### Page.open(${component_id})`)
    await this.loadComponents(component_id)
    this.lenderComponents(util.id(this.root_id) ? this.root_id : "__body", component_id)
  }

  /* ------------------------------------------------------------ */

  static async init() {
    console.debug(`### Page.init()`)
    // ToDo: read from params.json
    if (!this.instans) {
      this.instans = new Page()
      // # read from routes.json
      await this.instans.loadRoutes()
    }
    const page = this.instans
    const top_component_id = page.findRoute(document.location.pathname)
    if (!top_component_id) {
      console.error(`page initialize error | component for this uri not defined.`)
      return
    }
    history.replaceState(`sspa|${top_component_id}`, "", document.location.pathname)
    this.open(top_component_id)
  }

  static async move(path) {
    console.debug(`### Page.move(${path})`)
    const page = this.instans
    const top_component_id = page.findRoute(document.location.pathname)
    if (!top_component_id) {
      console.error(`page move error | component for next uri not defined.`)
      return
    }
    history.pushState(`sspa|${top_component_id}`, "", path)
    this.open(top_component_id)
  }
}