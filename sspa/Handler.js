import util from './util.js'

export default class Handler {
  constructor(obj) {
    this.target = obj.target
    this.type = obj.type
    this.listener = obj.listener
    this.options = obj.options || {}
  }
  set() {
    const id_elem = util.id(this.target)
    const elems = id_elem ? [id_elem] : util.class(this.target)
    for (const elem of elems) {
      elem.addEventListener(this.type, this.listener, this.options)
    }
  }
}
