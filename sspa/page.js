export class page {
  static components = new Map()

  static id(elem_id) {
    return document.getElementById(elem_id)
  }
  static class(elem_classname) {
    return Array.from(document.getElementsByClassName(elem_classname))
  }
  static loadComponent(component_id) {
    if (page.components.has(component_id)) {
      return page.components.get(component_id)
    } else {
      let component = (await import (`/components/${component_id}.js`)).cmp
      page.components.set(component_id, component)
      return component
    }
  }
  static async init() {
    // read from routes.json
    const routes = new Map()
    // find top component from routes
    const component_id = 'Login'
    let component = page.loadComponent(component_id)
    component.lender('sspa-root')
  }
}