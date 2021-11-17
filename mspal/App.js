
import Api from './Api.js'
import Handler from './Handler.js'
import Dom from './Dom.js'

export default class App {
  static instance = null

  constructor() {
    this.base_path = ''
    this.domain = document.location.host
    this.components_dir = 'component'
    this.styles_dir = 'css'
    this.scripts_dir = 'js'
    this.root_component_target = '__body'
    this.root_component_path = 'root.js'
    this.history_prefix = 'mspal'
    this.unused_classname = 'mspal_unused'
    this.components = new Map()
    this.styles = new Map()
    this.scripts = new Map()
    this.page_back_handler = null // set in start()
    App.instance = this
  }

  /* ------------------------------------------------------------ */
  init(settings) {
    console.debug(`### App.init(settings)`)
    const keys = [
      'base_path',
      'components_dir',
      'styles_dir',
      'scripts_dir',
      'root_component_target',
      'root_component_path',
      'history_prefix',
      'unused_classname',
    ]
    for (const key of keys) {
      if (settings[key] !== undefined) {
        this[key] = settings[key]
      }
    }
  }

  start() {
    console.debug(`### App.start()`)
    this.page_back_handler = new Handler({
      target: '__window',
      type: 'popstate',
      listener: App.page_back_listener,
    })
    this.page_back_handler.set()
    history.replaceState(`${this.history_prefix}|${document.location.pathname}`, "", document.location.pathname)
    this.open()
  }

  async open() {
    this._setUnusedFlag()
    await this._lenderComponent(root_component_target, root_component_path)
    this._removeUnused()
    this.cascadeMessage(this.root_component_path, 'mspal_onload', null)
  }

  cascadeMessage(component_path, msg, params) {
    const cmp = this.components.get(component_path)
    cmp.receiveMessage(msg, params)
    const sub_cmp_map = cmp.getSubComponents()
    for (const [target, sub_cmp] of sub_cmp_map) {
      if (Dom.matchRoutes(sub_cmp.routes)) {
        this.cascadeMessage(sub_cmp.path, msg, params)
      }
    }
  }

  _setUnusedFlag() {
    for (const [path, elem] of this.styles) {
      const elem = Dom.get(`#style_${path}`)
      if (elem) {
        elem.className = this.unused_classname
      }
    }
    for (const [path, elem] of this.scripts) {
      const elem = Dom.get(`#script_${path}`)
      if (elem) {
        elem.className = this.unused_classname
      }
    }
  }
  _removeUnused() {
    const elems = Dom.getList(`.${this.unused_classname}`)
    for (const elem of elems) {
      document.head.removeChild(elem)
    }
  }

  async _lenderComponent(target, cmp_path) {
    //// load current component
    if (this.components.has(cmp_path)) {
      cmp = this.components.get(cmp_path)
    } else {
      cmp = await _loadComponent(cmp_path)
    }
    cmp.lender(target)
    //// load styles, scripts, sub_components
    const promise_list = new Array()
    //// styles
    const style_paths = cmp.getStyles()
    for (const path of style_paths) {
      if (this.styles.has(path)) {
        const elem = this.styles.get(path)
        if (elem !== null) {
          if (Dom.get(`#style_${path}`) === null) {
            document.head.appendChild(elem)
          } else {
            Dom.get(`#style_${path}`).className = '' // remove unused flag
          }
        }
      } else {
        this.styles.set(path, null) // reserve
        const promise = new Promise(async (resolve) => {
          const api = new Api({
            url: `${this.base_path}${this.styles_dir}/${path}`
          })
          const response = await api.call()
          const source = await response.text()
          const elem = Dom.newElem('STYLE', (elem) => {
            elem.id = `style_${path}`
            elem.innerText = source
          })
          document.head.appendChild(elem)
          this.styles.set(path, elem)
          resolve()
        })
        promise_list.push(promise)
      }
    }
    //// scripts
    const script_paths = cmp.getScripts()
    for (const path of script_paths) {
      if (this.scripts.has(path)) {
        const elem = this.scripts.get(path)
        if (elem !== null) {
          if (Dom.get(`#script_${path}`) === null) {
            document.head.appendChild(elem)
          } else {
            Dom.get(`#script_${path}`).className = '' // remove unused flag
          }
        }
      } else {
        this.scripts.set(path, null) // reserve
        const promise = new Promise(async (resolve) => {
          const elem = Dom.newElem('SCRIPT', (elem) => {
            elem.id = `script_${path}`
            elem.src = path
            elem.async = true
          })
          document.body.append(elem)
          this.scripts.set(path, elem)
          resolve()
        })
        promise_list.push(promise)
      }
    }
    //// sub_components
    const sub_cmp_map = cmp.getSubComponents()
    for (const [target, subcmp] of sub_cmp_map) {
      if (Dom.matchRoutes(subcmp.routes)) {
        const promise = _lenderComponent(target, subcmp.path)
        promise_list.append(promise)
      }
    }
    //// await
    await Promise.all(promise_list)
  }

  async _loadComponent(cmp_path) {
    if (this.components.has(cmp_path)) {
      return this.components.get(cmp_path)
    }
    const module = await import(`${this.base_path}${this.components_dir}/${cmp_path}`)
    const component = module ? (module.default || null) : null
    if (!component) {
      console.error(`[Error] load component error. (${cmp_path})`)
      return
    }
    this.components.set(cmp_path, component)
    return component
  }

  /* ------------------------------------------------------------ */
  static async move(path, history_record=true) {
    const app = App.instance
    if (history_record) {
      history.pushState(`${this.history_prefix}|${path}`, "", `${this.base_path}${pathname}`)
    } else {
      history.replaceState(`${this.history_prefix}|${path}`, "", `${this.base_path}${pathname}`)
    }
    await app.open()
  }

  static async page_back_listener(ev) {
    const app = App.instance
    if (app.domain == document.location.host) {
      if (ev.state.startsWith(app.history_prefix)) {
        await app.open()
      }
    }
  }

  static sendMessage(msg, param) {
    const app = App.instance
    app.cascadeMessage(app.root_component_path, msg, param)
  }
}

