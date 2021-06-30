export class page {
  static components = new Map()
  static special_elems = new Map([
    ["__window", window],
  ])

  static id(elem_id) {
    if (page.special_elems.has(elem_id)) {
      return page.special_elems.get(elem_id)
    }
    return document.getElementById(elem_id)
  }
  static class(elem_classname) {
    return Array.from(document.getElementsByClassName(elem_classname))
  }
  async static loadComponent(component_id) {
    if (page.components.has(component_id)) {
      return page.components.get(component_id)
    } else {
      const module = await import (`/components/${component_id}.js`)
      const component = module ? (module.cmp ? module.cmp : null) : null
      page.components.set(component_id, component)
      return component
    }
  }
  static async init() {
    // read from routes.json
    const routes = new Map()
    // find top component from routes
    const component_id = 'Login'
    let component = await page.loadComponent(component_id)
    component.lender('sspa-root')
  }
}