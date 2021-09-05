import util from './util.js'

export default class API {
  constructor(obj) {
    this.url = obj.url
    this.options = {}
    this.options.method = obj.method ? obj.method : 'GET'
    this.options.mode = obj.mode ? obj.mode : 'cors'
    this.options.cache = 'default'
    this.options.credentials = 'same-origin'
    this.params = obj.params ? obj.params : []
  }
  async call(params_map=new Map()) {
    console.debug(`### API.call() | url: ${this.url}, method: ${this.options.method}, params: ${this.params}`)
    //// collect params
    for (const elem_id of this.params) {
      if (!params_map.has(elem_id)) {
        const elem = util.id(elem_id)
        if (elem) {
          switch (elem.tagName) {
            case 'INPUT':
            case 'SELECT':
              params_map.set(elem_id, elem.value)
              break
          }
        }
      }
    }
    //// set url params
    let url = this.url
    const re = /\{.+\}/
    // while (re.test(url)) {
    if (re.test(url)) {
      console.debug(`url: ${url}`)
      const key = re.exec(url)[0].substring(1, -1)
      console.debug(`key: ${key}`)
      console.debug(`params_map: ${[...params_map]}`)
      if (params_map.has(key)) {
        url = url.replace(`{${key}}`, params_map.get(key))
        params_map.delete(key)
      }
      console.debug(`url: ${url}`)
    }
    //// transform for fetch
    const params_object = util.mapToObject(params_map)
    switch (this.options.method) {
      case 'GET':
        const query_params = new URLSearchParams(params_object)
        url = `${url}?${query_params}`
        break
      case 'POST':
      case 'PUT':
        this.options.body = JSON.stringify(params_object)
        break
    }
    const response = await fetch(url, this.options)
    if (!response.ok) {
      console.error(`API.call() api response error | url: ${this.url}, method: ${this.options.method}, params: ${this.params}`)
    }
    return response
  }
}
