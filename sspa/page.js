import Handler from "./Handler.js"

export default class page {
  static domain = document.location.host
  static routes = new Map()
  static components = new Map()

  static root_id = "sspa-root"
  static special_elems = new Map([
    ["__window", window],
    ["__body", document.getElementsByTagName("BODY")[0]],
  ])

  static back_handler = new Handler({
    target: "__window",
    type: "popstate",
    listener: async (ev) => {
      if (page.domain == document.location.host && ev.state.startsWith("sspa|")) {
        top_component_id = ev.state.substr(5)
        page.open(top_component_id)
      }
    }
  })

  static id(elem_id) {
    if (page.special_elems.has(elem_id)) {
      return page.special_elems.get(elem_id)
    }
    return document.getElementById(elem_id)
  }

  static class(elem_classname) {
    return Array.from(document.getElementsByClassName(elem_classname))
  }

  static async loadComponents(component_id) {
    if (page.components.has(component_id)) {
      return page.components.get(component_id)
    } else {
      const module = await import (`../components/${component_id}.js`)
      const component = module ? (module.default ? module.default : null) : null
      if (component) {
        page.components.set(component_id, component)
        for (const [id, cmp_id] of component.children) {
          await page.loadComponents(cmp_id)
        }
      } else {
        console.error(`sspa Error: Components "${component_id}" Not Found.`)
      }
      return component
    }
  }

  static lenderComponents(target_id, component_id) {
    const component = page.components.get(component_id)
    component.lender(target_id)
    for (const [id, cmp_id] of component.children) {
      page.lenderComponents(id, cmp_id)
    }
  }

  static async open(component_id) {
    await page.loadComponents(component_id)
    page.lenderComponents(page.id(this.root_id) ? this.root_id : "__body", component_id)
  }

  static init() {
    // ToDo: read from params.json
    // ToDo: read from routes.json
    // history.replaceState(path, "", path)
    // ToDo: find top component from routes
    const top_component_id = "Login"
    history.replaceState(`sspa|${top_component_id}`, "", document.location.pathname)
    page.open(top_component_id)
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

  static move(path) {
    // ToDo: find top component from routes
    const top_component_id = "Register"
    history.pushState(`sspa|${top_component_id}`, "", path)
    page.open(top_component_id)
    // const top_component_id = "Register"
    // await page.loadComponents(top_component_id)
    // page.lenderComponents(page.id("sspa-root") ? "sspa-root" : "__body", top_component_id)


    // const component = await page.loadComponent(component_id)
    // if (component) {
    //   component.lender(page.id("sspa-root") ? "sspa-root" : "__body")
    // }
  }
}