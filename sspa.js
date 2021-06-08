
import Component from './sspa/Component.js'
import API from './sspa/API.js'
import Handler from './sspa/Handler.js'
import page from './sspa/page.js'

export { Component, API, Handler, page }

const starter = new Handler({
  target: '__window',
  type: 'load',
  listener: page.init
})
starter.set()
