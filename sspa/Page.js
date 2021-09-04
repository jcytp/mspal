import util from './util.js'
import API from "./API.js"
import Handler from "./Handler.js"

export default class Page {
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



  // static domain = document.location.host
  // static routes = new Map()
  // static components = new Map()

  // static routes_path = "../routes.json"
  // static root_id = "sspa-root"

  // static special_elems = new Map([
  //   ["__window", window],
  //   ["__body", document.getElementsByTagName("BODY")[0]],
  // ])

  // static back_handler = new Handler({
  //   target: "__window",
  //   type: "popstate",
  //   listener: async (ev) => {
  //     if (page.domain == document.location.host && ev.state.startsWith("sspa|")) {
  //       top_component_id = ev.state.substr(5)
  //       page.open(top_component_id)
  //     }
  //   }
  // })

  // static id(elem_id) {
  //   if (page.special_elems.has(elem_id)) {
  //     return page.special_elems.get(elem_id)
  //   }
  //   return document.getElementById(elem_id)
  // }

  // static class(elem_classname) {
  //   return Array.from(document.getElementsByClassName(elem_classname))
  // }

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
  findRoute(uri_pattern) {
    for (const [uri, component_id] of this.routes) {
      console.log(`uri = ${uri}, uri_pattern = ${uri_pattern}`)
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
    await this.loadComponents(component_id)
    this.lenderComponents(this.id(this.root_id) ? this.root_id : "__body", component_id)
  }

  /* ------------------------------------------------------------ */

  async init() {
    // ToDo: read from params.json
    // ToDo: read from routes.json
    await this.loadRoutes()
    // history.replaceState(path, "", path)
    // ToDo: find top component from routes
    const top_component_id = this.findRoute(document.location.pathname)
    if (!top_component_id) {
      console.error(`page initialize error | component for this uri not defined.`)
    }
    // const top_component_id = "Login"
    history.replaceState(`sspa|${top_component_id}`, "", document.location.pathname)
    this.open(top_component_id)
    // const top_component_id = "Login"
    // await page.loadComponents(top_component_id)
    // page.lenderComponents(page.id("sspa-root") ? "sspa-root" : "__body", top_component_id)
    // const component = await page.loadComponent(component_id)
    // if (component) {
    //   component.lender(page.id("sspa-root") ? "sspa-root" : "__body")
    //   for (const [id, cmp_id] of component.children) {
    //     const cmp = await page.loadComponent(cmp_id)
    //     cmp.lender(id)
    //   }
    // }
  }

  move(path) {
    // ToDo: find top component from routes
    const top_component_id = "Register"
    history.pushState(`sspa|${top_component_id}`, "", path)
    this.open(top_component_id)
    // const top_component_id = "Register"
    // await page.loadComponents(top_component_id)
    // page.lenderComponents(page.id("sspa-root") ? "sspa-root" : "__body", top_component_id)


    // const component = await page.loadComponent(component_id)
    // if (component) {
    //   component.lender(page.id("sspa-root") ? "sspa-root" : "__body")
    // }
  }
}