import Dom from './Dom.js'

export default class API {
  constructor(obj) {
    this.url = obj.url
    this.options = {
      method: obj.method || 'GET',
      mode: obj.mode || 'cors',
      cache: 'default',
      credentials: 'same-origin',
    }
    this.expect_content_type = obj.expect_content_type || 'json'
    this.params = obj.params || []
  }
  async call(params_map=null, headers=[]) {
    console.debug(`### Api.call() | ${this.options.method} | ${this.url}`)
    params_map = params_map || new Map()
    //// collect params
    for (const elem_id of this.params) {
      if (!params_map.has(elem_id)) {
        const elem = Dom.get(`#${elem_id}`)
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
    const re = /\{[^\}]+\}/
    while (re.test(url)) {
      const key = re.exec(url)[0].slice(1, -1)
      if (params_map.has(key)) {
        url = url.replace(`{${key}}`, params_map.get(key))
        params_map.delete(key)
      } else {
        console.error(`[Error] API parameter not found. (${key})`)
        break
      }
    }
    //// delete null param
    for (const param_set of params_map) {
      if (param_set[1] == null) {
        params_map.delete(param_set[0])
      }
    }
    //// transform for fetch
    const params_object = params_map.size > 0 ? Dom.mapToObject(params_map) : null
    if (params_object) {
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
    }
    //// set headers
    this.options.headers = new Headers()
    for (const header of headers) {
      this.options.headers.append(header.key, header.value)
    }
    if (this.options.body) {
      this.options.headers.append("Content-Type", "application/json")
    }
    //// fetch
    const resp = await fetch(url, this.options)
    //// result
    if (this.expect_content_type == 'json') {
      const result = resp.ok ? await resp.json() : { err: 999, msg: `[Error] ${resp.status} ${resp.statusText}` }
      return result
    } else if (this.expect_content_type == 'text') {
      const result = resp.ok ? await resp.text() : `[Error] ${resp.status} ${resp.statusText}`
      return result
    }
    return resp
  }
}
