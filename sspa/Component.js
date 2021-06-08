export class Component {
  constructor(id) {
    this.id = id
    this.html = ''
    this.child = new Map()
    this.api = new Map()
    this.handler = new Map()
  }
  setHtml(html) {
    this.html = html
  }
  addChild(elem_id, component) {
    this.child.set(elem_id, component)
  }
  addAPI(name, api) {
    this.api.set(name, api)
  }
  addHandler(name, handler) {
    this.handler.set(name, handler)
  }
  lender(target_id) {
    // insert html into current page
  }
  async callAPI(name) {
    const api = this.api.get(name)
    if (api) {
      return await api.call()
    }
  }
}

