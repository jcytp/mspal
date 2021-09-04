

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
    // console.log(`escapeRegex('/login') : ${escapeRegex('/login')}`)
    console.log(rule.split("*"))
    console.log(rule.split("*").map(escapeRegex))
    // console.log(`rule.split("*").map(escapeRegex) : ${rule.split("*").map(escapeRegex)}`)
    rule = "^" + rule.split("*").map(escapeRegex).join(".*") + "$"
    const regex = new RegExp(rule)
    console.log(`str: ${str}`)
    console.log(`rule: ${rule}`)
    console.log(`${regex.test(str) ? 'matched' : 'NOT matched'}`)
    return regex.test(str)
  }

}
