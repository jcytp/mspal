

export default class util {

  static special_elems = new Map([
    ["__window", window],
    ["__html", document.documentElement],
    ["__body", document.getElementsByTagName("BODY")[0]],
  ])

  static id(elem_id) {
    if (this.special_elems.has(elem_id)) {
      return this.special_elems.get(elem_id)
    }
    return document.getElementById(elem_id)
  }
  
  static class(elem_classname) {
    return Array.from(document.getElementsByClassName(elem_classname))
  }

  static mapToObject(map) {
    return [...map].reduce((l,[k,v]) => Object.assign(l, {[k]:v}), {})
  }

  static newElem(node_name, parent=null, id=null, class_name=null, text=null) {
    const elem = document.createElement(node_name)
    if (parent) {
      this.id(parent).appendChild(elem)
    }
    if (id) {
      elem.id = id
    }
    if (class_name) {
      elem.className = class_name
    }
    if (text) {
      elem.innerText = text
    }
    return elem
  }

  static remove(elem_id) {
    const elem = this.id(elem_id)
    if (elem) {
      elem.parentNode.removeChild(elem)
    }
  }

  static matchRule(str, rule) {
    const regex = new RegExp("^" + rule.replace(/\{.*\}/g, "[^/]+") + "$")
    return regex.test(str)
  }

}
