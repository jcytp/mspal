import App from "./App.js"
import Handler from "./Handler.js"
import Dom from "./Dom.js"

export default class Component {
  constructor() {
    this.target_id = null
    this.html = null
    this.sub_components = new Array()
    this.style_paths = new Array()
    this.script_paths = new Array()
    this.apis = new Map()
    this.handlers = new Map()
    this.msg_actions = new Map()
    this.valuables = new Map()
  }
  setHtml(html) {
    this.html = html
  }
  saveHtml() {
    this.html = Dom.get(`#${this.target_id}`).innerHTML
  }
  addSubComponent(target_id, path, routes=['*']) {
    for (let i=0; i<routes.length; i++) {
      let route = routes[i]
      // delete slash
      if (route.startsWith('/')) {
        route = route.slice(1)
      }
      // extract *
      route = route.replaceAll('*', '.*')
      // extract {}
      const brackets_pat = new RegExp('{[^}]*}')
      let match
      while ((match = brackets_pat.exec(route)) !== null) {
        route = route.replace(match[0], '[^/]+')
      }
      routes[i] = route
    }
    this.sub_components.push({
      target_id: target_id,
      path: path,
      routes: routes,
    })
  }
  addStyle(path) {
    this.style_paths.push(path)
  }
  addScript(path) {
    this.script_paths.push(path)
  }
  addApi(name, api) {
    this.apis.set(name, api)
  }
  addHandler(name, handler) {
    this.handlers.set(name, handler)
  }
  addMsgAction(msg, action) {
    this.msg_actions.set(msg, action)
  }
  setValuable(name, value) {
    this.valuables.set(name, value)
  }
  getHtml() {
    return this.html
  }
  getSubComponents() {
    return this.sub_components
  }
  getStyles() {
    return this.style_paths
  }
  getScripts() {
    return this.script_paths
  }
  getAPI(name) {
    return this.apis.get(name)
  }
  getHandler(name) {
    return this.handlers.get(name)
  }
  getMsgAction(msg) {
    return this.msg_actions.get(msg)
  }
  getValuable(name) {
    return this.valuables.get(name)
  }

  addClickHandler(target_id, func, setup=false) {
    this.addHandler(`mspal_click_${target_id}`, new Handler({
      target: target_id,
      type: 'click',
      listener: (ev) => {
        ev.preventDefault()
        func(ev)
      },
    }))
    if (setup) {
      this.handlers.get(`mspal_click_${target_id}`).set()
    }
  }
  addInnerLink(target_id, link_path, setup=false) {
    this.addClickHandler(target_id, (ev) => {
      App.move(link_path)
    }, setup)
  }
  addOnloadAction(action) {
    if (this.msg_actions.has('mspal_onload')) {
      const current = this.msg_actions.get('mspal_onload')
      this.msg_actions.set('mspal_onload', (param) => {
        current()
        action()
      })
    } else {
      this.msg_actions.set('mspal_onload', (param) => {
        action()
      })
    }
  }

  lender(target_id) {
    console.debug(`### Component.lender(${target_id})`)
    const elem = Dom.get(`#${target_id}`)
    if (elem) {
      if (this.html === null) {
        this.html = elem.innerHTML
      } else {
        elem.innerHTML = this.html
      }
      for (const [name, handler] of this.handlers) {
        handler.set()
      }
      this.target_id = target_id
    }
  }
  async callApi(name, form_id=null, params=null) {
    if (params === null) {
      params = new Map()
    }
    if (form_id) {
      const form_data = new FormData(Dom.get(`#${form_id}`))
      for (const pair of form_data.entries()) {
        if (!params.has(pair[0])) {
          params.set(pair[0], pair[1])
        }
      }
    }
    const api = this.apis.get(name)
    if (api === null) {
      console.error(`[Error] load api error. (${name})`)
    }
    return await api.call(params)
  }
  receiveMessage(msg, params) {
    const action = this.msg_actions.get(msg)
    if (action) {
      action(params)
    }
  }
}
