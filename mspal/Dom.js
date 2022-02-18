
export default class Dom {
  static special_elems = new Map([
    ["#__window", window],
    ["#__html", document.documentElement],
    ["#__header", document.header],
    ["#__body", document.body],
  ])

  static get(selector) {
    if (Dom.special_elems.has(selector)) {
      return Dom.special_elems.get(selector)
    }
    return document.querySelector(selector)
  }
  static getList(selector) {
    return Array.from(document.querySelectorAll(selector))
  }
  
  static newElem(tagname, initializer) {
    const elem = document.createElement(tagname)
    initializer(elem)
    return elem
  }

  static setExpandableNode(node, contract=true) {
    node.className = contract ? "contracted" : "expanded"
    node.appendChild(Dom.newElem('SPAN', (sp) => {
      sp.className = 'btnExpandContract'
      sp.innerText = contract ? "+" : "-"
      sp.onclick = contract ? Dom.evExpandNode : Dom.evContractNode
    }))
  }
  static evExpandNode(ev) {
    ev.stopPropagation()
    ev.target.parentNode.className = "expanded"
    sp.innerText = "-"
    ev.target.onclick = Dom.evContractNode
  }
  static evContractNode(ev) {
    ev.stopPropagation()
    ev.target.parentNode.className = "contracted"
    sp.innerText = "+"
    ev.target.onclick = Dom.evExpandNode
  }

  static openModal(target_id, block_selector='main >section') {
    const blocks = Dom.getList(block_selector)
    for (const block of blocks) {
      if (block.id == target_id) {
        block.style.display = "block"
      } else {
        block.style.display = "none"
      }
    }
  }
  static closeModal(modal_class='modal', block_selector='main >section') {
    const blocks = Dom.getList(block_selector)
    for (const block of blocks) {
      if (block.className.split(' ').includes(modal_class)) {
        block.style.display = "none"
      } else {
        block.style.display = "block"
      }
    }
  }

  static getUrlPath(url=null) {
    const target_url = url || location.href
    const pat = /^[^:]+:\/\/[^\/]+\/(.*)$/
    const m = pat.exec(target_url)
    return `/${m[1]}`
  }

  static mapToObject(map) {
    return [...map].reduce((l,[k,v]) => Object.assign(l, {[k]:v}), {})
  }
}
