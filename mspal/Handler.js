import Dom from './Dom.js'

export default class Handler {
  constructor(obj) {
    this.target = obj.target
    this.type = obj.type
    this.listener = obj.listener
    this.options = obj.options || {}
  }
  set() {
    const id_elem = Dom.get(`#${this.target_id}`)
    const elems = id_elem ? [id_elem] : Dom.getList(`.${this.target}`)
    for (const elem of elems) {
      elem.addEventListener(this.type, this.listener, this.options)
    }
  }
  fire() {
    const id_elem = Dom.get(`#${this.target_id}`)
    const elems = id_elem ? [id_elem] : Dom.getList(`.${this.target}`)
    for (const elem of elems) {
      const ev = new Event(this.type)
      elem.dispatchEvent(ev)
    }
  }
}
