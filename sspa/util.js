

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

  static newElem(node_name, parent=null, id=null, class_name=null) {
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
    return elem
  }

  static remove(elem_id) {
    const elem = this.id(elem_id)
    elem.parentNode.removeChild(elem)
  }

  static matchRuleWild(str, rule) {
    const escapeRegex = (not_regex) => {
      return not_regex.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
    }
    rule = "^" + rule.split("*").map(escapeRegex).join(".*") + "$"
    const regex = new RegExp(rule)
    return regex.test(str)
  }

}
