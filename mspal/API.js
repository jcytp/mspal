import util from './util.js'

export default class API {
  constructor(obj) {
    this.url = obj.url
    this.options = {}
    this.options.method = obj.method ? obj.method : 'GET'
    this.options.mode = 'cors'
    this.options.cache = 'default'
    this.options.credentials = 'same-origin'
    this.params = obj.params ? obj.params : []
  }
  async call() {
    console.debug(`### API.call() | url: ${this.url}, method: ${this.options.method}, params: ${this.params}`)
    const params = {}
    let url = this.url
    for (const elem_id of this.params) {
      const elem = util.id(elem_id)
      if (elem) {
        switch (elem.tagName) {
          case 'INPUT':
          case 'SELECT':
            params[elem_id] = elem.value
            break
        }
      }
    }
    switch (this.options.method) {
      case 'GET':
        // ToDo: append params to url
        break
      case 'POST':
      case 'PUT':
        this.options.body = JSON.stringify(params)
        break
    }
    const response = await fetch(url, this.options)
    if (!response.ok) {
      console.error(`API.call() api response error | url: ${this.url}, method: ${this.options.method}, params: ${this.params}`)
    }
    return response
  }
}
