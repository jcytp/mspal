

export default class util {

  static special_elems = new Map([
    ["__window", window],
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

  static matchRuleWild(str, rule) {
    const escapeRegex = (not_regex) => {
      not_regex.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
    }
    rule = "^" + rule.split("*").map(escapeRegex).join(".*") + "$"
    const regex = new RegExp(rule)
    return regex.test(str)
  }

}
